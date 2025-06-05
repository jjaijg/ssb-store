import { auth } from "@/auth";
import { getAdminOrderDetailsById } from "@/lib/actions/order.actions";
import {
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import React from "react";
import OrderItems from "./OrderItems";
import OrderStatusUpdate from "./OrderStatusUpdate";

type Props = {
  params: Promise<{
    orderId: string;
  }>;
};

const AdminOrderdetailsPage = async ({ params }: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") redirect("/");

  const { orderId } = await params;

  const order = await getAdminOrderDetailsById(orderId);

  if (!order) redirect("/admin/orders");

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Order Header */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box>
                  <Typography variant="h5">
                    Order #{order.orderNumber}
                  </Typography>
                  <Typography color="text.secondary">
                    Placed on {format(order.createdAt, "PPp")}
                  </Typography>
                </Box>
                <OrderStatusUpdate
                  orderId={order.id}
                  currentStatus={order.status}
                  paymentStatus={order.paymentStatus}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Order Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <OrderItems items={order.items} />
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Customer Info */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Details
                </Typography>
                {/* <Typography>{order.user.name}</Typography>
                <Typography color="text.secondary">
                  {order.user.email}
                </Typography> */}
              </Paper>

              {/* Payment Info */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="text.secondary">Method</Typography>
                  <Typography>{order.paymentMethod}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography color="text.secondary">Status</Typography>
                  <Chip
                    label={order.paymentStatus}
                    color={
                      order.paymentStatus === "PAID" ? "success" : "default"
                    }
                    size="small"
                  />
                </Box>
                {order.paidAt && (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">Paid on</Typography>
                    <Typography>{format(order.paidAt, "PPp")}</Typography>
                  </Box>
                )}
              </Paper>

              {/* Shipping Address */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>{order.shippingAddress.name}</Typography>
                <Typography>
                  {order.shippingAddress.door}, {order.shippingAddress.street}
                </Typography>
                {order.shippingAddress.landmark && (
                  <Typography>{order.shippingAddress.landmark}</Typography>
                )}
                <Typography>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </Typography>
                <Typography>{order.shippingAddress.country}</Typography>
              </Paper>

              {/* Order Summary */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Subtotal</Typography>
                    <Typography>
                      ₹{Number(order.subtotal).toFixed(2)}
                    </Typography>
                  </Box>
                  {Number(order.discount) > 0 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography color="success.main">Discount</Typography>
                      <Typography color="success.main">
                        -₹{Number(order.discount).toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Shipping</Typography>
                    <Typography>
                      ₹{Number(order.shippingCost).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>Tax</Typography>
                    <Typography>₹{Number(order.tax).toFixed(2)}</Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">Total</Typography>
                    <Typography variant="subtitle1">
                      ₹{Number(order.total).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminOrderdetailsPage;
