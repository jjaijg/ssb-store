import { auth } from "@/auth";
import React from "react";
import HandlePayment from "./HandlePayment";
import { initializePayment } from "@/lib/actions/payment.actions";
import { getOrderbyId } from "@/lib/actions/order.actions";

type Props = {
  params: Promise<{ orderId: string }>;
};

const PaymentPage = async ({ params }: Props) => {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { orderId } = await params;

  const order = await getOrderbyId(orderId);

  if (!order) throw new Error("Order not found");

  return (
    <>
      <HandlePayment order={order} user={session.user} />
    </>
  );
};

export default PaymentPage;
