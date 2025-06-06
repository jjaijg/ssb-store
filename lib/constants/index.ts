import { Address } from "@prisma/client";
import { CheckoutFormData } from "../validationSchema/checkout.schema";

// APP constants
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SSB STORE";
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "SSB STORE is a grocery shopping app.";
export const APP_KEYWORDS =
  process.env.NEXT_PUBLIC_APP_KEYWORDS || "grocery, shopping, app, ssb store";
export const APP_AUTHOR = process.env.NEXT_PUBLIC_APP_AUTHOR || "Jai Ganesh J";
export const APP_AUTHOR_EMAIL = process.env.NEXT_PUBLIC_APP_AUTHOR_EMAIL || "";
export const APP_COPYRIGHT = `© ${new Date().getFullYear()} ${APP_AUTHOR}. All rights reserved.`;
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const TIME_ZONE = process.env.TIME_ZONE || "Asia/Kolkata";

export const DEFAULT_ADDRESS: Omit<
  Address,
  "id" | "userId" | "createdAt" | "updatedAt" | "type" | "landmark"
> = {
  name: "",
  city: "",
  door: "",
  postalCode: "",
  street: "",
  state: "Tamil Nadu",
  country: "India",
  isDefault: false,
};

export const DEFAULT_CHECKOUT_DATA: CheckoutFormData = {
  sameAsShipping: true,
  paymentMethod: "RAZORPAY",
  shippingAddress: {
    ...DEFAULT_ADDRESS,
    type: "SHIPPING",
  },
  billingAddress: {
    ...DEFAULT_ADDRESS,
    type: "BILLING",
  },
};
