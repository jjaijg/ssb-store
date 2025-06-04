"use client";

import {
  initializePayment,
  updateOrderStatus,
} from "@/lib/actions/payment.actions";
import { initializeRazorpayPayment } from "@/lib/utils";
import { RazorpayOptions, SerializedOrder } from "@/types";
import { Box, Button, Typography } from "@mui/material";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React from "react";

type Props = {
  order: SerializedOrder;
  user: User;
};

const HandlePayment = ({ order, user }: Props) => {
  const router = useRouter();

  const handlePayment = async () => {
    try {
      const razorpayOrder = await initializePayment({
        total: order.total,
        receipt: order.orderNumber,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Number(razorpayOrder.amount),
        currency: "INR",
        name: "SSB Store",
        description: `Payment for order ${order.orderNumber}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: "admin@ssb.in",
        },
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/verify", {
              method: "POST",
              body: JSON.stringify(response),
            });

            if (verifyResponse.ok) {
              // Update order with complete payment result
              await updateOrderStatus(
                order.id,
                "CONFIRMED",
                response // Pass the complete response
              );
              router.push(`/checkout/success/${order.id}`);
            } else {
              // Update order with failed status
              await updateOrderStatus(order.id, "PENDING");
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            await updateOrderStatus(order.id, "PENDING");
            router.push(`/checkout/failed/${order.id}`);
          }
        },
        method: {
          upi: {
            flow: "collect", // or "intent"
            vpa: "success@razorpay", // Test UPI ID
          },
          netbanking: false,
          card: true,
          wallet: false,
          paylater: false,
        },
        // theme: {
        //   color: "#1976d2",
        // },
      } satisfies RazorpayOptions;

      await initializeRazorpayPayment(options);
    } catch (error) {
      console.error("Payment failed:", error);
      router.push(`/checkout/failed/${order.id}`);
    }
  };
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Complete Your Payment
        </Typography>
        <Button variant="contained" onClick={handlePayment} size="large">
          Pay Now
        </Button>
      </Box>
    </>
  );
};

export default HandlePayment;
