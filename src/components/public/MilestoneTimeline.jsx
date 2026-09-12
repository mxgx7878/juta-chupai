"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Reveal from "./Reveal";
import { colors, withAlpha } from "@/theme/tokens";

/** Vertical history rail. Each entry slides in from the left as it is reached. */
export default function MilestoneTimeline({ milestones = [] }) {
  return (
    <Box sx={{ position: "relative", pl: { xs: 3.5, md: 4 } }}>
      <Box
        aria-hidden
        sx={{
          position: "absolute", left: { xs: 7, md: 9 }, top: 8, bottom: 8, width: 2,
          background: `linear-gradient(180deg, ${colors.primary}, ${withAlpha(colors.accent, 0.4)}, transparent)`,
        }}
      />

      <Stack spacing={{ xs: 4, md: 5 }}>
        {milestones.map((m, i) => (
          <Reveal key={m.year} delay={i * 90} x={-16} y={0}>
            <Box sx={{ position: "relative" }}>
              <Box
                aria-hidden
                sx={{
                  position: "absolute", left: { xs: -28, md: -31 }, top: 6,
                  width: 14, height: 14, borderRadius: "50%",
                  bgcolor: colors.primary, border: `3px solid ${colors.surface}`,
                  boxShadow: `0 0 0 3px ${withAlpha(colors.primary, 0.18)}`,
                }}
              />
              <Typography variant="overline" sx={{ color: colors.primary }}>{m.year}</Typography>
              <Typography variant="h6" sx={{ mt: 0.25 }}>{m.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.75, maxWidth: 560 }}>
                {m.detail}
              </Typography>
            </Box>
          </Reveal>
        ))}
      </Stack>
    </Box>
  );
}
