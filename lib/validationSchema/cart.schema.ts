import { z } from "zod";

export const cartItemSchema = z.object({
  //   cartId: z.string().min(1, { message: "Cart is required" }),
  variantId: z.string().min(1, { message: "Product information missing" }),
  quantity: z.coerce
    .number()
    .positive({ message: "Quantity should be greater than 0" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  discountType: z.enum(["PERCENTAGE", "FIXED", "NONE"]).default("NONE"),
  discountValue: z.coerce
    .number()
    .nonnegative({ message: "Discount value cannot be negative" })
    .optional(),
});

export const cartSchema = z.object({
  userId: z.string().optional(),
  sessioncartId: z.string().min(1, { message: "Cart id is missing" }),
  shippingPrice: z.coerce
    .number()
    .nonnegative({ message: "shipping price cannot be negative" })
    .default(0),
  taxPrice: z.coerce
    .number()
    .nonnegative({ message: "tax price cannot be negative" })
    .default(0),
  items: z.array(cartItemSchema),
});
