"use client";

import { createTheme } from "@mui/material/styles";

// Clean, premium admin palette (soft grays, indigo primary, teal accent).
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5",
      light: "#6366f1",
      dark: "#3730a3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ea5a4",
      light: "#2dd4bf",
      dark: "#0f766e",
      contrastText: "#ffffff",
    },
    success: { main: "#22a06b", light: "#e7f6ee" },
    warning: { main: "#d99400", light: "#fbf1dc" },
    error: { main: "#e5484d", light: "#fdecec" },
    info: { main: "#2f6fed", light: "#e6efff" },
    background: {
      default: "#f6f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#1c252e",
      secondary: "#637381",
    },
    divider: "rgba(145,158,171,0.20)",
    grey: {
      50: "#f9fafb",
      100: "#f4f6f8",
      200: "#eceff2",
      300: "#dfe3e8",
      500: "#919eab",
      700: "#454f5b",
      900: "#1c252e",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter Variable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600 },
    overline: { fontWeight: 700, letterSpacing: "0.08em" },
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid rgba(145,158,171,0.16)",
          boxShadow:
            "0 0 2px 0 rgba(145,158,171,0.20), 0 12px 24px -4px rgba(145,158,171,0.12)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, textTransform: "none", fontWeight: 600 },
        sizeMedium: { paddingTop: 8, paddingBottom: 8 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          // subtle zebra striping so rows/columns read clearly
          "& tbody tr:nth-of-type(odd)": { backgroundColor: "rgba(79,70,229,0.025)" },
          "& tbody tr:hover": { backgroundColor: "rgba(79,70,229,0.06)" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid rgba(145,158,171,0.16)" },
        head: {
          color: "#4a4a63",
          backgroundColor: "rgba(79,70,229,0.07)",
          fontWeight: 700,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          borderBottom: "1px solid rgba(79,70,229,0.14)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginBottom: 2,
          "&.Mui-selected": {
            backgroundColor: "rgba(79,70,229,0.10)",
            color: "#4f46e5",
            "&:hover": { backgroundColor: "rgba(79,70,229,0.16)" },
            "& .MuiListItemIcon-root": { color: "#4f46e5" },
          },
        },
      },
    },
  },
});

export default theme;
