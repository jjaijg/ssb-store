"use server";

import { Orders } from "razorpay/dist/types/orders";
import { SERVER_URL } from "../constants";
import { prisma } from "../prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { convertToPlainObject } from "../utils";
import { PaymentResult, SerializedOrder } from "@/types";
import { auth } from "@/auth";

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
  paymentDetails: {
    paymentStatus?: PaymentStatus;
    paymentResult?: unknown;
    paidAt?: Date;
  }
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

    const { paymentStatus, paymentResult, paidAt } = paymentDetails;
    const paymentId = paymentResult
      ? (paymentResult as PaymentResult)?.razorpay_payment_id ?? undefined
      : undefined;
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Start transaction to update both order and stock
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: status,
          paymentStatus,
          paymentResult: paymentResult as unknown as InputJsonValue,
          paidAt,
          ...(paymentId ? { paymentId } : {}),
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

export async function updateOrderPaymentMethod(
  orderId: string,
  paymentMethod: "RAZORPAY" | "COD"
) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
      },
    });
  } catch (error) {
    console.error("Failed to update payment method:", error);
    throw new Error("Failed to update payment method");
  }
}
