"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { CITY_OPTIONS } from "@/config/cities";
import { LISTING_TYPES } from "@/utils/listingFilters";
import { colors, motion, shadows } from "@/theme/tokens";

/** Hero search bar. Click one, choose a city, search — lands on /listings filtered. */
export default function HeroSearch() {
  const router = useRouter();
  const [type, setType] = useState("all");
  const [city, setCity] = useState("all");
  const [guests, setGuests] = useState("");

  const search = () => {
    const query = new URLSearchParams();
    if (type !== "all") query.set("type", type);
    if (city !== "all") query.set("city", city);
    if (guests) query.set("guests", guests);
    const qs = query.toString();
    router.push(`/listings${qs ? `?${qs}` : ""}`);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: "var(--jc-radius-xl)",
        border: "1px solid",
        borderColor: colors.border,
        boxShadow: shadows.popover,
        maxWidth: 760,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        {LISTING_TYPES.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            onClick={() => setType(t.id)}
            variant={type === t.id ? "filled" : "outlined"}
            color={type === t.id ? "primary" : "default"}
            sx={{ fontWeight: 700, transition: `all ${motion.fast} ${motion.ease}` }}
          />
        ))}
      </Stack>

      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.3fr 1fr auto" } }}>
        <TextField label="City" size="small" select value={city} onChange={(e) => setCity(e.target.value)}>
          <MenuItem value="all">Any city</MenuItem>
          {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
        <TextField label="Guests" size="small" type="number" placeholder="e.g. 350" value={guests} onChange={(e) => setGuests(e.target.value)} />
        <Button
          size="large"
          variant="contained"
          startIcon={<SearchRoundedIcon />}
          onClick={search}
          sx={{ px: 3, whiteSpace: "nowrap" }}
        >
          Find availability
        </Button>
      </Box>
    </Paper>
  );
}
