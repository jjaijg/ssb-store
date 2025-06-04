"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Stack,
  Chip,
  Rating,
  ToggleButton,
  Tooltip,
  ToggleButtonGroup,
} from "@mui/material";
import { Brand, Category } from "@prisma/client";
import Image from "next/image";
import { SerializedCart, SerializedProductWithVariants } from "@/types";
import { useState, useTransition } from "react";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { toast } from "react-toastify";
import Link from "next/link";
import QuantitySelector from "./QuantitySelector";

type ProductCardProps = {
  cart: SerializedCart | null;
  product: SerializedProductWithVariants & {
    brand: Brand;
    category: Category;
  };
};

export default function ProductCard({ cart, product }: ProductCardProps) {
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

  const handleQuantityChange = (quantity: number, action: "add" | "remove") => {
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
    <Card
      sx={{
        width: 300,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      {/* Image Box */}
      <Box
        sx={{ position: "relative", paddingTop: "100%" }}
        component={Link}
        href={`/product/${product.slug}`}
      >
        <CardMedia
          component="div"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Image
            src={
              selectedVariant.images.length > 0
                ? selectedVariant.images[0]
                : "https://placehold.co/600x400/png"
            }
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </CardMedia>
        {/* Discount Chip */}
        {selectedVariant.discountValue > 0 && (
          <Chip
            label={`${
              selectedVariant.discountType === "PERCENTAGE" ? "-" : "₹-"
            }${selectedVariant.discountValue}${
              selectedVariant.discountType === "PERCENTAGE" ? "%" : ""
            }`}
            color="success"
            sx={{ position: "absolute", top: 8, right: 8 }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Brand & Product name */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {product.brand.name}
        </Typography>
        <Link href={`/product/${product.slug}`}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.name}
          </Typography>
        </Link>

        {/* Add variants section */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Available {product.variants[0].unit}s
          </Typography>
          <ToggleButtonGroup
            value={selectedVariant.id}
            exclusive
            onChange={(_, newValue) => {
              if (newValue) {
                const variant = product.variants.find((v) => v.id === newValue);
                if (variant) setSelectedVariant(variant);
              }
            }}
            size="small"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
            }}
          >
            {product.variants.map((variant) => (
              <ToggleButton
                key={variant.id}
                value={variant.id}
                // disabled={!variant.isActive || variant.stock === 0}
                sx={{
                  cursor:
                    !variant.isActive || variant.stock === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <Tooltip title={variant.stock === 0 ? "Out of Stock" : ""}>
                  <Box>
                    <Typography variant="caption">
                      {variant.value}
                      {variant.unit}
                    </Typography>
                  </Box>
                </Tooltip>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Rating section */}
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Rating value={product.rating} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({product.ratingCount})
          </Typography>
        </Stack>

        {/* Price & action section */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h6" color="primary">
              ₹{Number(discountedPrice).toFixed(2)}
            </Typography>
            {selectedVariant.discountValue > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through" }}
              >
                ₹{Number(originalPrice).toFixed(2)}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            {/* <IconButton size="small" color="primary">
              <Favorite />
            </IconButton> */}
            {selectedVariant.stock > 0 ? (
              <QuantitySelector
                cart={cart}
                isLoading={pending}
                variant={selectedVariant}
                onQuantityChange={handleQuantityChange}
              />
            ) : (
              <Chip label="Out of stock" color="error" />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
