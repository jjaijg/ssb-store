"use server";

import { auth } from "@/auth";
import { convertToPlainObject, formatError, validateQuantity } from "../utils";
import { prisma } from "../prisma";
import { z } from "zod";
import { cartItemSchema } from "../validationSchema/cart.schema";
import { SerializedCart } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function getOrCreateCart(sessioncartId: string, userId?: string) {
  // First try to find an existing cart
  const existingCart = await prisma.cart.findFirst({
    where: {
      AND: [
        { isActive: true },
        userId
          ? { userId }
          : {
              sessioncartId,
              userId: null, // Ensure we get guest cart only
            },
      ],
    },
  });

  if (existingCart) {
    return existingCart;
  }

  // If no cart exists, create a new one
  return await prisma.cart.create({
    data: {
      sessioncartId,
      userId: userId || null,
      isActive: true,
    },
  });
}

export const getUserCart = async () => {
  try {
    // check for cart cookie
    const sessioncartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessioncartId) throw new Error("Cart session not found");

    const session = await auth();

    const userId = session?.user.id;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessioncartId, userId: null },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    brand: {
                      omit: {
                        createdAt: true,
                        updatedAt: true,
                        updatedby: true,
                      },
                    },
                    category: {
                      omit: {
                        createdAt: true,
                        updatedAt: true,
                        updatedby: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    return convertToPlainObject<SerializedCart>(cart);
  } catch (error) {
    return null;
  }
};

export const addToCart = async (item: z.infer<typeof cartItemSchema>) => {
  try {
    // check for cart cookie
    const sessioncartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessioncartId) throw new Error("Cart session not found");

    const session = await auth();

    const userId = session?.user.id;

    // Validate input
    const parsedItem = cartItemSchema.parse(item);

    // Use transaction for data consistency
    return await prisma.$transaction(async (tx) => {
      // Check variant exists and has stock
      const variant = await tx.productVariant.findUnique({
        where: { id: parsedItem.variantId },
      });

      if (!variant) {
        return { success: false, message: "Product variant not found" };
      }

      if (variant.stock < 1) {
        return { success: false, message: "Product is out of stock" };
      }

      // Get or create appropriate cart
      const cart = await getOrCreateCart(sessioncartId, userId);

      // Check existing item in cart
      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          variantId: parsedItem.variantId,
        },
      });

      if (existingItem) {
        // Validate quantity before update
        validateQuantity(existingItem.quantity, 1, variant);

        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + 1 },
        });
      } else {
        // Validate initial quantity
        validateQuantity(0, parsedItem.quantity, variant);

        await tx.cartItem.create({
          data: {
            ...parsedItem,
            cartId: cart.id,
          },
        });
      }

      revalidatePath("/cart");

      return {
        success: true,
        message: "Item added to cart successfully",
      };
    });
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const removeFromCart = async (variantId: string) => {
  try {
    // check for cart cookie
    const sessioncartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessioncartId) throw new Error("Cart session not found");

    const session = await auth();

    const userId = session?.user.id;

    return await prisma.$transaction(async (tx) => {
      // Find the cart item and verify ownership
      const cartItem = await tx.cartItem.findFirst({
        where: {
          variantId,
          cart: {
            OR: [
              {
                userId,
              },
              {
                sessioncartId,
                userId: null,
              },
            ],
          },
        },
        include: {
          cart: true,
        },
      });

      if (!cartItem) {
        return {
          success: false,
          message: "Cart item not found or unauthorized",
        };
      }

      // If quantity is > 1, then reduce the quantity
      if (cartItem.quantity > 1) {
        await tx.cartItem.update({
          where: { id: cartItem.id },
          data: {
            quantity: cartItem.quantity - 1,
          },
        });
      } else {
        // If quantity is  1, then delete the cart item
        await tx.cartItem.delete({
          where: { id: cartItem.id },
        });
      }

      // Check if cart is empty and delete if needed
      const remainingItems = await tx.cartItem.count({
        where: { cartId: cartItem.cartId },
      });

      if (remainingItems === 0) {
        await tx.cart.delete({
          where: { id: cartItem.cartId },
        });
      }

      revalidatePath("/cart");

      return {
        success: true,
        message: "Item removed from cart successfully",
      };
    });
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const migrateGuestCart = async (
  sessioncartId: string,
  userId: string
) => {
  return await prisma.$transaction(async (tx) => {
    // Find guest cart with items and their variants
    const guestCart = await tx.cart.findFirst({
      where: {
        sessioncartId,
        userId: null,
        isActive: true,
      },
      include: {
        items: {
          include: { variant: true },
        },
      },
    });

    if (!guestCart) return;

    // Get or create user cart
    const userCart = await getOrCreateCart(sessioncartId, userId);

    // Move items to user cart
    if (guestCart.items.length > 0) {
      for (const guestItem of guestCart.items) {
        // Check if item exists in user's cart
        const userCartItem = await tx.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            variantId: guestItem.variantId,
          },
        });

        if (userCartItem) {
          // Delete existing item in user cart
          await tx.cartItem.delete({
            where: { id: userCartItem.id },
          });
        }

        // Move guest cart item to user cart
        await tx.cartItem.update({
          where: { id: guestItem.id },
          data: { cartId: userCart.id },
        });
      }
    }

    // Delete guest cart after migrating items
    await tx.cart.delete({
      where: { id: guestCart.id },
    });

    return { success: true };
  });
};
