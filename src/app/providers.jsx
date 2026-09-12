"use client";

import { Provider } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { store } from "@/store";
import theme from "@/theme/theme";
import { colors, cssVariables } from "@/theme/tokens";

/* The design tokens are published as `--jc-*` custom properties here, so plain
   CSS (keyframes, gradients, the scrollbar) reads the same values the MUI theme
   was built from. Change tokens.js and both update together. */
const globalStyles = (
  <GlobalStyles
    styles={{
      ":root": cssVariables(),
      html: { scrollBehavior: "smooth" },
      "@media (prefers-reduced-motion: reduce)": {
        html: { scrollBehavior: "auto" },
        "*, *::before, *::after": { animationDuration: "0.01ms !important", transitionDuration: "0.01ms !important" },
      },
      "*::-webkit-scrollbar": { width: 10, height: 10 },
      "*::-webkit-scrollbar-thumb": {
        background: colors.scrollbar,
        borderRadius: 999,
        border: "3px solid transparent",
        backgroundClip: "padding-box",
      },
      "*::-webkit-scrollbar-thumb:hover": { background: colors.scrollbarHover, backgroundClip: "padding-box" },
      "::selection": { background: colors.primarySoft, color: colors.primaryDark },
    }}
  />
);

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
