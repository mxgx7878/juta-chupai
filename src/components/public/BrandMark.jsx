"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { colors, gradients, motion, radii } from "@/theme/tokens";
import { site } from "@/config/site";

/** Logo lockup: gradient monogram + wordmark. Links home unless `static` is set. */
export default function BrandMark({ size = 40, inverse = false, href = "/", showTagline = true }) {
  const Wrapper = href ? Link : Box;

  return (
    <Stack
      component={Wrapper}
      {...(href ? { href } : {})}
      direction="row"
      spacing={1.25}
      sx={{ alignItems: "center", textDecoration: "none", color: "inherit", "&:hover .jc-monogram": { transform: "rotate(-4deg) scale(1.04)" } }}
    >
      <Box
        className="jc-monogram"
        sx={{
          width: size,
          height: size,
          borderRadius: `${radii.md}px`,
          background: gradients.brand,
          display: "grid",
          placeItems: "center",
          color: colors.primaryContrast,
          fontWeight: 800,
          fontSize: size * 0.4,
          letterSpacing: "-0.03em",
          boxShadow: `0 8px 20px -8px ${colors.primary}`,
          transition: `transform ${motion.base} ${motion.easeOut}`,
        }}
      >
        JC
      </Box>

      <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
        <Typography
          sx={{ fontWeight: 800, fontSize: size * 0.42, lineHeight: 1.15, letterSpacing: "-0.02em", whiteSpace: "nowrap", color: inverse ? colors.textOnInverse : "text.primary" }}
        >
          {site.name}
        </Typography>
        {showTagline && (
          <Typography variant="overline" sx={{ fontSize: 9.5, lineHeight: 1.4, whiteSpace: "nowrap", color: inverse ? colors.textOnInverseMuted : "text.secondary" }}>
            EVENT MARKETPLACE
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
