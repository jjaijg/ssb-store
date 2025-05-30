"use server";

import { auth } from "@/auth";
import { convertToPlainObject, formatError, validateQuantity } from "../utils";
import { prisma } from "../prisma";
import { z } from "zod";
import { cartItemSchema } from "../validationSchema/cart.schema";
import { Cart } from "@prisma/client";
import { SerializedCart, SerializedCartItem } from "@/types";

export const getUserCart = async () => {
  try {
    const session = await auth();
    if (!session) {
      return null;
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
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
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

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

      // Get or create cart
      let cart = await tx.cart.findFirst({
        where: { userId: session.user.id },
        include: { items: true },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId: session.user.id,
            sessioncartId: session.user.id,
          },
          include: { items: true },
        });
      }

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
            // price: variant.price,
            // discountType: variant.discountType,
            // discountValue: variant.discountValue,
          },
        });
      }

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
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    return await prisma.$transaction(async (tx) => {
      // Find the cart item and verify ownership
      const cartItem = await tx.cartItem.findFirst({
        where: {
          variantId,
          cart: {
            userId: session.user.id,
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
