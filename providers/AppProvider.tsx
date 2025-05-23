"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import React, { PropsWithChildren } from "react";
import ThemeProvider from "./ThemeProvider";

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default AppProvider;
