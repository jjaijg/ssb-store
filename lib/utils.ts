import { RazorpayOptions, RazorpayResponse } from "@/types";
import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { TIME_ZONE } from "./constants";
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// shorten the unique id
export function formatId(id: string) {
  return `...${id.substring(id.length - 8)}`;
}

// Format errors
export function formatError(
  error: unknown | ZodError | Prisma.PrismaClientKnownRequestError
) {
  // Check if the error is a ZodError or Prisma error
  if (error instanceof ZodError) {
    // Handle Zod validation errors
    // ZodError is an array of errors, so we need to map through them
    // and extract the messages
    const fieldErrors = Object.keys(error.errors).map(
      (idx) => error.errors[+idx].message
    );

    return fieldErrors.join(".\n");
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    if (error.code === "P2002") {
      // Unique constraint failed
      // This error occurs when a unique constraint is violated
      // For example, when trying to create a user with an email that already exists
      const field = Array.isArray(error.meta?.target)
        ? (error.meta.target[0] as string)
        : "Field";
      return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
  }
  // Handle other errors
  const err = error as Error;
  return typeof err.message === "string"
    ? err.message
    : JSON.stringify(err.message);
}

// Format number
const NUMBER_FORMATTER = new Intl.NumberFormat("en-IN");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

// format date & time
export const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: TIME_ZONE,
  timeStyle: "medium",
  dateStyle: "medium",
});
export const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: TIME_ZONE,
  dateStyle: "medium",
});
export const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: TIME_ZONE,
  timeStyle: "medium",
});
export function formatDateTiem(dateString: Date | string) {
  const formattedDateTime: string = dateTimeFormatter.format(
    new Date(dateString)
  );
  const formattedDate: string = dateFormatter.format(new Date(dateString));
  const formattedTime: string = timeFormatter.format(new Date(dateString));

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
}

// Convert prisma object to plain object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToPlainObject<T>(value: any): T {
  return JSON.parse(JSON.stringify(value));
}

export function serializeDecimal<T>(obj: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stringify = (value: any) => {
    if (value instanceof Prisma.Decimal) {
      return value.toNumber();
    }
    return value;
  };

  if (Array.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return obj.map((item) => serializeDecimal(item)) as any;
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializeDecimal(value)])
    ) as T;
  }

  return stringify(obj) as T;
}

// Cart item validation helper
export const validateQuantity = (
  currentQty: number,
  requestedQty: number,
  variant: { stock: number; maxOrderQty?: number | null }
) => {
  if (currentQty + requestedQty > variant.stock) {
    throw new Error("Not enough stock");
  }
  if (variant.maxOrderQty && currentQty + requestedQty > variant.maxOrderQty) {
    throw new Error(`Maximum order limit is ${variant.maxOrderQty}`);
  }
};

export async function generateOrderNumber(): Promise<string> {
  // Get today's date in YYYYMMDD format
  const date = new Date();
  const dateString =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");

  // Get the latest order for today
  const latestOrder = await prisma.order.findFirst({
    where: {
      orderNumber: {
        startsWith: `SSB-${dateString}`,
      },
    },
    orderBy: {
      orderNumber: "desc",
    },
  });

  // Extract the sequence number and increment
  let sequenceNumber = 1;
  if (latestOrder) {
    const lastSequence = parseInt(latestOrder.orderNumber.split("-")[2]);
    sequenceNumber = lastSequence + 1;
  }

  // Generate the new order number
  const orderNumber = `SSB-${dateString}-${sequenceNumber
    .toString()
    .padStart(4, "0")}`;

  return orderNumber;
}

// Payment utilities

export const initializeRazorpayPayment = (
  options: RazorpayOptions
): Promise<RazorpayResponse> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const razorpay = new (window.Razorpay as any)(options);

    razorpay.on("payment.success", (response: RazorpayResponse) => {
      resolve(response);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    razorpay.on("payment.error", (err: any) => {
      reject(err);
    });

    razorpay.open();
  });
};
