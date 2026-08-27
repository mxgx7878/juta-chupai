"use client";

import { Provider } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "@/store";
import theme from "@/theme/theme";

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
