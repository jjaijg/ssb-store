import { auth } from "@/auth";
import { getOrderbyId } from "@/lib/actions/order.actions";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import Link from "next/link";
import { redirect } from "next/navigation";
import HandlePayment from "@/components/checkout/HandlePayment";

interface Props {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function CheckoutFailedPage({ params }: Props) {
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
          <ErrorIcon
            sx={{
              fontSize: 64,
              color: "error.main",
              mb: 2,
            }}
          />

          <Typography variant="h4" gutterBottom>
            Payment Failed
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            We couldn't process your payment for order #{order.orderNumber}
          </Typography>

          <Box sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Don't worry, your order is saved. You can:
            </Typography>
            <Box sx={{ mt: 3 }}>
              <HandlePayment order={order} user={session.user} />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              component={Link}
              href={`/user/orders/${order.id}`}
              variant="outlined"
            >
              View Order Details
            </Button>
            <Button component={Link} href="/help" variant="text" color="info">
              Need Help?
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
