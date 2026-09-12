"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Reveal from "./Reveal";
import { colors, withAlpha } from "@/theme/tokens";

/**
 * Eyebrow + title + supporting line. Used by every section on every public page
 * so headings are typographically identical everywhere.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
  maxWidth = 620,
  sx,
}) {
  const centered = align === "center";

  return (
    <Reveal sx={{ mb: { xs: 4, md: 6 }, ...sx }}>
      <Stack spacing={1.5} sx={{ alignItems: centered ? "center" : "flex-start", textAlign: centered ? "center" : "left" }}>
        {eyebrow && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: "var(--jc-radius-pill)",
              bgcolor: inverse ? withAlpha(colors.surface, 0.1) : colors.primarySoft,
              color: inverse ? colors.textOnInverse : colors.primaryDark,
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: inverse ? colors.secondaryLight : colors.primary }} />
            <Typography variant="overline" sx={{ fontSize: 11, lineHeight: 1.8 }}>{eyebrow}</Typography>
          </Box>
        )}

        <Typography variant="h2" sx={{ fontSize: { xs: 28, sm: 34, md: 42 }, maxWidth, color: inverse ? colors.textOnInverse : "text.primary" }}>
          {title}
        </Typography>

        {description && (
          <Typography sx={{ maxWidth, fontSize: { xs: 15, md: 17 }, lineHeight: 1.7, color: inverse ? colors.textOnInverseMuted : "text.secondary" }}>
            {description}
          </Typography>
        )}
      </Stack>
    </Reveal>
  );
}
