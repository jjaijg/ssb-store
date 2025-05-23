import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AppBar, Button, Toolbar } from "@mui/material";
import Image from "next/image";
import HeaderSearch from "./HeaderSearch";
import CategoryMenu from "./CategoryMenu";
import HeaderMenu from "./HeaderMenu";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

type Props = {
  renderMenu?: () => React.ReactNode;
  hideBranding?: boolean;
  hideSearch?: boolean;
  hideCategory?: boolean;
};

const AppHeader = ({
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
              <Image
                src={"/images/logo.webp"}
                alt={`${APP_NAME} Logo`}
                width={60}
                height={60}
              />
              {!hideBranding && (
                <Typography variant="h5">{APP_NAME}</Typography>
              )}
            </Box>
            {/* App menu */}
            {renderMenu?.()}
            {/* Search bar */}
            {!hideSearch && <HeaderSearch />}
            {/* Menu list */}
            <HeaderMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppHeader;
