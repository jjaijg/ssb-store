"use client";

import { Button, Menu, MenuItem } from "@mui/material";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderPaymentMethod } from "@/lib/actions/payment.actions";

interface Props {
  orderId: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
}

export default function PayNowButton({
  orderId,
  orderStatus,
  paymentMethod,
  paymentStatus,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePaymentMethod = (method: "RAZORPAY" | "COD") => {
    startTransition(async () => {
      try {
        await updateOrderPaymentMethod(orderId, method);
        if (method === "RAZORPAY") {
          router.push(`/checkout/payment/${orderId}`);
        } else {
          router.refresh();
        }
      } catch (error) {
        console.error("Error updating payment method:", error);
      }
      handleClose();
    });
  };

  if (orderStatus === "CANCELLED" || paymentStatus === "PAID") {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleClick}
        disabled={pending}
      >
        {paymentStatus === "FAILED" ? "Retry Payment" : "Pay Now"}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => handlePaymentMethod("RAZORPAY")}
          // disabled={paymentMethod === "RAZORPAY"}
        >
          Pay Online (Razorpay)
        </MenuItem>
        <MenuItem
          onClick={() => handlePaymentMethod("COD")}
          disabled={paymentMethod === "COD"}
        >
          Cash on Delivery
        </MenuItem>
      </Menu>
    </>
  );
}
