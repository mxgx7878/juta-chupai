"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useInView from "@/hooks/useInView";
import { colors, motion, withAlpha } from "@/theme/tokens";

/**
 * Horizontal magnitude bars with the value printed on every row.
 *
 * Used for the category mix and the satisfaction scores. A single hue is used on
 * purpose: these rows compare magnitudes of the same measure, so hue carries no
 * extra information — and one hue keeps the chart readable for colour-blind
 * visitors without relying on a legend. Bars grow from zero when scrolled into
 * view, which is also why the value label sits outside the bar.
 */
export default function MeasureBars({ title, caption, rows = [], unit = "%", max }) {
  const [ref, inView] = useInView();
  const ceiling = max || Math.max(...rows.map((r) => r.value), 1);

  return (
    <Card sx={{ p: { xs: 2.5, md: 3.5 }, height: "100%" }} ref={ref}>
      {title && <Typography variant="h6">{title}</Typography>}
      {caption && <Typography variant="caption" color="text.secondary">{caption}</Typography>}

      <Stack spacing={2.25} sx={{ mt: title ? 3 : 0 }}>
        {rows.map((row, i) => (
          <Box key={row.label}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "baseline", mb: 0.75 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: colors.textPrimary }}>
                {row.value}{unit}
              </Typography>
            </Stack>
            <Box sx={{ height: 8, borderRadius: 999, bgcolor: withAlpha(colors.primary, 0.1), overflow: "hidden" }}>
              <Box
                sx={{
                  height: "100%",
                  borderRadius: 999,
                  bgcolor: colors.primary,
                  width: inView ? `${(row.value / ceiling) * 100}%` : 0,
                  transition: `width 900ms ${motion.easeOut} ${i * 90}ms`,
                  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
