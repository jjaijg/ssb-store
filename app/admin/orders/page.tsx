import { auth } from "@/auth";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import OrdersTable from "./OrdersTable";
import { getOrders } from "@/lib/actions/order.actions";

type Props = {};

const AdminOrdersPage = async (props: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  const orders = (await getOrders()) || [];

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <OrdersTable orders={orders} />
      </Paper>
    </Box>
  );
};

export default AdminOrdersPage;
