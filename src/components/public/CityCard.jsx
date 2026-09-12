"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { colors, motion, shadows } from "@/theme/tokens";

/** City tile on the home page — links straight into a pre-filtered search. */
export default function CityCard({ city }) {
  return (
    <Card
      component={Link}
      href={`/listings?city=${encodeURIComponent(city.city)}`}
      sx={{
        p: 2.5,
        height: "100%",
        display: "block",
        textDecoration: "none",
        transition: `transform ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}`,
        "&:hover": { transform: "translateY(-4px)", boxShadow: shadows.cardHover },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: colors.primary, mb: 1 }}>
        <PlaceRoundedIcon sx={{ fontSize: 18 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "text.primary" }}>{city.city}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {city.vendors.toLocaleString("en-PK")} vendors
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {city.events.toLocaleString("en-PK")} events delivered
      </Typography>
    </Card>
  );
}
