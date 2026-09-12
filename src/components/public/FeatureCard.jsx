"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconBadge from "./IconBadge";
import { getPublicIcon } from "@/config/publicIcons";
import { motion, shadows } from "@/theme/tokens";

/** Icon + title + copy. The generic "why us" / "what you get" tile. */
export default function FeatureCard({ title, detail, icon, tone = "primary" }) {
  const Icon = getPublicIcon(icon);

  return (
    <Card
      sx={{
        p: { xs: 2.5, md: 3 },
        height: "100%",
        transition: `transform ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}`,
        "&:hover": { transform: "translateY(-4px)", boxShadow: shadows.cardHover },
        "&:hover .jc-badge": { transform: "scale(1.08)" },
      }}
    >
      <Stack spacing={2}>
        <IconBadge icon={Icon} tone={tone} className="jc-badge" sx={{ transition: `transform ${motion.base} ${motion.easeOut}` }} />
        <Stack spacing={0.75}>
          <Typography variant="h6" sx={{ fontSize: 17 }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{detail}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
