import {
  Brand,
  Category,
  Product,
  ProductVariant,
  CartItem,
  Cart,
} from "@prisma/client";

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
  category: Category;
  brand: Brand;
  variants: SerializedProductVariant[];
};

export type SerializedCartItem = Omit<CartItem, "price" | "discountValue"> & {
  price: number; // Instead of Decimal
  discountValue: number; // Instead of Decimal
  variant: SerializedProductVariant;
};

export type SerializedCart = Omit<Cart, "shippingPrice" | "taxPrice"> & {
  shippingPrice: number;
  taxPrice: number;
  items: SerializedCartItem[];
};
