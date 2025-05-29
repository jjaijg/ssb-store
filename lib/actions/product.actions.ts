"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import {
  createProductSchema,
  updateProductSchema,
} from "../validationSchema/product.schema";
import { auth } from "@/auth";
import { convertToPlainObject, formatError, serializeDecimal } from "../utils";
import { SerializedProduct, SerializedProductWithVariants } from "@/types";
import { revalidatePath } from "next/cache";
import { deleteUploadThingFile } from "./uploadthing.actions";

export const getAllProductsWithVariants = async () => {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany({
      include: {
        category: true, // Include category information,
        brand: true, // Include brand information
        variants: true,
      },
      orderBy: {
        name: "asc", // Order by product name
      },
    });

    return { success: true, products };
  } catch (error) {
    return { success: false, message: "Failed to fetch products" };
  }
};

export const getProductswithVariants = async ({
  limit = 2,
}: {
  limit: number;
}) => {
  try {
    const products = await prisma.product.findMany({
      where: { id: "cmb6klmzc000vbv6gp8gmj4i1" },
      include: {
        variants: true,
        category: true,
        brand: true,
      },
      take: limit,
    });

    return convertToPlainObject<SerializedProductWithVariants[]>(products);
  } catch (error) {
    return [] as SerializedProductWithVariants[];
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

export const updateProductWithoutVariants = async (
  id: string,
  data: z.infer<typeof updateProductSchema>
) => {
  try {
    // Check session
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Ensure the data is valid
    // Validate the data against the schema
    const parsedData = updateProductSchema.parse(data);

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      return { success: false, message: "Product not found" };
    }

    // Update the product
    await prisma.product.update({
      where: { id },
      data: { ...parsedData, updatedBy: session.user.id },
    });

    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const getProductById = async (id: string) => {
  try {
    // Fetch product by ID
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return null; // Product not found
    }

    return convertToPlainObject<SerializedProduct>(product);
  } catch (error) {
    return null; // Handle error appropriately
  }
};

export const deleteProductById = async (id: string) => {
  try {
    // Check session
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!product) {
      return { success: false, message: "Product not found" };
    }

    // Check if the product has variants
    // If the product has variants, prevent deletion
    if (product.variants.length > 0) {
      return {
        success: false,
        message: "Cannot delete product with existing variants",
      };
    }

    // If the product has no variants, proceed to delete it
    // Delete product by ID
    await prisma.product.delete({
      where: { id },
    });

    // Delete all images associated with the product
    if (product.bannerImage) {
      await deleteUploadThingFile(product.bannerImage);
    }

    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
