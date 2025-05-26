"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { createProductSchema } from "../validationSchema/product.schema";
import { auth } from "@/auth";
import { formatError } from "../utils";

export const getAllProductsWithVariants = async () => {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany({
      include: {
        category: true, // Include category information,
        brand: true, // Include brand information
        variants: true,
      },
    });

    return { success: true, products };
  } catch (error) {
    return { success: false, message: "Failed to fetch products" };
  }
};

export const createProductWithoutVariants = async (
  data: z.infer<typeof createProductSchema>
) => {
  try {
    // Check session
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Ensure the data is valid
    // Validate the data against the schema
    const parsedData = createProductSchema.parse(data);
    // Generate slug from the product name

    // Check if the product already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: parsedData.slug },
    });
    if (existingProduct) {
      return {
        success: false,
        message: "Product already exists",
      };
    }

    // If the product does not exist, proceed to create it
    const product = await prisma.product.create({
      data: { ...data, createdBy: session.user.id },
    });

    return { success: true, message: "Product created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
