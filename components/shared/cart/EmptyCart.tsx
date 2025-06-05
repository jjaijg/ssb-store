import { Box, Container, Typography, Button } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          py: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <ShoppingCart sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" component={"p"} mb={2}>
          Looks like you haven&apos;t added any items to your cart yet.
        </Typography>
        <Button component={Link} href="/" variant="contained" size="large">
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
}
