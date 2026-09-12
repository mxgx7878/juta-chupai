/**
 * tokens.js — THE single source of truth for every colour on the website.
 * ---------------------------------------------------------------------------
 * Change a value here and it changes everywhere, because nothing else in the
 * codebase hard-codes a brand colour. Three consumers read this file:
 *
 *   1. theme.js        -> builds the MUI theme (all components, sx props)
 *   2. cssVariables()  -> injects `:root { --jc-* }` custom properties, so raw
 *                         CSS (gradients, keyframes, scrollbars) stays in sync
 *   3. JS helpers      -> charts, JSON-LD, meta theme-color
 *
 * Naming: camelCase here becomes kebab-case CSS variables.
 *   primarySoft  ->  var(--jc-primary-soft)
 */

/* ---------------------------------------------------------------- palette -- */
export const colors = {
  /* Brand ---------------------------------------------------------------- */
  primary: "#4f46e5",
  primaryLight: "#7c74f2",
  primaryDark: "#372fb5",
  primarySoft: "#eff0ff",
  primaryContrast: "#ffffff",

  /* Secondary — the warm "celebration" gold used for accents and highlights */
  secondary: "#c08a2e",
  secondaryLight: "#e0b05a",
  secondaryDark: "#8f6415",
  secondarySoft: "#fdf3e2",
  secondaryContrast: "#ffffff",

  /* Tertiary — used sparingly for emphasis (badges, gradient stops) */
  accent: "#e0457b",
  accentSoft: "#ffeaf2",

  /* Semantic ------------------------------------------------------------- */
  success: "#1f9d63",
  successSoft: "#e4f6ec",
  warning: "#c98a04",
  warningSoft: "#fdf3d8",
  error: "#d94141",
  errorSoft: "#fdeaea",
  info: "#2f6fed",
  infoSoft: "#e7efff",

  /* Surfaces ------------------------------------------------------------- */
  canvas: "#f7f7fb",
  surface: "#ffffff",
  surfaceSubtle: "#fbfaff",
  surfaceMuted: "#f1f0f7",
  inverse: "#14121f",
  inverseSurface: "#1e1b2e",

  /* Text ----------------------------------------------------------------- */
  textPrimary: "#16141f",
  textSecondary: "#615c72",
  textDisabled: "#9a95a8",
  textOnInverse: "#f7f6ff",
  textOnInverseMuted: "#a9a3bd",

  /* Lines ---------------------------------------------------------------- */
  border: "#e7e4f0",
  borderStrong: "#d6d1e4",
  divider: "rgba(97, 92, 114, 0.16)",

  /* Utility -------------------------------------------------------------- */
  overlay: "rgba(20, 18, 31, 0.58)",
  scrollbar: "#cfcada",
  scrollbarHover: "#b0a9c2",
};

/* -------------------------------------------------------------- gradients -- */
/* Built from the palette above so a colour change flows through automatically. */
export const gradients = {
  brand: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 45%, ${colors.accent} 100%)`,
  brandSoft: `linear-gradient(135deg, ${colors.primarySoft} 0%, ${colors.secondarySoft} 100%)`,
  gold: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryLight} 100%)`,
  night: `linear-gradient(160deg, ${colors.inverse} 0%, ${colors.inverseSurface} 60%, ${colors.primaryDark} 160%)`,
  sheen: `linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)`,
};

/* ------------------------------------------------------------------ shape -- */
export const radii = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

export const shadows = {
  card: "0 1px 2px rgba(22,20,31,0.04), 0 12px 28px -12px rgba(22,20,31,0.14)",
  cardHover: "0 2px 4px rgba(22,20,31,0.05), 0 26px 48px -18px rgba(79,70,229,0.34)",
  header: "0 1px 0 rgba(22,20,31,0.06), 0 10px 30px -22px rgba(22,20,31,0.35)",
  popover: "0 24px 60px -20px rgba(22,20,31,0.30)",
};

/* ----------------------------------------------------------------- motion -- */
/* One place for timing so every animation on the site feels like one system. */
export const motion = {
  fast: "150ms",
  base: "260ms",
  slow: "520ms",
  reveal: "720ms",
  /* gentle deceleration — professional, never bouncy */
  ease: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
};

/* ------------------------------------------------------------- css bridge -- */
const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Flat `--jc-*` custom-property map generated from the tokens above. */
export function cssVariables() {
  const vars = {};
  Object.entries(colors).forEach(([k, v]) => { vars[`--jc-${kebab(k)}`] = v; });
  Object.entries(gradients).forEach(([k, v]) => { vars[`--jc-gradient-${kebab(k)}`] = v; });
  Object.entries(radii).forEach(([k, v]) => { vars[`--jc-radius-${kebab(k)}`] = `${v}px`; });
  Object.entries(shadows).forEach(([k, v]) => { vars[`--jc-shadow-${kebab(k)}`] = v; });
  Object.entries(motion).forEach(([k, v]) => { vars[`--jc-motion-${kebab(k)}`] = v; });
  return vars;
}

/** Hex + alpha -> rgba(). Keeps tint maths out of the components. */
export function withAlpha(hex, alpha) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Ordered series used by every chart, so charts follow the brand too. */
export const chartSeries = [
  colors.primary,
  colors.secondary,
  colors.accent,
  colors.info,
  colors.success,
  colors.primaryLight,
];
