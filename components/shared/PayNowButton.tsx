"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { OrderStatus, PaymentStatus, type Order } from "@prisma/client";

interface Props {
  orderId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
}

export default function PayNowButton({
  orderId,
  orderStatus,
  paymentMethod,
  paymentStatus,
}: Props) {
  const router = useRouter();

  const handlePayment = () => {
    router.push(`/checkout/payment/${orderId}`);
  };

  if (
    orderStatus === "PENDING" &&
    paymentStatus === "PENDING" &&
    paymentMethod === "RAZORPAY"
  ) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        fullWidth
        sx={{ mt: 2 }}
      >
        Pay Now
      </Button>
    );
  }

  return null;
}
