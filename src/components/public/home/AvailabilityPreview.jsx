"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { colors, gradients, motion, shadows, withAlpha } from "@/theme/tokens";

/* Illustrative only — a still of what the booking step looks like, so the hero
   shows the product instead of stock photography. Marked aria-hidden because the
   real, interactive version of this is one click away on any listing page. */
const SLOTS = [
  { date: "Fri 14", slot: "Night", state: "taken" },
  { date: "Sat 15", slot: "Day", state: "free" },
  { date: "Sat 15", slot: "Night", state: "selected" },
  { date: "Sun 16", slot: "Day", state: "free" },
];

const STATE_STYLE = {
  free: { bg: colors.surface, border: colors.border, fg: colors.textSecondary, label: "Available" },
  taken: { bg: colors.errorSoft, border: "transparent", fg: colors.error, label: "Booked" },
  selected: { bg: colors.primarySoft, border: colors.primary, fg: colors.primaryDark, label: "Your pick" },
};

export default function AvailabilityPreview() {
  return (
    <Box sx={{ position: "relative" }} aria-hidden>
      <Card
        sx={{
          p: 3,
          borderRadius: "var(--jc-radius-xl)",
          boxShadow: shadows.popover,
          transform: "rotate(1.2deg)",
          transition: `transform ${motion.slow} ${motion.easeOut}`,
          "&:hover": { transform: "rotate(0deg) translateY(-4px)" },
        }}
      >
        <Box sx={{ height: 92, borderRadius: 2, background: gradients.brand, mb: 2.5, position: "relative", overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute", inset: 0, background: gradients.sheen,
              animation: "jc-sheen 4.5s linear infinite",
              "@keyframes jc-sheen": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(100%)" } },
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
          <Chip size="small" label="Verified venue" sx={{ position: "absolute", bottom: 10, left: 10, bgcolor: withAlpha(colors.surface, 0.94), fontWeight: 700 }} />
        </Box>

        <Typography variant="h6">Royal Hall</Typography>
        <Stack direction="row" spacing={1.5} sx={{ color: "text.secondary", mt: 0.5, mb: 2.5 }}>
          <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
            <PlaceRoundedIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption">Lahore</Typography>
          </Stack>
          <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
            <GroupsRoundedIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption">Up to 600 guests</Typography>
          </Stack>
        </Stack>

        <Typography variant="overline" color="text.secondary">Pick a slot</Typography>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {SLOTS.map((s) => {
            const style = STATE_STYLE[s.state];
            return (
              <Stack
                key={`${s.date}-${s.slot}`}
                direction="row"
                sx={{
                  alignItems: "center", justifyContent: "space-between",
                  px: 1.75, py: 1.15, borderRadius: 2,
                  bgcolor: style.bg, border: "1px solid", borderColor: style.border,
                  ...(s.state === "selected"
                    ? {
                        animation: "jc-pulse 2.8s ease-in-out infinite",
                        "@keyframes jc-pulse": {
                          "0%, 100%": { boxShadow: `0 0 0 0 ${withAlpha(colors.primary, 0.28)}` },
                          "50%": { boxShadow: `0 0 0 6px ${withAlpha(colors.primary, 0)}` },
                        },
                        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                      }
                    : {}),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.date} · {s.slot}</Typography>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: style.fg }}>
                  {s.state === "taken" ? <EventBusyRoundedIcon sx={{ fontSize: 15 }} /> : <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />}
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{style.label}</Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Card>

      <Card
        sx={{
          position: "absolute", bottom: -26, left: -28, px: 2.25, py: 1.5,
          display: "flex", alignItems: "center", gap: 1.25,
          boxShadow: shadows.popover, borderRadius: "var(--jc-radius-lg)",
          animation: "jc-bob 6s ease-in-out infinite alternate",
          "@keyframes jc-bob": { from: { transform: "translateY(0)" }, to: { transform: "translateY(-10px)" } },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        <Box sx={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: colors.successSoft, color: colors.success }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>Booking confirmed</Typography>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>JC-7K4M2Q</Typography>
        </Box>
      </Card>
    </Box>
  );
}
