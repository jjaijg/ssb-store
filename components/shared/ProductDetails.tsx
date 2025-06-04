"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Stack,
  Rating,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Breadcrumbs,
  Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useTransition } from "react";
import { SerializedProductWithVariants, SerializedCart } from "@/types";
import { Brand, Category } from "@prisma/client";
import QuantitySelector from "./QuantitySelector";
import NextLink from "next/link";
import ProductImageGallery from "./ProductImageGallery";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { toast } from "react-toastify";

type Props = {
  product: SerializedProductWithVariants & {
    brand: Brand;
    category: Category;
  };
  cart: SerializedCart | null;
};

export default function ProductDetails({ product, cart }: Props) {
  const [pending, startTransition] = useTransition();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((v) => v.isDefault) || product.variants[0]
  );

  // Calculate discounted price
  const originalPrice = selectedVariant.price || 0;
  const discountedPrice =
    selectedVariant.discountType === "PERCENTAGE"
      ? originalPrice - originalPrice * (selectedVariant.discountValue / 100)
      : selectedVariant.discountType === "FIXED"
      ? originalPrice - selectedVariant.discountValue
      : originalPrice;

  const handleQuantityChange = (qty: number, action: "add" | "remove") => {
    if (!selectedVariant) return;

    // Update cart logic here
    if (action === "add") {
      startTransition(async () => {
        const { message, success } = await addToCart({
          variantId: selectedVariant.id,
          price: selectedVariant.price,
          discountType: selectedVariant.discountType,
          discountValue: selectedVariant.discountValue,
          quantity: 1,
        });

        if (success) toast.success(message);
        if (!success) toast.error(message);
      });
    } else if (action === "remove") {
      startTransition(async () => {
        const { message, success } = await removeFromCart(selectedVariant.id);

        if (success) toast.success(message);
        if (!success) toast.error(message);
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="Breadcrumbs">
        <Link component={NextLink} underline="hover" color="inherit" href="/">
          <HomeIcon />
        </Link>
        <Link component={NextLink} underline="hover" color="inherit" href="#">
          products
        </Link>
        <Link
          component={NextLink}
          underline="hover"
          color="text.primary"
          href={`/product/${product.slug}`}
          aria-current="page"
        >
          {product.name}
        </Link>
      </Breadcrumbs>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductImageGallery
            images={selectedVariant.images}
            alt={product.name}
          />
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {product.brand.name}
              </Typography>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography color="text.secondary">
                ({product.ratingCount} reviews)
              </Typography>
            </Stack>

            <Divider />

            {/* Variants */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Select {product.variants[0].unit}
              </Typography>
              <ToggleButtonGroup
                value={selectedVariant.id}
                exclusive
                onChange={(_, value) => {
                  if (value) {
                    const variant = product.variants.find(
                      (v) => v.id === value
                    );
                    if (variant) setSelectedVariant(variant);
                  }
                }}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {product.variants.map((variant) => (
                  <ToggleButton
                    key={variant.id}
                    value={variant.id}
                    disabled={!variant.isActive || variant.stock === 0}
                  >
                    <Tooltip title={variant.stock === 0 ? "Out of Stock" : ""}>
                      <Stack alignItems="center" spacing={0.5}>
                        <Typography>
                          {variant.value}
                          {variant.unit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ₹{variant.price}
                        </Typography>
                      </Stack>
                    </Tooltip>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {/* Price */}
            <Box>
              <Typography variant="h4" color="primary">
                ₹{Number(discountedPrice).toFixed(2)}
              </Typography>
              {selectedVariant.discountValue > 0 && (
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  ₹{Number(originalPrice).toFixed(2)}
                </Typography>
              )}
            </Box>

            {/* Quantity Selector */}
            <QuantitySelector
              variant={selectedVariant}
              cart={cart}
              isLoading={pending}
              showLabel
              lowStockWarning={10}
              onQuantityChange={handleQuantityChange}
            />

            <Divider />

            {/* Description */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography color="text.secondary">
                {product.description}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
