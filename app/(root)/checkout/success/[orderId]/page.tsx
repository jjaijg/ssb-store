import { auth } from "@/auth";
import { getOrderbyId } from "@/lib/actions/order.actions";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function CheckoutSuccessPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const { orderId } = await params;

  const order = await getOrderbyId(orderId);
  if (!order) redirect("/");

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 64,
              color: "success.main",
              mb: 2,
            }}
          />

          <Typography variant="h4" gutterBottom>
            Thank You!
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your order has been successfully placed
          </Typography>

          <Box sx={{ my: 4 }}>
            <Typography variant="body1" paragraph>
              Order #{order.orderNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We'll send you a confirmation email with your order details
            </Typography>
          </Box>

          <Box
            sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Button
              component={Link}
              href={`/user/orders/${order.id}`}
              variant="contained"
            >
              View Order
            </Button>
            <Button component={Link} href="/" variant="outlined">
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
