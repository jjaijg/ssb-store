import AppHeader from "@/components/shared/header";
import React, { PropsWithChildren } from "react";

type Props = {};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <main className="flex-1 wrapper">{children}</main>
    </div>
  );
};

export default RootLayout;
