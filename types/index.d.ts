import { Product, ProductVariant } from "@prisma/client";

export type SerializedProduct = Omit<Product, "rating"> & {
  rating: number; // Instead of Decimal
};

export type SerializedProductVariant = Omit<
  ProductVariant,
  "price" | "value" | "discountValue"
> & {
  price: number; // Instead of Decimal
  value: number; // Instead of Decimal
  discountValue: number; // Instead of Decimal
  product: SerializedProduct; // Include product information
};

export type SerializedProductWithVariants = SerializedProduct & {
  variants: SerializedProductVariant[];
};
