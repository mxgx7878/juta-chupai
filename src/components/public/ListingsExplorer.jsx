"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CardGrid from "./CardGrid";
import PublicListingCard from "./PublicListingCard";
import Reveal from "./Reveal";
import { CITY_OPTIONS } from "@/config/cities";
import { pkr } from "@/utils/booking";
import {
  EMPTY_FILTERS, LISTING_SORTS, LISTING_TYPES,
  activeFilterCount, onlyPublished, priceCeiling, queryListings,
} from "@/utils/listingFilters";
import { colors, motion } from "@/theme/tokens";

/* The public browse experience. Filters are local state seeded from the URL, so
   links like /listings?type=catering&city=Lahore (used by the footer, the home
   page hero and city tiles) land on a pre-filtered grid. */
function Explorer() {
  const params = useSearchParams();
  const listings = useSelector((s) => s.listings.items);

  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    type: params.get("type") || "all",
    city: params.get("city") || "all",
    q: params.get("q") || "",
    guests: params.get("guests") || "",
  });

  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const reset = () => setFilters(EMPTY_FILTERS);

  const published = useMemo(() => onlyPublished(listings), [listings]);
  const ceiling = useMemo(() => priceCeiling(published), [published]);
  const rows = useMemo(() => queryListings(listings, filters), [listings, filters]);
  const activeCount = activeFilterCount(filters);

  return (
    <Box>
      {/* ------------------------------------------------------- filters -- */}
      <Reveal>
        <Card sx={{ p: { xs: 2, md: 2.5 }, mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
            {LISTING_TYPES.map((t) => (
              <Chip
                key={t.id}
                label={t.label}
                onClick={() => set("type", t.id)}
                variant={filters.type === t.id ? "filled" : "outlined"}
                color={filters.type === t.id ? "primary" : "default"}
                sx={{ fontWeight: 700, transition: `all ${motion.fast} ${motion.ease}` }}
              />
            ))}
            <Box sx={{ flex: 1 }} />
            <Badge badgeContent={activeCount} color="primary" sx={{ alignSelf: "center" }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary", pr: 1 }}>
                <TuneRoundedIcon fontSize="small" />
                <Typography variant="caption" fontWeight={700}>Filters</Typography>
              </Stack>
            </Badge>
          </Stack>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "2fr 1fr 1fr 1fr" } }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", px: 1.5, height: 40, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: colors.surfaceSubtle }}
            >
              <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <InputBase
                placeholder="Search halls, marquees, caterers…"
                value={filters.q}
                onChange={(e) => set("q", e.target.value)}
                sx={{ fontSize: 14, flex: 1 }}
                inputProps={{ "aria-label": "Search listings" }}
              />
            </Stack>

            <TextField label="City" size="small" select value={filters.city} onChange={(e) => set("city", e.target.value)}>
              <MenuItem value="all">All cities</MenuItem>
              {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>

            <TextField label="Guests" size="small" type="number" placeholder="e.g. 350" value={filters.guests} onChange={(e) => set("guests", e.target.value)} />

            <TextField label="Sort by" size="small" select value={filters.sort} onChange={(e) => set("sort", e.target.value)}>
              {LISTING_SORTS.map((s) => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}
            </TextField>
          </Box>

          {filters.type !== "catering" && (
            <Box sx={{ mt: 2.5, px: 1 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">Maximum venue price per event</Typography>
                <Typography variant="caption" fontWeight={700}>{filters.maxPrice > 0 ? pkr(filters.maxPrice) : "Any budget"}</Typography>
              </Stack>
              <Slider
                value={filters.maxPrice}
                onChange={(_, v) => set("maxPrice", v)}
                min={0}
                max={ceiling}
                step={25000}
                aria-label="Maximum price per event"
              />
            </Box>
          )}

          {activeCount > 0 && (
            <Stack direction="row" sx={{ justifyContent: "flex-end", mt: 1 }}>
              <Button size="small" color="inherit" startIcon={<RestartAltRoundedIcon />} onClick={reset}>Clear filters</Button>
            </Stack>
          )}
        </Card>
      </Reveal>

      {/* ------------------------------------------------------- results -- */}
      <Stack direction="row" sx={{ alignItems: "baseline", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <Box component="span" sx={{ fontWeight: 800, color: "text.primary" }}>{rows.length}</Box>
          {` listing${rows.length === 1 ? "" : "s"} available`}
        </Typography>
        {filters.city !== "all" && (
          <Typography variant="body2" color="text.secondary">in {filters.city}</Typography>
        )}
      </Stack>

      <CardGrid min={300}>
        {rows.map((listing, i) => (
          <Reveal key={listing.id} delay={Math.min(i, 8) * 60} sx={{ height: "100%" }}>
            <PublicListingCard listing={listing} />
          </Reveal>
        ))}
      </CardGrid>

      {rows.length === 0 && (
        <Card sx={{ p: { xs: 4, md: 7 }, textAlign: "center" }}>
          <Typography variant="h6">No listings match those filters</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Try widening the guest count or clearing the budget cap.
          </Typography>
          <Button variant="contained" startIcon={<RestartAltRoundedIcon />} onClick={reset}>Clear filters</Button>
        </Card>
      )}
    </Box>
  );
}

/* useSearchParams needs a Suspense boundary so the page can still be
   statically prerendered. */
export default function ListingsExplorer() {
  return (
    <Suspense fallback={<Skeleton variant="rounded" height={420} />}>
      <Explorer />
    </Suspense>
  );
}
