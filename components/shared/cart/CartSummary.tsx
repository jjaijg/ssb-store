import { Paper, Typography, Button, Stack, Divider } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { SerializedCart, SerializedCartItem } from "@/types";

type Props = {
  cart: SerializedCart;
};

export default function CartSummary({ cart }: Props) {
  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (item: SerializedCartItem) => {
    const originalPrice = item.price;
    if (!item.discountValue) return originalPrice;

    return item.discountType === "PERCENTAGE"
      ? originalPrice - (originalPrice * item.discountValue) / 100
      : originalPrice - item.discountValue;
  };

  // Calculate totals with discounts
  const subtotal = cart.items.reduce(
    (total, item) => total + calculateDiscountedPrice(item) * item.quantity,
    0
  );

  const shipping = subtotal > 999 ? 0 : 100;
  const total = subtotal + shipping;

  // Calculate total savings
  const totalSavings = cart.items.reduce((savings, item) => {
    const originalTotal = item.price * item.quantity;
    const discountedTotal = calculateDiscountedPrice(item) * item.quantity;
    return savings + (originalTotal - discountedTotal);
  }, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography>₹{subtotal.toFixed(2)}</Typography>
        </Stack>
        {totalSavings > 0 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography color="success.main">Total Savings</Typography>
            <Typography color="success.main">
              -₹{totalSavings.toFixed(2)}
            </Typography>
          </Stack>
        )}
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Shipping</Typography>
          <Typography>{shipping === 0 ? "Free" : `₹${shipping}`}</Typography>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1">Total</Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            ₹{total.toFixed(2)}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          href="/checkout"
          endIcon={<ArrowForward />}
        >
          Proceed to Checkout
        </Button>
      </Stack>
    </Paper>
  );
}
