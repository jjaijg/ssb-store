"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Link as MuiLink,
} from "@mui/material";
import { MoreVert, Launch as LaunchIcon } from "@mui/icons-material";
import { useState } from "react";
import { format } from "date-fns";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/lib/actions/payment.actions";
import { SerializedOrder } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  orders: SerializedOrder[];
}

export default function OrdersTable({ orders }: Props) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<SerializedOrder | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [paidDate, setPaidDate] = useState<string>("");

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    order: SerializedOrder
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!selectedOrder) return;

    try {
      if (status === "CANCELLED" || status === "REFUNDED") {
        const confirmed = window.confirm(
          `Are you sure you want to ${status.toLowerCase()} this order? This will restore the product stock.`
        );
        if (!confirmed) return;
      }

      await updateOrderStatus(selectedOrder.id, status, {});
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
    handleMenuClose();
  };

  const handleUpdatePaidDate = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder.id, "CONFIRMED", {
        paymentStatus: "PAID",
        paidAt: new Date(paidDate),
      });
      setOpenDialog(false);
      //   window.location.reload();
      router.refresh();
    } catch (error) {
      console.error("Failed to update paid date:", error);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Date</TableCell>
              {/* <TableCell>Customer</TableCell> */}
              <TableCell>Total</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <MuiLink
                      component={Link}
                      href={`/admin/orders/${order.id}`}
                    >
                      {order.orderNumber} <LaunchIcon fontSize="small" />
                    </MuiLink>
                  </TableCell>
                  <TableCell>{format(order.createdAt, "PPp")}</TableCell>
                  {/* <TableCell>{order.user.name}</TableCell> */}
                  <TableCell>₹{Number(order.total).toFixed(2)}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.paymentStatus}
                      color={
                        order.paymentStatus === "PAID" ? "success" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={
                        order.status === "CONFIRMED"
                          ? "success"
                          : order.status === "CANCELLED"
                          ? "error"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, order)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusUpdate("PROCESSING")}>
          Mark as Processing
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate("SHIPPED")}>
          Mark as Shipped
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate("DELIVERED")}>
          Mark as Delivered
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate("REFUNDED")}>
          Mark as Refunded
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate("CANCELLED")}>
          Cancel Order
        </MenuItem>
        {selectedOrder?.paymentMethod === "COD" &&
          selectedOrder?.paymentStatus !== "PAID" && (
            <MenuItem onClick={() => setOpenDialog(true)}>
              Update Payment Date
            </MenuItem>
          )}
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Payment Date</DialogTitle>
        <DialogContent>
          <TextField
            type="datetime-local"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
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
