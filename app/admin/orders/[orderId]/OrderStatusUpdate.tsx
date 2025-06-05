"use client";

import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/payment.actions";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
  paymentStatus,
}: Props) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [paidDate, setPaidDate] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = async (status: OrderStatus) => {
    try {
      if (status === "CANCELLED" || status === "REFUNDED") {
        const confirmed = window.confirm(
          `Are you sure you want to ${status.toLowerCase()} this order? This will restore the product stock.`
        );
        if (!confirmed) return;
      }

      await updateOrderStatus(orderId, status);
      router.refresh();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
    handleClose();
  };

  const handleUpdatePaidDate = async () => {
    try {
      await updateOrderStatus(orderId, currentStatus);
      setOpenDialog(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update paid date:", error);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        color={currentStatus === "CANCELLED" ? "error" : "primary"}
      >
        {currentStatus}
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => handleStatusUpdate("PROCESSING")}
          disabled={currentStatus === "PROCESSING"}
        >
          Mark as Processing
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusUpdate("SHIPPED")}
          disabled={currentStatus === "SHIPPED"}
        >
          Mark as Shipped
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusUpdate("DELIVERED")}
          disabled={currentStatus === "DELIVERED"}
        >
          Mark as Delivered
        </MenuItem>
        <MenuItem
          onClick={() => handleStatusUpdate("CANCELLED")}
          disabled={currentStatus === "CANCELLED"}
        >
          Cancel Order
        </MenuItem>
        {paymentStatus !== "PAID" && (
          <MenuItem onClick={() => setOpenDialog(true)}>
            Update Payment Date
          </MenuItem>
        )}
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Payment Date</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              type="datetime-local"
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdatePaidDate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
