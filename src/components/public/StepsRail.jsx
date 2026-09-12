"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Reveal from "./Reveal";
import IconBadge from "./IconBadge";
import { getPublicIcon } from "@/config/publicIcons";
import { colors, motion, withAlpha } from "@/theme/tokens";

/**
 * The four-click booking journey. A connecting line is drawn behind the cards on
 * desktop and animates in with the section, which reads as one continuous flow
 * rather than four unrelated boxes.
 */
export default function StepsRail({ steps }) {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 34,
          left: "12%",
          right: "12%",
          height: 2,
          display: { xs: "none", md: "block" },
          background: `linear-gradient(90deg, ${withAlpha(colors.primary, 0)}, ${withAlpha(colors.primary, 0.35)}, ${withAlpha(colors.accent, 0.35)}, ${withAlpha(colors.accent, 0)})`,
        }}
      />

      <Box sx={{ display: "grid", gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
        {steps.map((s, i) => {
          const Icon = getPublicIcon(s.icon);
          return (
            <Reveal key={s.step} delay={i * 110}>
              <Stack spacing={1.75} sx={{ alignItems: { xs: "flex-start", md: "center" }, textAlign: { xs: "left", md: "center" }, "&:hover .jc-step-badge": { transform: "translateY(-4px)" } }}>
                <Box sx={{ position: "relative" }}>
                  <IconBadge
                    icon={Icon}
                    size={68}
                    className="jc-step-badge"
                    sx={{ bgcolor: colors.surface, border: "1px solid", borderColor: colors.border, boxShadow: `0 12px 28px -18px ${colors.primary}`, transition: `transform ${motion.base} ${motion.easeOut}` }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      bgcolor: colors.primary,
                      color: colors.primaryContrast,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12.5,
                      fontWeight: 800,
                      border: `2px solid ${colors.surface}`,
                    }}
                  >
                    {s.step}
                  </Box>
                </Box>

                <Stack spacing={0.75} sx={{ maxWidth: 260 }}>
                  <Typography variant="h6" sx={{ fontSize: 17 }}>{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{s.detail}</Typography>
                </Stack>
              </Stack>
            </Reveal>
          );
        })}
      </Box>
    </Box>
  );
}
