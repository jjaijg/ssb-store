import Footer from "@/components/shared/footer";
import AppHeader from "@/components/shared/header";
import { getUserCart } from "@/lib/actions/cart.actions";
import Script from "next/script";
import React, { PropsWithChildren } from "react";

type Props = {};

const RootLayout = async ({ children }: PropsWithChildren) => {
  const cart = await getUserCart();
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
      <div className="flex flex-col h-screen">
        <AppHeader cart={cart} />
        <main className="flex-1 wrapper">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default RootLayout;
