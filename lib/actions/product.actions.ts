"use server";

import { prisma } from "../prisma";

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
