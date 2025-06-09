"use server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

export async function isAdminAuthenticated(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token) {
      return false;
    }

    // Check if user has admin role
    return token.role === Role.ADMIN;
  } catch (error) {
    console.error("Admin authentication error:", error);
    return false;
  }
}
