"use server";

import { Orders } from "razorpay/dist/types/orders";
import { SERVER_URL } from "../constants";
import { prisma } from "../prisma";
import { OrderStatus } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { convertToPlainObject } from "../utils";
import { SerializedOrder } from "@/types";

interface PaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function initializePayment({
  total,
  receipt,
}: {
  total: number;
  receipt: string;
}) {
  try {
    const response = await fetch(`${SERVER_URL}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: total,
        receipt,
      }),
    });

    const razorpayOrder = (await response.json()) as Orders.RazorpayOrder;

    return razorpayOrder;
  } catch (error) {
    console.error("Payment initialization failed:", error);
    throw new Error("Failed to initialize payment");
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentResult?: PaymentResult
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
        paymentStatus: status === "CONFIRMED" ? "PAID" : "FAILED",
        ...(paymentResult && {
          paymentId: paymentResult.razorpay_payment_id,
          paymentResult: paymentResult as unknown as InputJsonValue,
          paidAt: new Date(),
        }),
      },
      include: {
        items: true,
      },
    });
    return convertToPlainObject<SerializedOrder>(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}
