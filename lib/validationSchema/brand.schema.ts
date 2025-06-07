import { z } from "zod";

export const createBrandSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Brand name must be at least 3 characters long" })
    .max(30, { message: "Brand name must not exceed 30 characters" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 3 characters long" })
    .max(50, { message: "Slug must not exceed 50 characters" }),
  description: z
    .string()
    .max(200, { message: "Description must not exceed 200 characters" })
    .optional(),
  logoUrl: z.string().url({ message: "Brand logo is required" }),
});

export const updateBrandSchema = createBrandSchema.extend({
  id: z.string().min(1, { message: "Brand id is required" }),
});
