"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { formatError } from "../utils";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validationSchema/category.schema";
import { auth } from "@/auth";

export const getAllCategoriesAction = async () => {
  try {
    // Fetch all categories from the database
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, categories };
  } catch (error) {
    // Handle errors
    return { success: false, message: formatError(error) };
  }
};

export const createCategoryAction = async (data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}) => {
  try {
    // get session
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      // If the user is not authenticated or does not have the ADMIN role
      return {
        success: false,
        message: "You must be logged in to create a category.",
      };
    }

    // validate data
    const category = createCategorySchema.parse(data);

    // Create a new category in the database
    await prisma.category.create({
      data: {
        ...category,
        updatedby: session?.user.id, // Set the user ID of the person creating the category
      },
    });

    revalidatePath(`/admin/category`);
    return { success: true, message: "Category created successfully" };
  } catch (error) {
    // Handle errors
    return { success: false, message: formatError(error) };
  }
};

export const updateCategoryAction = async (
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
  }
) => {
  try {
    // get session
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      // If the user is not authenticated or does not have the ADMIN role
      return {
        success: false,
        message: "You must be logged in to update a category.",
      };
    }

    // validate data
    const categoryData = updateCategorySchema.parse({ ...data, id });

    // Update the category in the database
    await prisma.category.update({
      where: { id },
      data: {
        ...categoryData,
        updatedby: session?.user.id, // Set the user ID of the person updating the category
      },
    });

    revalidatePath(`/admin/category`);
    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    // Handle errors
    return { success: false, message: formatError(error) };
  }
};

export const deleteCategoryAction = async (id: string) => {
  try {
    // Delete the category by ID
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath(`/admin/category`);
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    // Handle errors
    return { success: false, message: formatError(error) };
  }
};

// Landing page action
export const getFeaturedCategories = async ({ limit }: { limit?: number }) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        // isFeatured: true,
        // status: "ACTIVE"
      },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: {
          select: {
            products: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
      take: limit,
      orderBy: {
        products: {
          _count: "desc",
        },
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    return [];
  }
};
