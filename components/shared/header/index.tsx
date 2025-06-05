import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AppBar, Toolbar } from "@mui/material";
import Image from "next/image";
import HeaderSearch from "./HeaderSearch";
import CategoryMenu from "./CategoryMenu";
import HeaderMenu from "./HeaderMenu";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { SerializedCart } from "@/types";

type Props = {
  cart?: SerializedCart | null;
  renderMenu?: () => React.ReactNode;
  hideBranding?: boolean;
  hideSearch?: boolean;
  hideCategory?: boolean;
};

const AppHeader = ({
  cart,
  renderMenu,
  hideBranding,
  hideSearch,
  hideCategory,
}: Props) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {/* Category drawer */}
          {!hideCategory && <CategoryMenu />}
          {/* Logo and title */}
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            {/* Logo and title */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Link href={"/"}>
                <Image
                  src={"/images/logo.webp"}
                  alt={`${APP_NAME} Logo`}
                  width={60}
                  height={60}
                />
              </Link>
              {!hideBranding && (
                <Link href={"/"}>
                  <Typography variant="h5">{APP_NAME}</Typography>
                </Link>
              )}
            </Box>
            {/* App menu */}
            {renderMenu?.()}
            {/* Search bar */}
            {!hideSearch && <HeaderSearch />}
            {/* Menu list */}
            <HeaderMenu cart={cart} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppHeader;
