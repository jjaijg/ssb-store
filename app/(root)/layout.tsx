import Footer from "@/components/shared/footer";
import AppHeader from "@/components/shared/header";
import { getUserCart } from "@/lib/actions/cart.actions";
import React, { PropsWithChildren } from "react";

const RootLayout = async ({ children }: PropsWithChildren) => {
  const cart = await getUserCart();
  return (
    <>
      <div className="flex flex-col h-screen">
        <AppHeader cart={cart} />
        <main className="flex-1 wrapper">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default RootLayout;
