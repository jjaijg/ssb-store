import AppHeader from "@/components/shared/header";
import React, { PropsWithChildren } from "react";
import MainNav from "../../components/shared/main-nav";

const links = [
  {
    label: "Profile",
    href: "/user/profile",
  },
  {
    label: "Orders",
    href: "/user/orders",
  },
];

const UserLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader
        hideBranding
        hideSearch
        hideCategory
        renderMenu={() => <MainNav links={links} />}
      />
      <main className="flex-1 wrapper">{children}</main>
    </div>
  );
};

export default UserLayout;
