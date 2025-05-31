import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; // Ensure you have a Prisma client setup
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { cookies } from "next/headers";

export const config = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma) as NextAuthConfig["adapter"],
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if credentials are provided
        if (!credentials) return null;

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          // If user not found or password is not set, return null
          return null;
        }

        // Verify the password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          return null;
        }

        // Return the user object (omit sensitive fields like password)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // handle session update
      // when user updates their profile
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // check for session cart
      if (trigger === "signIn" || trigger === "signUp") {
        const cookiesObj = await cookies();
        const sessionCartId = cookiesObj.get("sessionCartId")?.value;

        if (sessionCartId) {
          const sessionCart = await prisma.cart.findFirst({
            where: { sessioncartId: sessionCartId },
          });

          if (sessionCart) {
            // delete current user cart
            await prisma.cart.deleteMany({
              where: {
                userId: user.id,
              },
            });

            // Assign new cart
            await prisma.cart.update({
              where: { id: sessionCart.id },
              data: {
                userId: user.id,
              },
            });
          }
        }
      }

      return token;
    },
    async session({ session, token, trigger, user }) {
      // Attach user ID and role to the session
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      // Update session user name if it exists
      // and the trigger is "update" via the jwt callback
      // This is useful when the user updates their profile
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
