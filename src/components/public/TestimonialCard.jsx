"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import { colors, motion, shadows, withAlpha } from "@/theme/tokens";

/** One client review. Used on the home page, the reviews page and About. */
export default function TestimonialCard({ testimonial, compact = false }) {
  const t = testimonial;

  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 3 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: `transform ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}`,
        "&:hover": { transform: "translateY(-4px)", boxShadow: shadows.cardHover },
      }}
    >
      <FormatQuoteRoundedIcon
        sx={{ position: "absolute", top: -6, right: 8, fontSize: 88, color: withAlpha(colors.primary, 0.06) }}
      />

      <Rating value={t.rating} precision={0.5} readOnly size="small" sx={{ color: colors.secondary }} />

      <Typography
        sx={{ mt: 1.5, fontSize: compact ? 14.5 : 16, lineHeight: 1.75, color: "text.primary", position: "relative", flex: 1 }}
      >
        {t.quote}
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mt: 2.5, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: colors.primarySoft, color: colors.primaryDark, fontWeight: 800, fontSize: 15 }}>
          {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>{t.name}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {t.role} · {t.city}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
