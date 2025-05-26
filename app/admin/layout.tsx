import AppHeader from "@/components/shared/header";
import React, { PropsWithChildren } from "react";
import MainNav from "../../components/shared/main-nav";

const links = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Brands", href: "/admin/brand" },
  { label: "Category", href: "/admin/category" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Users", href: "/admin/users" },
];

// This layout is used for the admin section of the application
const AdminLayout = ({ children }: PropsWithChildren) => {
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

export default AdminLayout;
