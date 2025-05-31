"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { auth } from "@/auth";
import {
  createBrandSchema,
  updateBrandSchema,
} from "../validationSchema/brand.schema";

export const getAllBrandsAction = async () => {
  try {
    // Fetch all brands from the database
    const brands = await prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, brands };
  } catch (error) {
    // Handle errors
    return { success: false, message: formatError(error) };
  }
};

export const createBrandAction = async (data: {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
}) => {
  try {
    // get session
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      // If the user is not authenticated or does not have the ADMIN role
      return {
        success: false,
        message: "You must be logged in to create a brand.",
      };
    }

    // validate data
    const brand = createBrandSchema.parse(data);

    // Create a new brand in the database
    await prisma.brand.create({
      data: {
        ...brand,
        updatedby: session?.user.id, // Set the user ID of the person creating the brand
      },
    });

    revalidatePath(`/admin/brand`);
    return { success: true, message: "Brand created successfully" };
  } catch (error) {
    // Handle errors
    return { success: false, message: formatError(error) };
  }
};

export const updateBrandAction = async (
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
  }
) => {
  try {
    // get session
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      // If the user is not authenticated or does not have the ADMIN role
      return {
        success: false,
        message: "You must be logged in to update a brand.",
      };
    }

    // validate data
    const brandData = updateBrandSchema.parse({ ...data, id });

    // Update the brand in the database
    await prisma.brand.update({
      where: { id },
      data: {
        ...brandData,
        updatedby: session?.user.id, // Set the user ID of the person updating the brand
      },
    });

    revalidatePath(`/admin/brand`);
    return { success: true, message: "brand updated successfully" };
  } catch (error) {
    // Handle errors
    return { success: false, message: formatError(error) };
  }
};

export const deleteBrandAction = async (id: string) => {
  try {
    // Delete the brand by ID
    await prisma.brand.delete({
      where: { id },
    });

    revalidatePath(`/admin/brand`);
    return { success: true, message: "Brand deleted successfully" };
  } catch (error) {
    // Handle errors
    return { success: false, message: formatError(error) };
  }
};

// Landing page actions
// ...existing imports...

export const getFeaturedBrands = async ({ limit }: { limit?: number } = {}) => {
  try {
    const brands = await prisma.brand.findMany({
      where: {
        // status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
      },
      take: limit,
    });

    return brands;
  } catch (error) {
    console.error("Error fetching featured brands:", error);
    return [];
  }
};
