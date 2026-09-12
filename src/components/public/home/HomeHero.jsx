"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import HeroSearch from "../HeroSearch";
import Reveal from "../Reveal";
import AvailabilityPreview from "./AvailabilityPreview";
import { portalStats } from "@/data/publicSite";
import { colors, motion, withAlpha } from "@/theme/tokens";

const TRUST = [
  `${portalStats.vendors.toLocaleString("en-PK")} verified vendors`,
  `${portalStats.eventsDelivered.toLocaleString("en-PK")} events delivered`,
  `${portalStats.averageRating} / 5 average rating`,
];

/**
 * Landing hero. The background is two soft radial washes that drift very slowly —
 * enough movement to feel alive behind static text, not enough to distract. Both
 * stop entirely under `prefers-reduced-motion`.
 */
export default function HomeHero() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: colors.surfaceSubtle,
        pb: { xs: 8, md: 12 },
        /* the header is transparent until scroll, so the hero sits behind it and
           pads itself back down by the header's height */
        mt: { xs: "-68px", md: "-76px" },
        pt: { xs: "108px", md: "148px" },
      }}
    >
      <Glow top={-160} left={-120} color={colors.primary} size={460} duration="18s" />
      <Glow top={60} left="58%" color={colors.accent} size={380} duration="22s" />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${withAlpha(colors.primary, 0.045)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(colors.primary, 0.045)} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(circle at 30% 20%, #000 20%, transparent 75%)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box sx={{ display: "grid", gap: { xs: 5, lg: 8 }, gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" }, alignItems: "center" }}>
          <Box>
            <Reveal y={16}>
              <Chip
                icon={<BoltRoundedIcon />}
                label="Live availability across Pakistan"
                sx={{ bgcolor: colors.primarySoft, color: colors.primaryDark, fontWeight: 700, mb: 2.5 }}
              />
            </Reveal>

            <Reveal delay={90}>
              <Typography variant="h1" sx={{ fontSize: { xs: 38, sm: 52, md: 62 } }}>
                Book your wedding venue in{" "}
                <Box component="span" sx={{ position: "relative", whiteSpace: "nowrap", color: colors.primary }}>
                  four clicks
                  <Box
                    aria-hidden
                    sx={{
                      position: "absolute", left: 0, right: 0, bottom: 4, height: 10, borderRadius: 999,
                      bgcolor: withAlpha(colors.secondary, 0.35), zIndex: -1,
                    }}
                  />
                </Box>
              </Typography>
            </Reveal>

            <Reveal delay={170}>
              <Typography sx={{ mt: 2.5, fontSize: { xs: 16, md: 18.5 }, lineHeight: 1.75, color: "text.secondary", maxWidth: 560 }}>
                Halls, marquees and caterers with published rates and real calendars.
                Compare, pick a free date and confirm — without a single phone call.
              </Typography>
            </Reveal>

            <Reveal delay={250} sx={{ mt: 4 }}>
              <HeroSearch />
            </Reveal>

            <Reveal delay={330}>
              <Stack direction="row" spacing={2.5} sx={{ mt: 3.5, flexWrap: "wrap", rowGap: 1.25 }}>
                {TRUST.map((item) => (
                  <Stack key={item} direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 17, color: colors.success }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Reveal>

            <Reveal delay={390}>
              <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: "wrap", gap: 1.5 }}>
                <Button component={Link} href="/listings" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>
                  Browse all listings
                </Button>
                <Button component={Link} href="/about" size="large" variant="outlined" startIcon={<VerifiedRoundedIcon />} sx={{ borderColor: colors.borderStrong, color: "text.primary" }}>
                  How the portal works
                </Button>
              </Stack>
            </Reveal>
          </Box>

          <Reveal delay={220} x={24} y={0} sx={{ display: { xs: "none", lg: "block" } }}>
            <AvailabilityPreview />
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}

/** Decorative drifting wash. */
function Glow({ top, left, color, size, duration }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${withAlpha(color, 0.22)}, transparent 68%)`,
        animation: `jc-float ${duration} ${motion.ease} infinite alternate`,
        "@keyframes jc-float": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(36px, -28px, 0) scale(1.1)" },
        },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    />
  );
}
