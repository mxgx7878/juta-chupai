"use client";

import { Suspense, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ListingCard from "@/components/user/ListingCard";
import { CITY_OPTIONS } from "@/config/cities";
import { VERTICALS } from "@/config/categoryTree";
import { pkr } from "@/utils/booking";
import {
  EMPTY_FILTERS, LISTING_SORTS, LISTING_TYPES,
  activeFilterCount, onlyPublished, priceCeiling, queryListings,
} from "@/utils/listingFilters";

/* Signed-in browse. Search/filter/sort behaviour is shared with the public
   explorer through utils/listingFilters so the two can never drift apart. */
function BrowseInner() {
  const params = useSearchParams();
  const listings = useSelector((s) => s.listings.items);

  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
    type: params.get("type") || "all",
    city: params.get("city") || "all",
  });

  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const reset = () => setFilters(EMPTY_FILTERS);

  const published = useMemo(() => onlyPublished(listings), [listings]);
  const ceiling = useMemo(() => priceCeiling(published), [published]);
  const rows = useMemo(() => queryListings(listings, filters), [listings, filters]);
  const filtersOn = activeFilterCount(filters) > 0;

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>Browse</Typography>
        <Typography color="text.secondary">Wedding venues and catering, ready to enquire.</Typography>
      </Stack>

      <Card sx={{ p: { xs: 2, md: 2.5 }, mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
          {LISTING_TYPES.map((t) => (
            <Chip key={t.id} label={t.label} onClick={() => set("type", t.id)}
              variant={filters.type === t.id ? "filled" : "outlined"} color={filters.type === t.id ? "primary" : "default"}
              sx={{ fontWeight: 700 }} />
          ))}
        </Stack>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "2fr 1fr 1fr 1fr" }, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search by name or city…" value={filters.q} onChange={(e) => set("q", e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
          <TextField label="City" size="small" select value={filters.city} onChange={(e) => set("city", e.target.value)}>
            <MenuItem value="all">All cities</MenuItem>
            {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Guests" size="small" type="number" placeholder="e.g. 350" value={filters.guests} onChange={(e) => set("guests", e.target.value)} />
          <TextField label="Sort by" size="small" select value={filters.sort} onChange={(e) => set("sort", e.target.value)}>
            {LISTING_SORTS.map((s) => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}
          </TextField>
        </Box>

        {filters.type !== VERTICALS.CATERING && (
          <Box sx={{ mt: 2.5, px: 1 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography variant="caption" color="text.secondary">Max venue price per event</Typography>
              <Typography variant="caption" fontWeight={700}>{filters.maxPrice > 0 ? pkr(filters.maxPrice) : "Any"}</Typography>
            </Stack>
            <Slider value={filters.maxPrice} onChange={(_, v) => set("maxPrice", v)} min={0} max={ceiling} step={25000} />
          </Box>
        )}

        {filtersOn && (
          <Stack direction="row" sx={{ justifyContent: "flex-end", mt: 1 }}>
            <Button size="small" color="inherit" onClick={reset}>Clear filters</Button>
          </Stack>
        )}
      </Card>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {rows.length} listing{rows.length === 1 ? "" : "s"}
      </Typography>

      <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" } }}>
        {rows.map((l) => <ListingCard key={l.id} listing={l} />)}
      </Box>

      {rows.length === 0 && (
        <Card sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Nothing matches those filters.</Typography>
          <Button variant="outlined" color="inherit" onClick={reset}>Clear filters</Button>
        </Card>
      )}
    </Box>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={null}>
      <BrowseInner />
    </Suspense>
  );
}
