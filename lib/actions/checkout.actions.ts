"use server";

import { Address } from "@prisma/client";
import { prisma } from "../prisma";
import { auth } from "@/auth";

export async function getSavedAddresses(): Promise<{
  shippingAddresses: Address[];
  billingAddresses: Address[];
} | null> {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
        type: {
          in: ["SHIPPING", "BILLING"],
        },
      },
      orderBy: {
        isDefault: "desc",
      },
    });

    // Split addresses by type
    const result = addresses.reduce(
      (acc, address) => {
        if (address.type === "SHIPPING") {
          acc.shippingAddresses.push(address);
        } else {
          acc.billingAddresses.push(address);
        }
        return acc;
      },
      { shippingAddresses: [] as Address[], billingAddresses: [] as Address[] }
    );

    return result;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return { shippingAddresses: [], billingAddresses: [] };
  }
}
