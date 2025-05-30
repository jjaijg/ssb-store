"use client";

import { Stack, IconButton, Typography, Button, Chip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart,
} from "@mui/icons-material";
import { SerializedCart, SerializedProductVariant } from "@/types";
import { useState, useEffect } from "react";

type Props = {
  isLoading: boolean;
  variant: SerializedProductVariant;
  cart: SerializedCart | null;
  onQuantityChange: (quantity: number, action: "add" | "remove") => void;
  lowStockWarning?: number;
  showLabel?: boolean;
};

export default function QuantitySelector({
  isLoading,
  variant,
  cart,
  onQuantityChange,
  lowStockWarning,
  showLabel,
}: Props) {
  // Initialize quantity from cart
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (cart?.items) {
      const cartItem = cart.items.find((item) => item.variantId === variant.id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      } else {
        setQuantity(0);
      }
    }
  }, [cart?.items, variant.id]);

  const handleQuantityChange = (
    newQuantity: number,
    action: "add" | "remove"
  ) => {
    if (
      newQuantity >= 0 &&
      newQuantity <= Math.min(variant.maxOrderQty ?? Infinity, variant.stock)
    ) {
      setQuantity(newQuantity);
      onQuantityChange(newQuantity, action);
    }
  };

  return quantity === 0 ? (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        {showLabel ? (
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => handleQuantityChange(quantity + 1, "add")}
          >
            {"Add to cart"}
          </Button>
        ) : (
          <IconButton
            aria-label="Add to cart"
            title="Add to cart"
            color="primary"
            onClick={() => handleQuantityChange(quantity + 1, "add")}
          >
            <ShoppingCart />
          </IconButton>
        )}
        {lowStockWarning && variant.stock <= lowStockWarning && (
          <Chip label={`Only ${variant.stock} left`} color="warning" />
        )}
      </Stack>
    </>
  ) : (
    <Stack direction="row" alignItems="center" spacing={2}>
      {showLabel && <Typography variant="subtitle1">Quantity:</Typography>}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          border: 1,
          borderColor: "primary.main",
          borderRadius: 1,
          px: 1,
        }}
      >
        <IconButton
          size="medium"
          onClick={() => handleQuantityChange(quantity - 1, "remove")}
          disabled={isLoading || quantity <= 0}
        >
          {isLoading ? (
            <CircularProgress color="secondary" size={"1.5rem"} />
          ) : (
            <RemoveIcon />
          )}
        </IconButton>
        <Typography sx={{ minWidth: 40, textAlign: "center" }}>
          {quantity}
        </Typography>
        <IconButton
          size="medium"
          onClick={() => handleQuantityChange(quantity + 1, "add")}
          disabled={
            isLoading ||
            quantity >= Math.min(variant.maxOrderQty ?? Infinity, variant.stock)
          }
        >
          {isLoading ? (
            <CircularProgress color="secondary" size={"1.5rem"} />
          ) : (
            <AddIcon />
          )}
        </IconButton>
      </Stack>
      {lowStockWarning && variant.stock <= lowStockWarning && (
        <Chip label={`Only ${variant.stock} left`} color="warning" />
      )}
    </Stack>
  );
}
