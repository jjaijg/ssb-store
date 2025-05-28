"use server";

import { SerializedProductVariant } from "@/types";
import { prisma } from "../prisma";
import { convertToPlainObject, formatError } from "../utils";
import {
  createProductVariantSchema,
  updateProductVariantSchema,
} from "../validationSchema/product.schema";
import { z } from "zod";
import { auth } from "@/auth";
import { deleteUploadThingFile } from "./uploadthing.actions";
import { revalidatePath } from "next/cache";

export const getProductVariantsByProductId = async (productId: string) => {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId },
      include: {
        product: true, // Include product information
      },
      orderBy: {
        variantName: "asc", // Order by variant name
      },
    });

    return {
      success: true,
      variants: convertToPlainObject<SerializedProductVariant[]>(variants),
    };
  } catch (error) {
    return { success: false, message: "Failed to fetch product variants" };
  }
};

export const getProductVariantById = async (variantId: string) => {
  try {
    const varaint = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    return convertToPlainObject<SerializedProductVariant>(varaint);
  } catch (error) {
    return null;
  }
};

export const createProductVariant = async (
  data: z.infer<typeof createProductVariantSchema>
) => {
  try {
    // Check session
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Ensure the data is valid
    // Validate the data against the schema
    const parsedData = createProductVariantSchema.parse(data);
    // Generate slug from the product name

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parsedData.productId },
    });
    if (!existingProduct) {
      return { success: false, message: "Product not found" };
    }

    // If the product does not exist, proceed to create it
    const variant = await prisma.productVariant.create({
      data: { ...parsedData },
    });

    // If new variant is set as default, reset other variants
    if (variant.isDefault) {
      // reset other variants to not default
      await prisma.productVariant.updateMany({
        where: {
          productId: parsedData.productId,
          id: { not: variant.id }, // Exclude the newly created variant
        },
        data: { isDefault: false },
      });
    }

    return { success: true, message: "Product variant created successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const updateProductVariant = async (
  id: string,
  data: z.infer<typeof updateProductVariantSchema>
) => {
  try {
    // Check session
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Ensure the data is valid
    // Validate the data against the schema
    const parsedData = updateProductVariantSchema.parse(data);

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parsedData.productId },
    });
    if (!existingProduct) {
      return { success: false, message: "Product not found" };
    }

    const existingVariant = await prisma.productVariant.findUnique({
      where: { id },
    });

    if (!existingVariant)
      return { success: false, message: "Product variant not found" };

    if (!parsedData.isDefault && existingVariant.isDefault)
      return {
        success: false,
        message: "Default variant's 'is default' option should not be updated.",
      };

    // Update the product
    const variant = await prisma.productVariant.update({
      where: { id },
      data: { ...parsedData },
    });

    // If updated variant is set as default, reset other variants
    if (variant.isDefault) {
      // reset other variants to not default
      await prisma.productVariant.updateMany({
        where: {
          productId: parsedData.productId,
          id: { not: variant.id }, // Exclude the newly created variant
        },
        data: { isDefault: false },
      });
    }

    return { success: true, message: "Product variant updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const deleteProductVariantById = async (variantId: string) => {
  try {
    // Check session
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Unauthorized" };
    }

    // Check if the product variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) {
      return { success: false, message: "Product variant not found" };
    }

    // Delete product variant by ID
    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    // Delete all images associated with the product
    if (variant.images.length) {
      await deleteUploadThingFile(variant.images);
    }

    revalidatePath(`/admin/products/variants/${variant.productId}`);
    return { success: true, message: "Product variant deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
