import {
  Brand,
  Category,
  Product,
  ProductVariant,
  CartItem,
  Cart,
  OrderItem,
  Order,
  Address,
} from "@prisma/client";

export type SerializedProduct = Omit<Product, "rating"> & {
  rating: number; // Instead of Decimal
};

export type SerializedProductVariant = Omit<
  ProductVariant,
  "price" | "value" | "discountValue"
> & {
  price: number; // Instead of Decimal
  value: number; // Instead of Decimal
  discountValue: number; // Instead of Decimal
  product: SerializedProduct; // Include product information
};

export type SerializedProductWithVariants = SerializedProduct & {
  category: Category;
  brand: Brand;
  variants: SerializedProductVariant[];
};

export type SerializedCartItem = Omit<CartItem, "price" | "discountValue"> & {
  price: number; // Instead of Decimal
  discountValue: number; // Instead of Decimal
  variant: SerializedProductVariant;
};

export type SerializedCart = Omit<Cart, "shippingPrice" | "taxPrice"> & {
  shippingPrice: number;
  taxPrice: number;
  items: SerializedCartItem[];
};

export type SerializedOrderItem = Omit<
  OrderItem,
  "price" | "discount" | "total"
> & {
  price: number;
  discount: number;
  total: number;
};
export type SerializedOrderItemWithVariant = SerializedOrderItem & {
  variant: SerializedProductVariant;
};

export type SerializedOrder = Omit<
  Order,
  "subtotal" | "shippingCost" | "tax" | "discount" | "total"
> & {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  items: SerializedOrderItem[];
};

export type SerializedOrderDetail = Omit<SerializedOrder, "items"> & {
  items: SerializedOrderItemWithVariant[];
  shippingAddress: Address;
  billingAddress: Address;
};

// Home page types
export type BannerProduct = {
  id: string;
  name: string;
  slug: string;
  bannerImage: string;
  brand: {
    name: string;
  };
};

// Payment
export interface PaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentErrorResult {
  code: string;
  description: string;
  metadata: {
    order_id: string;
    payment_id: string;
  };
  reason: string;
  source: string;
  step: string;
}

// Razor pay
declare global {
  interface Window {
    Razorpay: unknown;
  }
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color: string;
  };
  method?: {
    upi?: {
      flow: "collect" | "intent";
      vpa?: string;
    };
    netbanking?: boolean;
    card?: boolean;
    wallet?: boolean;
    paylater?: boolean;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
