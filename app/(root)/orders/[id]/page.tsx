import { auth } from "@/auth";
import { getOrderbyId } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const OrderPage = async ({ params }: Props) => {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");

  const { id } = await params;
  const order = await getOrderbyId(id);

  if (!order) notFound();

  return <div>OrderPage </div>;
};

export default OrderPage;
