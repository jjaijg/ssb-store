import { auth } from "@/auth";
import { getOrderDetailsById } from "@/lib/actions/order.actions";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import React from "react";
import PayNowButton from "@/components/shared/PayNowButton";

type Props = {
  params: Promise<{ orderId: string }>;
};

const UserOrderPage = async ({ params }: Props) => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { orderId } = await params;

  const order = await getOrderDetailsById(orderId);

  if (!order) redirect("/users/orders");

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h5">Order #{order.orderNumber}</Typography>
              <Chip
                label={order.status}
                color={order.status === "CONFIRMED" ? "success" : "default"}
              />
            </Box>
            <Typography color="text.secondary">
              Placed on {format(order.createdAt, "PPP")}
            </Typography>
          </Paper>
        </Grid>

        {/* Order Items */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              {order.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Image
                    src={
                      item.variant.images[0] ||
                      "https://placehold.co/300x300/png"
                    }
                    alt={item.variant.product.name}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">
                      {item.variant.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.variant.value}
                      {item.variant.unit} × {item.quantity}
                    </Typography>
                    {item.discount > 0 && (
                      <Typography variant="body2" color="success.main">
                        Saved ₹{Number(item.discount).toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="subtitle1">
                      ₹{(Number(item.total) - Number(item.discount)).toFixed(2)}
                    </Typography>
                    {item.discount > 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        ₹{Number(item.total).toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Details Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Payment Info */}
            <Card>
              <CardContent>
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
                  <Typography color="text.secondary">Status</Typography>
                  <Chip
                    size="small"
                    label={order.paymentStatus}
                    color={
                      order.paymentStatus === "PAID" ? "success" : "default"
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="text.secondary">Method</Typography>
                  <Typography>
                    {order.paymentMethod === "RAZORPAY"
                      ? "Online payment"
                      : "COD"}
                  </Typography>
                </Box>
                {order.paymentStatus === "PAID" && order.paidAt && (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="text.secondary">Paid on</Typography>
                    <Typography>{format(order.paidAt, "PPp")}</Typography>
                  </Box>
                )}
                <PayNowButton
                  orderId={order.id}
                  orderStatus={order.status}
                  paymentMethod={order.paymentMethod!}
                  paymentStatus={order.paymentStatus}
                />
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Price Details
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
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                    }}
                  >
                    <Typography>Total</Typography>
                    <Typography>₹{Number(order.total).toFixed(2)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent>
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
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserOrderPage;
