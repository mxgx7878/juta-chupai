"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
import { startingPrice } from "@/utils/listing";
import { pkr } from "@/utils/booking";

const TYPES = [
  { id: "all", label: "Everything" },
  { id: VERTICALS.HALL, label: "Venues & halls" },
  { id: VERTICALS.CATERING, label: "Catering" },
];
const SORTS = [
  { id: "featured", label: "Featured first" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "capacity", label: "Largest capacity" },
];

function BrowseInner({ publicView = false }) {
  const params = useSearchParams();
  const allListings = useSelector((s) => s.listings.items);

  const [type, setType] = useState(params.get("type") || "all");
  const [city, setCity] = useState(params.get("city") || "all");
  const [q, setQ] = useState("");
  const [guests, setGuests] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState("featured");

  const published = useMemo(() => allListings.filter((l) => l.status === "Published"), [allListings]);

  const priceCeiling = useMemo(() => {
    const top = Math.max(0, ...published.filter((l) => l.vertical === VERTICALS.HALL).map(startingPrice));
    return Math.ceil(top / 50000) * 50000 || 500000;
  }, [published]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const g = Number(guests) || 0;

    let out = published.filter((l) => {
      if (type !== "all" && l.vertical !== type) return false;
      if (city !== "all" && l.city !== city) return false;
      if (term && !`${l.title} ${l.description} ${l.city}`.toLowerCase().includes(term)) return false;
      if (g) {
        const cap = l.vertical === VERTICALS.CATERING ? l.catering?.maxGuests : l.hall?.capacity;
        const min = l.vertical === VERTICALS.CATERING ? l.catering?.minGuests : l.hall?.minGuests;
        if (cap && g > cap) return false;
        if (min && g < min) return false;
      }
      /* the price filter only makes sense against per-event hall rates */
      if (maxPrice > 0 && l.vertical === VERTICALS.HALL && startingPrice(l) > maxPrice) return false;
      return true;
    });

    out = [...out].sort((a, b) => {
      if (sort === "price-asc") return startingPrice(a) - startingPrice(b);
      if (sort === "price-desc") return startingPrice(b) - startingPrice(a);
      if (sort === "capacity") {
        const cap = (l) => (l.vertical === VERTICALS.CATERING ? l.catering?.maxGuests : l.hall?.capacity) || 0;
        return cap(b) - cap(a);
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
    return out;
  }, [published, type, city, q, guests, maxPrice, sort]);

  const reset = () => { setType("all"); setCity("all"); setQ(""); setGuests(""); setMaxPrice(0); setSort("featured"); };
  const filtersOn = type !== "all" || city !== "all" || q || guests || maxPrice > 0;

  return (
    <Box sx={publicView ? { maxWidth: 1440, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 5, md: 7 } } : undefined}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>Browse</Typography>
        <Typography color="text.secondary">Wedding venues and catering, ready to enquire.</Typography>
      </Stack>

      <Card sx={{ p: { xs: 2, md: 2.5 }, mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
          {TYPES.map((t) => (
            <Chip key={t.id} label={t.label} onClick={() => setType(t.id)}
              variant={type === t.id ? "filled" : "outlined"} color={type === t.id ? "primary" : "default"}
              sx={{ fontWeight: 700 }} />
          ))}
        </Stack>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "2fr 1fr 1fr 1fr" }, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search by name or city…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
          <TextField label="City" size="small" select value={city} onChange={(e) => setCity(e.target.value)}>
            <MenuItem value="all">All cities</MenuItem>
            {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Guests" size="small" type="number" placeholder="e.g. 350" value={guests} onChange={(e) => setGuests(e.target.value)} />
          <TextField label="Sort by" size="small" select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}
          </TextField>
        </Box>

        {type !== VERTICALS.CATERING && (
          <Box sx={{ mt: 2.5, px: 1 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography variant="caption" color="text.secondary">Max venue price per event</Typography>
              <Typography variant="caption" fontWeight={700}>{maxPrice > 0 ? pkr(maxPrice) : "Any"}</Typography>
            </Stack>
            <Slider value={maxPrice} onChange={(_, v) => setMaxPrice(v)} min={0} max={priceCeiling} step={25000} />
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
        {rows.map((l) => <ListingCard key={l.id} listing={l} hrefBase={publicView ? "/listings" : "/user/listing"} />)}
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

export default function MarketplaceBrowse({ publicView = false }) {
  return (
    <Suspense fallback={null}>
      <BrowseInner publicView={publicView} />
    </Suspense>
  );
}
