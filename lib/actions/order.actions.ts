"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { convertToPlainObject, generateOrderNumber } from "@/lib/utils";
import { type CheckoutFormData } from "@/lib/validationSchema/checkout.schema";
import { SerializedOrder, SerializedOrderDetail } from "@/types";

export async function getOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return convertToPlainObject<SerializedOrder[]>(orders);
  } catch (error) {
    console.error("Error fetching orders : ", error);
    return [];
  }
}

export async function getOrderbyId(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) return null;
    return convertToPlainObject<SerializedOrder>(order);
  } catch (error) {
    console.error("Error while fetching order : ", error);
    return null;
  }
}

export async function getOrderDetailsById(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) return null;

    return convertToPlainObject<SerializedOrderDetail>(order);
  } catch (error) {
    console.error("Error while fetching user order details,", error);
    return null;
  }
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return convertToPlainObject<SerializedOrderDetail[]>(orders);
}

export async function createOrder(data: CheckoutFormData, cartId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return await prisma.$transaction(async (tx) => {
      // 1. Get cart with items
      const cart = await tx.cart.findFirst({
        where: { id: cartId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!cart) throw new Error("Cart not found");

      // 2. Calculate order totals
      const { subtotal, totalDiscount } = cart.items.reduce(
        (acc, item) => {
          const itemTotal = Number(item.variant.price) * item.quantity;
          let itemDiscount = 0;

          if (
            item.variant.discountType === "PERCENTAGE" &&
            item.variant.discountValue
          ) {
            itemDiscount =
              (itemTotal * Number(item.variant.discountValue)) / 100;
          } else if (
            item.variant.discountType === "FIXED" &&
            item.variant.discountValue
          ) {
            itemDiscount = Number(item.variant.discountValue) * item.quantity;
          }

          return {
            subtotal: acc.subtotal + itemTotal,
            totalDiscount: acc.totalDiscount + itemDiscount,
          };
        },
        { subtotal: 0, totalDiscount: 0 }
      );

      // 3. create addresses
      if (!data.shippingAddress.id) {
        const addr = await tx.address.create({
          data: {
            ...data.shippingAddress,
            type: "SHIPPING",
            userId: session.user.id,
          },
        });
        data.shippingAddress.id = addr.id;
      } else {
        const addr = await tx.address.update({
          where: {
            id: data.shippingAddress.id,
            userId: session.user.id,
          },
          data: {
            ...data.shippingAddress,
            isDefault: data.shippingAddress.isDefault,
          },
        });

        data.shippingAddress.id = addr.id;
      }

      if (!data.sameAsShipping) {
        if (data.billingAddress && !data.billingAddress.id) {
          const addr = await tx.address.create({
            data: {
              ...data.billingAddress,
              type: "BILLING",
              userId: session.user.id,
            },
          });
          data.billingAddress.id = addr.id;
        } else if (data.billingAddress && data.billingAddress.id) {
          const addr = await tx.address.update({
            where: {
              id: data.billingAddress.id,
              userId: session.user.id,
            },
            data: {
              ...data.billingAddress,
              isDefault: data.billingAddress.isDefault,
            },
          });

          data.billingAddress.id = addr.id;
        }
      }

      // Calculate shipping cost and tax
      const shippingCost = 0; // TODO: Implement shipping cost calculation
      const tax = 0; // TODO: Implement tax calculation
      const total = subtotal - totalDiscount + shippingCost + tax;

      // 4. Create order
      const order = await tx.order.create({
        data: {
          orderNumber: await generateOrderNumber(),
          userId: session.user.id,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: data.paymentMethod,
          subtotal,
          discount: totalDiscount,
          shippingCost,
          tax,
          total,
          shippingAddressId: data.shippingAddress.id,
          billingAddressId: data.sameAsShipping
            ? data.shippingAddress.id!
            : data.billingAddress!.id!,
          items: {
            create: cart.items.map((item) => {
              const itemPrice = Number(item.variant.price);
              const itemTotal = itemPrice * item.quantity;
              let itemDiscount = 0;

              // Calculate discount based on type
              if (
                item.variant.discountType === "PERCENTAGE" &&
                item.variant.discountValue
              ) {
                itemDiscount =
                  (itemTotal * Number(item.variant.discountValue)) / 100;
              } else if (
                item.variant.discountType === "FIXED" &&
                item.variant.discountValue
              ) {
                itemDiscount =
                  Number(item.variant.discountValue) * item.quantity;
              }
              return {
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.variant.price,
                name: item.variant.product.name,
                sku: item.variant.sku,
                discount: itemDiscount,
                total: itemTotal,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      // 5. Update stock levels
      await Promise.all(
        cart.items.map((item) =>
          tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      );

      // 6. Delete cart
      await tx.cart.delete({
        where: { id: cart.id },
      });

      return convertToPlainObject<SerializedOrder>(order);
    });
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

// For admin
export async function getAdminOrderDetailsById(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") return null;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) return null;

    return convertToPlainObject<SerializedOrderDetail>(order);
  } catch (error) {
    console.error("Error while fetching user order details,", error);
    return null;
  }
}
