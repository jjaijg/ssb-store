import { ADDRESS_TYPE } from "@prisma/client";
import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().optional(), // Add this to handle saved addresses
  name: z.string().min(1, "Address type is required").max(20, {
    message: "Address type should not be greater than 20 characters",
  }),
  door: z.string().min(1, "Resident details required").max(30, {
    message: "Resident details should not be greater than 30 characters",
  }),
  street: z
    .string()
    .min(1, "Street is required")
    .max(50, { message: "Street should not be greater than 50 characters" }),
  landmark: z.string().optional(),
  isDefault: z.boolean().default(false),
  city: z
    .string()
    .min(1, "City is required")
    .max(20, { message: "Street should not be greater than 20 characters" }),
  state: z
    .string()
    .min(1, "State is required")
    .max(20, { message: "State should not be greater than 20 characters" }),
  country: z
    .string()
    .min(1, "Country is required")
    .max(20, { message: "Country should not be greater than 20 characters" }),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(7, { message: "Postal code should not be greater than 7 characters" }),
  type: z.enum([ADDRESS_TYPE.SHIPPING, ADDRESS_TYPE.BILLING]),
});

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  notes: z.string().optional(),
});
// .refine(
//   ({ sameAsShipping, billingAddress }) => {
//     if (!sameAsShipping && !billingAddress) return false;
//     return true;
//   },
//   {
//     message: "Billing address details required",
//     path: ["billingAddress", "name"],
//   }
// );

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
