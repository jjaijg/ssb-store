import { SerializedOrderDetail, SerializedOrderItemWithVariant } from "@/types";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface Props {
  items: SerializedOrderItemWithVariant[]; // Replace with proper type from your schema
}

export default function OrderItems({ items }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            gap: 2,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Image
            src={item.variant.images[0] || "https://placehold.co/300x300/png"}
            alt={item.variant.product.name}
            width={80}
            height={80}
            style={{ objectFit: "cover" }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">
              {item.variant.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.variant.value}
              {item.variant.unit} × {item.quantity}
            </Typography>
            {item.discount > 0 && (
              <Typography variant="body2" color="success.main">
                Saved ₹{Number(item.discount).toFixed(2)}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="subtitle1">
              ₹{(Number(item.total) - Number(item.discount)).toFixed(2)}
            </Typography>
            {item.discount > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through" }}
              >
                ₹{Number(item.total).toFixed(2)}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
