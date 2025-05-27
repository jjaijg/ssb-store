import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { TIME_ZONE } from "./constants";

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
export function convertToPlainObject<T>(value: any): T {
  return JSON.parse(JSON.stringify(value));
}

export function serializeDecimal<T>(obj: T): T {
  const stringify = (value: any) => {
    if (value instanceof Prisma.Decimal) {
      return value.toNumber();
    }
    return value;
  };

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeDecimal(item)) as any;
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializeDecimal(value)])
    ) as T;
  }

  return stringify(obj) as T;
}
