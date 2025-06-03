import { Orders } from "razorpay/dist/types/orders";
import { prisma } from "../prisma";
import { SERVER_URL } from "../constants";

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
