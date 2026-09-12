"use client";

import { createTheme } from "@mui/material/styles";
import { colors, radii, shadows, motion, withAlpha } from "./tokens";

/* The MUI theme is *derived* from tokens.js — never hard-code a colour here.
   Admin, vendor portal and the public site all render through this theme, so
   one token change repaints the entire product. */
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: colors.primaryContrast,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
      dark: colors.secondaryDark,
      contrastText: colors.secondaryContrast,
    },
    success: { main: colors.success, light: colors.successSoft },
    warning: { main: colors.warning, light: colors.warningSoft },
    error: { main: colors.error, light: colors.errorSoft },
    info: { main: colors.info, light: colors.infoSoft },
    background: { default: colors.canvas, paper: colors.surface },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      disabled: colors.textDisabled,
    },
    divider: colors.divider,
    grey: {
      50: colors.surfaceSubtle,
      100: colors.surfaceMuted,
      200: colors.border,
      300: colors.borderStrong,
      500: colors.textDisabled,
      700: colors.textSecondary,
      900: colors.textPrimary,
    },
  },
  shape: { borderRadius: radii.md },
  typography: {
    fontFamily:
      '"Inter Variable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08 },
    h2: { fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.14 },
    h3: { fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 },
    h4: { fontWeight: 700, letterSpacing: "-0.015em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600 },
    overline: { fontWeight: 700, letterSpacing: "0.14em" },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: radii.lg,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radii.sm + 2,
          textTransform: "none",
          fontWeight: 600,
          transition: `background-color ${motion.fast} ${motion.ease}, box-shadow ${motion.base} ${motion.ease}, transform ${motion.fast} ${motion.ease}`,
        },
        sizeMedium: { paddingTop: 8, paddingBottom: 8 },
        sizeLarge: { paddingTop: 12, paddingBottom: 12, paddingLeft: 24, paddingRight: 24 },
        containedPrimary: {
          "&:hover": { boxShadow: `0 12px 24px -12px ${withAlpha(colors.primary, 0.8)}` },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: radii.sm } } },
    /* `spacing` becomes a real CSS gap, so a Stack that wraps does not leave the
       staircase of margins the margin-based default produces. */
    MuiStack: { defaultProps: { useFlexGap: true } },
    MuiTable: {
      styleOverrides: {
        root: {
          "& tbody tr:nth-of-type(odd)": { backgroundColor: withAlpha(colors.primary, 0.025) },
          "& tbody tr:hover": { backgroundColor: withAlpha(colors.primary, 0.06) },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${colors.divider}` },
        head: {
          color: colors.textSecondary,
          backgroundColor: withAlpha(colors.primary, 0.07),
          fontWeight: 700,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          borderBottom: `1px solid ${withAlpha(colors.primary, 0.14)}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm + 2,
          marginBottom: 2,
          "&.Mui-selected": {
            backgroundColor: withAlpha(colors.primary, 0.1),
            color: colors.primary,
            "&:hover": { backgroundColor: withAlpha(colors.primary, 0.16) },
            "& .MuiListItemIcon-root": { color: colors.primary },
          },
        },
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: radii.lg } } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: colors.inverse, fontSize: 12, borderRadius: radii.sm, padding: "6px 10px" },
        arrow: { color: colors.inverse },
      },
    },
  },
});

export default theme;
