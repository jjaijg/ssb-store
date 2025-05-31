import { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

// Define protected route patterns
const PROTECTED_ROUTES = {
  authenticated: [
    /^\/profile/,
    /^\/shipping-address/,
    /^\/payment-method/,
    /^\/place-order/,
    /^\/user\/(.*)/,
    /^\/order\/(.*)/,
  ],
  admin: [/^\/admin\/(.*)/],
  public: [/^\/signin/, /^\/signup/],
} as const;

export const authConfig = {
  providers: [], // Providers are configured in auth.ts
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      // Prevent authenticated users from accessing login/signup pages
      if (
        auth &&
        PROTECTED_ROUTES.public.some((pattern) => pattern.test(pathname))
      ) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      // Check for authenticated routes
      const isProtectedRoute = PROTECTED_ROUTES.authenticated.some((pattern) =>
        pattern.test(pathname)
      );

      // Check for admin routes
      const isAdminRoute = PROTECTED_ROUTES.admin.some((pattern) =>
        pattern.test(pathname)
      );

      // If it's an admin route, check for admin role
      if (isAdminRoute && !auth) {
        // Role is not getting exposed in the auth object
        // Uncomment the following line if you have a way to access user role in auth
        // until then each admin page will check the role
        // return auth?.user.role === "ADMIN";
        return false;
      } else if (isProtectedRoute && !auth) {
        // For protected routes, check if user is authenticated
        return false;
      }

      // Allow access to public routes
      // Check for cart session cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate new session cartId cookie
        const sessionCartId = crypto.randomUUID();

        // clone request headers
        const newReqHeaders = new Headers(request.headers);

        // create new response and add new headers
        const response = NextResponse.next({
          request: {
            headers: newReqHeaders,
          },
        });

        // set newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
