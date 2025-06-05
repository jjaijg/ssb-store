import { Container, Grid, Typography } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { SerializedCart } from "@/types";
import CartItems from "@/components/shared/cart/CartItems";
import CartSummary from "@/components/shared/cart/CartSummary";
import EmptyCart from "@/components/shared/cart/EmptyCart";

type Props = {
  cart: SerializedCart | null;
};

export default function CartDetails({ cart }: Props) {
  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} className="min-h-screen">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 4,
        }}
      >
        <ShoppingCart /> Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <CartItems items={cart.items} />
        </Grid>

        {/* Cart Summary */}
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <CartSummary cart={cart} />
        </Grid>
      </Grid>
    </Container>
  );
}
