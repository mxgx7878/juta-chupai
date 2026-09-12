"use client";

import Box from "@mui/material/Box";
import { colors, motion, radii, withAlpha } from "@/theme/tokens";

/** Tinted rounded container for a feature icon. One shape for the whole site. */
export default function IconBadge({ icon: Icon, size = 48, tone = "primary", sx, ...rest }) {
  const tones = {
    primary: { bg: colors.primarySoft, fg: colors.primary },
    secondary: { bg: colors.secondarySoft, fg: colors.secondaryDark },
    accent: { bg: colors.accentSoft, fg: colors.accent },
    success: { bg: colors.successSoft, fg: colors.success },
    inverse: { bg: withAlpha(colors.surface, 0.12), fg: colors.textOnInverse },
  };
  const t = tones[tone] || tones.primary;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: `${radii.md}px`,
        bgcolor: t.bg,
        color: t.fg,
        display: "grid",
        placeItems: "center",
        transition: `transform ${motion.base} ${motion.easeOut}`,
        ...sx,
      }}
      {...rest}
    >
      <Icon sx={{ fontSize: size * 0.5 }} />
    </Box>
  );
}
