import { Status } from "@prisma/client";
import { z } from "zod";

const validateDefaultVariant = (data: {
  isActive: boolean;
  isDefault: boolean;
}) => {
  return !(!data.isActive && data.isDefault);
};
const validateOrderLimit = (data: {
  minOrderQty: number;
  maxOrderQty?: number;
}) => {
  if (data.maxOrderQty !== undefined && data.minOrderQty > data.maxOrderQty) {
    return false;
  }
  return true;
};

const validateDiscount = (data: {
  discountType: string;
  discountValue?: number;
}) => {
  if (data.discountType === "NONE") {
    return data.discountValue === undefined || data.discountValue === 0;
  }
  if (data.discountType === "PERCENTAGE" || data.discountType === "FIXED") {
    return data.discountValue !== undefined && data.discountValue > 0;
  }
  return false;
};

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters long" })
    .max(50, { message: "Product name must not exceed 50 characters" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters long" })
    .max(100, { message: "Slug must not exceed 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must not exceed 500 characters" })
    .optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum([Status.ACTIVE, Status.DISCONTINUED, Status.INACTIVE], {
    required_error: "Status is required",
  }),
  bannerImage: z.string().url({ message: "Invalid image URL" }).optional(),
  categoryId: z.string().min(1, { message: "Category ID is required" }),
  brandId: z.string().min(1, { message: "Brand ID is required" }),
});

export const updateProductSchema = createProductSchema.extend({
  id: z.string().min(1, { message: "Product ID is required" }),
});

// Product variant schema
export const productVariantSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  variantName: z
    .string()
    .min(3, { message: "Variant name must be at least 3 characters long" })
    .max(50, { message: "Variant name must not exceed 50 characters" }),
  unit: z
    .string()
    .min(1, { message: "Unit is required" })
    .max(20, { message: "Unit must not exceed 20 characters" }),
  value: z.coerce.number().positive({
    message: "Value must be a positive number",
  }),
  images: z
    .array(z.string().url({ message: "Invalid image URL" }))
    .min(1, { message: "At least one image is required" })
    .max(5, { message: "You can upload a maximum of 5 images" }),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  sku: z
    .string()
    .min(2, { message: "SKU must be at least 2 characters long" })
    .max(100, { message: "SKU must not exceed 100 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  stock: z.coerce.number().int().nonnegative({
    message: "Stock quantity cannot be negative",
  }),
  minOrderQty: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Minimum order quantity cannot be negative" }),
  maxOrderQty: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Maximum order quantity cannot be negative" }),
  discountType: z.enum(["PERCENTAGE", "FIXED", "NONE"]).default("NONE"),
  discountValue: z.coerce
    .number()
    .nonnegative({ message: "Discount value cannot be negative" })
    .optional(),
});

export const createProductVariantSchema = productVariantSchema
  .refine((data) => validateDefaultVariant(data), {
    message: "Default variant must be active",
    path: ["isDefault"],
  })
  .refine((data) => validateDiscount(data), {
    message: "Invalid discount value",
    path: ["discountValue"],
  })
  .refine((data) => validateOrderLimit(data), {
    message:
      "Minimum order quantity cannot be greater than maximum order quantity",
    path: ["minOrderQty"],
  });

export const updateProductVariantSchema = productVariantSchema
  .extend({
    id: z.string().min(1, { message: "Variant ID is required" }),
  })
  .refine((data) => validateDefaultVariant(data), {
    message: "Default variant must be active",
    path: ["isDefault"],
  })
  .refine((data) => validateDiscount(data), {
    message: "Invalid discount value",
    path: ["discountValue"],
  })
  .refine((data) => validateOrderLimit(data), {
    message:
      "Minimum order quantity cannot be greater than maximum order quantity",
    path: ["minOrderQty"],
  });
