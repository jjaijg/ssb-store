import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
