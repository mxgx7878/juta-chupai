"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Reveal from "./Reveal";
import { colors, gradients, motion, withAlpha } from "@/theme/tokens";

/** Closing call to action. Every public page ends with one, so it lives here once. */
export default function CTABanner({
  eyebrow = "Ready when you are",
  title = "Your date is probably still free",
  description = "Check live availability, compare real prices and confirm with the vendor in four clicks.",
  primary = { label: "Browse listings", href: "/listings" },
  secondary = { label: "List your business", href: "/vendor/login" },
}) {
  return (
    <Reveal>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--jc-radius-xl)",
          background: gradients.night,
          color: colors.textOnInverse,
          px: { xs: 3, md: 7 },
          py: { xs: 5, md: 8 },
        }}
      >
        {/* slow drifting glow — decorative only, disabled for reduced motion */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${withAlpha(colors.accent, 0.45)}, transparent 65%)`,
            filter: "blur(10px)",
            animation: "jc-drift 14s ease-in-out infinite alternate",
            "@keyframes jc-drift": {
              from: { transform: "translate3d(0,0,0) scale(1)" },
              to: { transform: "translate3d(-40px, 30px, 0) scale(1.12)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ position: "relative", alignItems: { md: "center" }, justifyContent: "space-between" }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography variant="overline" sx={{ color: colors.secondaryLight }}>{eyebrow}</Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: 26, md: 36 }, mt: 1 }}>{title}</Typography>
            <Typography sx={{ color: colors.textOnInverseMuted, mt: 1.5, lineHeight: 1.75 }}>{description}</Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flexShrink: 0 }}>
            <Button
              component={Link}
              href={primary.href}
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                bgcolor: colors.surface,
                color: colors.primaryDark,
                fontWeight: 700,
                transition: `transform ${motion.base} ${motion.easeOut}`,
                "&:hover": { bgcolor: colors.surface, transform: "translateY(-2px)" },
              }}
            >
              {primary.label}
            </Button>
            {secondary && (
              <Button
                component={Link}
                href={secondary.href}
                size="large"
                variant="outlined"
                sx={{ borderColor: withAlpha(colors.surface, 0.35), color: colors.textOnInverse, "&:hover": { borderColor: colors.surface, bgcolor: withAlpha(colors.surface, 0.08) } }}
              >
                {secondary.label}
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Reveal>
  );
}
