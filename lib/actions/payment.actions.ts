"use server";

import { Orders } from "razorpay/dist/types/orders";
import { SERVER_URL } from "../constants";
import { prisma } from "../prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { convertToPlainObject } from "../utils";
import { SerializedOrder } from "@/types";
import { auth } from "@/auth";

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
  paymentStatus?: PaymentStatus,
  paymentResult?: PaymentResult
) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { variant: true },
        },
      },
    });

    if (!order) throw new Error("Order not found");

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Start transaction to update both order and stock
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: status,
          ...(paymentStatus ? { paymentStatus: paymentStatus } : {}),
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

      // If order is cancelled or refunded, restore stock
      if (status === "CANCELLED" || status === "REFUNDED") {
        await Promise.all(
          order.items.map((item) =>
            tx.productVariant.update({
              where: { id: item.variant.id },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            })
          )
        );
      }

      return updatedOrder;
    });

    return convertToPlainObject<SerializedOrder>(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}
