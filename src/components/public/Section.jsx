"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { colors, gradients } from "@/theme/tokens";

/* Background treatments available to a section. Keeping them named means a page
   composes rhythm out of tokens instead of ad-hoc colours. */
const TONES = {
  default: { background: colors.surface },
  subtle: { background: colors.surfaceSubtle },
  muted: { background: colors.surfaceMuted },
  brand: { background: gradients.brandSoft },
  dark: { background: gradients.night, color: colors.textOnInverse },
};

/**
 * Vertical rhythm for the public site. Every band of content uses this, so
 * spacing and max-width never drift between pages.
 */
export default function Section({
  children,
  tone = "default",
  id,
  dense = false,
  maxWidth = "lg",
  sx,
  containerSx,
  ...rest
}) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        position: "relative",
        py: dense ? { xs: 6, md: 8 } : { xs: 8, md: 12 },
        ...TONES[tone],
        ...sx,
      }}
      {...rest}
    >
      <Container maxWidth={maxWidth} sx={{ position: "relative", zIndex: 1, ...containerSx }}>
        {children}
      </Container>
    </Box>
  );
}
