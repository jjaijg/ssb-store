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
  IconButton,
  ToggleButton,
  Tooltip,
  ToggleButtonGroup,
} from "@mui/material";
import {
  ShoppingCart,
  Favorite,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import { Brand, Category } from "@prisma/client";
import Image from "next/image";
import { SerializedProductWithVariants } from "@/types";
import { useState } from "react";

type VariantQuantities = {
  [variantId: string]: number;
};

type ProductCardProps = {
  product: SerializedProductWithVariants & {
    brand: Brand;
    category: Category;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
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

  // Track quantities for all variants
  const [variantQuantities, setVariantQuantities] = useState<VariantQuantities>(
    {}
  );

  const handleAddToCart = (variantId: string) => {
    setVariantQuantities((prev) => ({
      ...prev,
      [variantId]: 1,
    }));
    // Add to cart logic here
  };

  const handleUpdateQuantity = (variantId: string, newQuantity: number) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return;

    if (
      newQuantity >= 0 &&
      newQuantity <= Math.min(variant.maxOrderQty ?? 0, variant.stock)
    ) {
      setVariantQuantities((prev) => ({
        ...prev,
        [variantId]: newQuantity,
      }));
      // Update cart logic here
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
      <Box sx={{ position: "relative", paddingTop: "100%" }}>
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
                disabled={!variant.isActive || variant.stock === 0}
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
            {!variantQuantities[selectedVariant.id] ? (
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleAddToCart(selectedVariant.id)}
                disabled={
                  !selectedVariant.isActive || selectedVariant.stock === 0
                }
              >
                <ShoppingCart />
              </IconButton>
            ) : (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  border: 1,
                  borderColor: "primary.main",
                  borderRadius: 1,
                  px: 0.5,
                }}
              >
                <IconButton
                  size="medium"
                  onClick={() =>
                    handleUpdateQuantity(
                      selectedVariant.id,
                      variantQuantities[selectedVariant.id] - 1
                    )
                  }
                >
                  <RemoveIcon fontSize="medium" />
                </IconButton>
                <Typography variant="body2">
                  {variantQuantities[selectedVariant.id]}
                </Typography>
                <IconButton
                  size="medium"
                  onClick={() =>
                    handleUpdateQuantity(
                      selectedVariant.id,
                      variantQuantities[selectedVariant.id] + 1
                    )
                  }
                  disabled={
                    variantQuantities[selectedVariant.id] >=
                    Math.min(
                      selectedVariant.maxOrderQty ?? 0,
                      selectedVariant.stock
                    )
                  }
                >
                  <AddIcon fontSize="medium" />
                </IconButton>
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
