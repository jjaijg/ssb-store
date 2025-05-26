import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Category name must be at least 3 characters long" })
    .max(30, { message: "Category name must not exceed 30 characters" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 3 characters long" })
    .max(50, { message: "Slug must not exceed 50 characters" }),
  description: z
    .string()
    .max(200, { message: "Description must not exceed 200 characters" })
    .optional(),
  image: z.string().url({ message: "Image must be a valid URL" }).optional(),
});

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1, { message: "Category id is required" }),
});
