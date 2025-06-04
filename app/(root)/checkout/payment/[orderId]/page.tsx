import { auth } from "@/auth";
import React from "react";
import { getOrderbyId } from "@/lib/actions/order.actions";
import { Box, Container, Paper, Typography, Divider } from "@mui/material";
import HandlePayment from "@/components/checkout/HandlePayment";

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
      <Container maxWidth="sm">
        <Box sx={{ py: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom align="center">
              Complete Your Payment
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              Order #{order.orderNumber}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography color="text.secondary">Amount to Pay</Typography>
                <Typography variant="h6">
                  ₹{Number(order.total).toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <HandlePayment order={order} user={session.user} />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
              }}
            >
              Secured by Razorpay 🔒
            </Typography>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default PaymentPage;
