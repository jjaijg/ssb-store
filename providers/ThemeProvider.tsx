import React, { PropsWithChildren } from "react";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#003049",
    },
    secondary: {
      main: "#669bbc",
    },
    background: {
      default: "#ffffff",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorInherit: {
          backgroundColor: "#eee",
          color: "#476C83",
        },
      },
      defaultProps: {
        color: "inherit",
      },
    },
  },
};

const theme = createTheme({
  ...themeOptions,
});

const ThemeProvider = ({ children }: PropsWithChildren) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
