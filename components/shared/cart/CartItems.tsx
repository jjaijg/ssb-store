"use client";

import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import Image from "next/image";
import { useTransition } from "react";
import { SerializedCartItem } from "@/types";
import { addToCart, removeFromCart } from "@/lib/actions/cart.actions";
import { toast } from "react-toastify";

type Props = {
  items: SerializedCartItem[];
};

export default function CartItems({ items }: Props) {
  const [pending, startTransition] = useTransition();

  const handleQuantityChange = (
    item: SerializedCartItem,
    action: "add" | "remove"
  ) => {
    startTransition(async () => {
      const { success, message } =
        action === "add"
          ? await addToCart({
              variantId: item.variantId,
              quantity: 1,
              price: item.price,
              discountType: item.discountType,
              discountValue: item.discountValue,
            })
          : await removeFromCart(item.variantId);

      if (success) toast.success(message);
      if (!success) toast.error(message);
    });
  };

  const calculateDiscountedPrice = (item: SerializedCartItem) => {
    const originalPrice = item.price;
    if (!item.discountValue) return originalPrice;

    return item.discountType === "PERCENTAGE"
      ? originalPrice - (originalPrice * item.discountValue) / 100
      : originalPrice - item.discountValue;
  };

  const calculateItemTotal = (item: SerializedCartItem) => {
    const unitPrice = calculateDiscountedPrice(item);
    return (unitPrice * item.quantity).toFixed(2);
  };

  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 2 },
        maxHeight: {
          xs: "auto",
          lg: "25rem",
          overflowY: "auto",
        },
      }}
    >
      <Stack spacing={2}>
        {items.map((item) => (
          <Box key={item.id}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              {/* Product Image */}
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "100%", sm: 75 },
                  height: { xs: 200, sm: 75 },
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={
                    item.variant.images[0] || "https://placehold.co/200x200/png"
                  }
                  alt={item.variant.product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 600px) 100vw, 75px"
                />
              </Box>

              {/* Product Details */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1rem" },
                    mt: { xs: 1, sm: 0 },
                  }}
                >
                  {item.variant.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.variant.value} {item.variant.unit}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mt: { xs: 1, sm: 0.5 } }}
                >
                  {item.discountValue > 0 ? (
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        ₹{item.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight="bold"
                      >
                        ₹{calculateDiscountedPrice(item)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: "success.main",
                          color: "white",
                          px: 0.5,
                          borderRadius: 0.5,
                        }}
                      >
                        {item.discountType === "PERCENTAGE"
                          ? `-${item.discountValue}%`
                          : `-₹${item.discountValue}`}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="bold"
                    >
                      ₹{item.price}
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* Quantity Controls and Total */}
              <Stack
                direction={{ xs: "row", sm: "column" }}
                justifyContent={{ xs: "space-between", sm: "flex-start" }}
                alignItems={{ xs: "center", sm: "flex-end" }}
                spacing={1}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  mt: { xs: 2, sm: 0 },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    border: { xs: 1, sm: 0 },
                    borderColor: "divider",
                    borderRadius: 1,
                    p: { xs: 0.5, sm: 0 },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item, "remove")}
                    disabled={pending}
                  >
                    {item.quantity === 1 ? <Delete /> : <Remove />}
                  </IconButton>
                  <Typography sx={{ minWidth: 20, textAlign: "center" }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(item, "add")}
                    disabled={pending}
                  >
                    <Add />
                  </IconButton>
                </Stack>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    minWidth: { xs: "auto", sm: 80 },
                    textAlign: "right",
                    fontWeight: "medium",
                  }}
                >
                  Total: ₹{calculateItemTotal(item)}
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: { xs: 2, sm: 1 } }} />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
