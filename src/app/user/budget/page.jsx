"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import { alpha } from "@mui/material/styles";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { getCategoryIcon } from "@/config/categoryIcons";
import { VERTICALS } from "@/config/categoryTree";
import { startingPrice, priceLabel, capacityLabel } from "@/utils/listing";
import { pkr } from "@/utils/booking";

/* Suggested share of the total per category. Renormalised over whatever
   categories actually have published listings. */
const SUGGESTED = {
  venues: 40, catering: 30, decoration: 12, "photography-video": 8,
  bride: 4, "music-entertainment": 3, "beauty-makeup": 2, jewellery: 1,
};

export default function BudgetPlannerPage() {
  const router = useRouter();
  const allListings = useSelector((s) => s.listings.items);
  const storeCategories = useSelector((s) => s.categories.items);

  const [total, setTotal] = useState(1500000);
  const [guests, setGuests] = useState(300);
  const [alloc, setAlloc] = useState({});

  const published = useMemo(() => allListings.filter((l) => l.status === "Published"), [allListings]);

  /* Only categories that actually have something to show. */
  const categories = useMemo(() => {
    const ids = new Set(published.map((l) => l.categoryId));
    return storeCategories.filter((c) => ids.has(c.id));
  }, [published, storeCategories]);

  const byCat = useMemo(() => {
    const m = {};
    published.forEach((l) => { (m[l.categoryId] = m[l.categoryId] || []).push(l); });
    return m;
  }, [published]);

  const allocated = Object.values(alloc).reduce((a, b) => a + (Number(b) || 0), 0);
  const remaining = total - allocated;
  const pct = total > 0 ? Math.min(100, (allocated / total) * 100) : 0;

  const suggestSplit = () => {
    const present = categories.filter((c) => SUGGESTED[c.id]);
    const weightSum = present.reduce((a, c) => a + SUGGESTED[c.id], 0) || 1;
    const next = {};
    present.forEach((c) => { next[c.id] = Math.round((SUGGESTED[c.id] / weightSum) * total / 1000) * 1000; });
    setAlloc(next);
  };
  const clearSplit = () => setAlloc({});
  const setCat = (id, v) => setAlloc((s) => ({ ...s, [id]: v === "" ? "" : Number(v) }));

  const activeCats = categories.filter((c) => Number(alloc[c.id]) > 0);

  /* What a listing actually costs for THIS wedding: catering scales by
     headcount, halls are a flat per-event rate. */
  const costFor = (listing) => {
    if (listing.vertical === VERTICALS.CATERING) return (listing.catering?.perHeadFrom || 0) * (Number(guests) || 0);
    return startingPrice(listing);
  };

  const matchesFor = (categoryId) => {
    const budget = Number(alloc[categoryId]) || 0;
    return (byCat[categoryId] || [])
      .map((l) => ({ listing: l, cost: costFor(l) }))
      .filter((x) => x.cost > 0 && x.cost <= budget)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 3);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={800}>Budget planner</Typography>
        <Typography color="text.secondary">Split your budget, then see what actually fits it.</Typography>
      </Box>

      {/* Totals */}
      <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <TextField
            label="Total wedding budget" size="small" type="number" value={total}
            onChange={(e) => setTotal(Number(e.target.value) || 0)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }}
          />
          <TextField
            label="Expected guests" size="small" type="number" value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 0)}
            helperText="Catering is priced per head, so this changes what fits"
          />
        </Box>

        <Stack direction="row" spacing={3} sx={{ mt: 3, flexWrap: "wrap", gap: 2 }}>
          <Box><Typography variant="caption" color="text.secondary">Allocated</Typography>
            <Typography variant="h6" fontWeight={800}>{pkr(allocated)}</Typography></Box>
          <Box><Typography variant="caption" color="text.secondary">Left to allocate</Typography>
            <Typography variant="h6" fontWeight={800} color={remaining < 0 ? "error.main" : "success.main"}>{pkr(remaining)}</Typography></Box>
        </Stack>
        <LinearProgress variant="determinate" value={pct} sx={{ mt: 1.5, height: 8, borderRadius: 5 }} />
        {remaining < 0 && <Alert severity="warning" sx={{ mt: 2 }}>You&apos;re {pkr(Math.abs(remaining))} over budget.</Alert>}

        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
          <Button variant="contained" startIcon={<AutoAwesomeRoundedIcon />} onClick={suggestSplit}>Suggest a split</Button>
          <Button color="inherit" onClick={clearSplit}>Clear</Button>
        </Stack>
      </Card>

      {/* Allocation */}
      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Where does it go?</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {categories.map((c) => {
            const Icon = getCategoryIcon(c.iconKey);
            const n = (byCat[c.id] || []).length;
            return (
              <Stack key={c.id} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar variant="rounded" sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: alpha(c.color, 0.14), color: c.color }}>
                  <Icon fontSize="small" />
                </Avatar>
                <TextField
                  label={c.name} size="small" type="number" fullWidth
                  value={alloc[c.id] ?? ""} onChange={(e) => setCat(c.id, e.target.value)}
                  helperText={`${n} listing${n === 1 ? "" : "s"} available`}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }}
                />
              </Stack>
            );
          })}
        </Box>
        {categories.length === 0 && <Typography color="text.secondary">No published listings to plan against yet.</Typography>}
      </Card>

      {/* Matches */}
      {activeCats.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary">
            Allocate a budget above (or hit &ldquo;Suggest a split&rdquo;) to see what fits.
          </Typography>
        </Card>
      ) : (
        <Stack spacing={3}>
          {activeCats.map((c) => {
            const matches = matchesFor(c.id);
            const budget = Number(alloc[c.id]) || 0;
            return (
              <Card key={c.id} sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>{c.name}</Typography>
                  <Chip size="small" label={`${pkr(budget)} budget`} sx={{ fontWeight: 700, bgcolor: alpha(c.color, 0.12), color: c.color }} />
                </Stack>

                {matches.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nothing in {c.name} fits {pkr(budget)}
                    {(byCat[c.id] || []).some((l) => l.vertical === VERTICALS.CATERING) ? ` for ${guests} guests` : ""}. Try raising it.
                  </Typography>
                ) : (
                  <Stack spacing={1.25}>
                    {matches.map(({ listing, cost }) => {
                      const price = priceLabel(listing);
                      const cap = capacityLabel(listing);
                      return (
                        <Stack key={listing.id} direction={{ xs: "column", sm: "row" }} spacing={1.5}
                          onClick={() => router.push(`/user/listing/${listing.id}`)}
                          sx={{ alignItems: { sm: "center" }, p: 1.75, borderRadius: 2, border: "1px solid", borderColor: "divider", cursor: "pointer", "&:hover": { boxShadow: 2 } }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" fontWeight={800}>{listing.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {listing.city}{cap ? ` · ${cap}` : ""} · {price.value}{price.unit}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: { sm: "right" } }}>
                            <Typography variant="subtitle2" fontWeight={800} color="primary.main">{pkr(cost)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {listing.vertical === VERTICALS.CATERING ? `for ${guests} guests` : "per event"}
                            </Typography>
                          </Box>
                          <ArrowForwardRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                        </Stack>
                      );
                    })}
                  </Stack>
                )}
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
