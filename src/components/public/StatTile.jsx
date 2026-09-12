"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useInView from "@/hooks/useInView";
import useCountUp from "@/hooks/useCountUp";
import { getPublicIcon } from "@/config/publicIcons";
import IconBadge from "./IconBadge";
import { colors, motion, shadows, withAlpha } from "@/theme/tokens";

/**
 * A single portal metric. The figure counts up the first time the tile is
 * scrolled into view — the animation is the only thing that makes a static
 * number feel live, and it is skipped for reduced-motion visitors.
 */
export default function StatTile({ stat, inverse = false, delay = 0 }) {
  const [ref, inView] = useInView();
  const value = useCountUp(stat.value, { active: inView, decimals: stat.decimals || 0 });
  const Icon = getPublicIcon(stat.icon);

  const display = stat.decimals
    ? value.toFixed(stat.decimals)
    : Math.round(value).toLocaleString("en-PK");

  return (
    <Box
      ref={ref}
      sx={{
        p: { xs: 2.5, md: 3 },
        height: "100%",
        borderRadius: "var(--jc-radius-lg)",
        border: "1px solid",
        borderColor: inverse ? withAlpha(colors.surface, 0.12) : colors.border,
        bgcolor: inverse ? withAlpha(colors.surface, 0.06) : colors.surface,
        boxShadow: inverse ? "none" : shadows.card,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(18px)",
        transition: `opacity ${motion.reveal} ${motion.easeOut} ${delay}ms, transform ${motion.reveal} ${motion.easeOut} ${delay}ms, box-shadow ${motion.base} ${motion.ease}`,
        "&:hover": { boxShadow: inverse ? "none" : shadows.cardHover },
      }}
    >
      <Stack spacing={1.75}>
        <IconBadge icon={Icon} tone={inverse ? "inverse" : "primary"} size={44} />
        <Box>
          <Stack direction="row" spacing={0.25} sx={{ alignItems: "baseline" }}>
            <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 800, letterSpacing: "-0.02em", color: inverse ? colors.textOnInverse : "text.primary" }}>
              {display}
            </Typography>
            {stat.suffix && (
              <Typography sx={{ fontSize: 20, fontWeight: 800, color: inverse ? colors.secondaryLight : colors.secondary }}>
                {stat.suffix}
              </Typography>
            )}
          </Stack>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: inverse ? colors.textOnInverse : "text.primary" }}>
            {stat.label}
          </Typography>
          {stat.note && (
            <Typography variant="caption" sx={{ color: inverse ? colors.textOnInverseMuted : "text.secondary" }}>
              {stat.note}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
