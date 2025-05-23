"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  signinFormSchema,
  signupFormSchema,
  updateProfileSchema,
} from "../validationSchema/user.schema";
import { formatError } from "../utils";
import { prisma } from "../prisma";
import { auth, signIn, signOut } from "@/auth";
import bcrypt from "bcryptjs";

export const signupAction = async (prevState: unknown, formData: FormData) => {
  try {
    // Extract form data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate the form data using the schema
    // This will throw an error if validation fails
    const userData = signupFormSchema.parse({
      name,
      email,
      password,
      confirmPassword,
    });

    // Create a new user in the database
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: bcrypt.hashSync(userData.password),
      },
    });

    // Sign in the user after successful registration
    await signIn("credentials", {
      email: userData.email,
      password: userData.password,
    });

    // Optionally, you can redirect the user to a different page after registration
    return { success: true, message: "Registration successfully" };
  } catch (error) {
    // Handle errors
    if (isRedirectError(error)) throw error;

    // If the error is a validation error, format it
    return { success: false, message: formatError(error) };
  }
};

export const signinAction = async (formData: FormData) => {
  try {
    // Extract form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate the form data using the schema
    const user = signinFormSchema.parse({
      email,
      password,
    });

    // Sign in the user
    await signIn("credentials", user);

    // Optionally, you can redirect the user to a different page after login
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    // Handle errors
    if (isRedirectError(error)) throw error;

    // other error
    return { success: false, message: "Invalid credentails" };
  }
};

export const signoutAction = async () => {
  await signOut({ redirectTo: "/" });
};

// update user profile
export const updateProfileAction = async (user: {
  name: string;
  email: string;
}) => {
  try {
    // check user exists
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user.id },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Validate the form data using the schema
    const userData = updateProfileSchema.parse({
      ...user,
    });

    // Update the user in the database
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: userData.name,
      },
    });

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    // If the error is a validation error, format it
    return { success: false, message: formatError(error) };
  }
};
