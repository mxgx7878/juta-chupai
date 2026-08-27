"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { CATEGORY_TREE, getCategory } from "@/config/categoryTree";
import { getCategoryIcon } from "@/config/categoryIcons";
import { startingPrice, priceLabel, typeChips } from "@/utils/listing";

const fmt = (n) => `PKR ${Number(n || 0).toLocaleString("en-PK")}`;

// suggested share of the total per category (renormalised over what's available)
const SUGGESTED = {
  venues: 35, catering: 20, decoration: 12, "photography-video": 10,
  bride: 8, "music-entertainment": 5, "beauty-makeup": 5, jewellery: 5,
};

const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function BudgetPlannerPage() {
  const router = useRouter();
  const listings = useSelector((s) => s.listings.items.filter((l) => l.status === "Published"));

  const [total, setTotal] = useState(1500000);
  const [alloc, setAlloc] = useState({});

  // categories that actually have published listings
  const categories = useMemo(() => {
    const counts = {};
    listings.forEach((l) => { counts[l.categoryId] = (counts[l.categoryId] || 0) + 1; });
    return CATEGORY_TREE.filter((c) => counts[c.id]);
  }, [listings]);

  const listingsByCat = useMemo(() => {
    const m = {};
    listings.forEach((l) => { (m[l.categoryId] = m[l.categoryId] || []).push(l); });
    return m;
  }, [listings]);

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

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={800}>Budget planner</Typography>
        <Typography color="text.secondary">Set a budget, split it across categories, and see what fits.</Typography>
      </Box>

      {/* Budget + allocation */}
      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "flex-end" }, justifyContent: "space-between" }}>
          <TextField
            label="Total wedding budget"
            size="medium"
            type="number"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value) || 0)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }}
            sx={{ maxWidth: 280 }}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<AutoAwesomeRoundedIcon />} onClick={suggestSplit}>Suggest a split</Button>
            <Button color="inherit" onClick={clearSplit}>Clear</Button>
          </Stack>
        </Stack>

        <Box sx={{ mt: 2.5 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Allocated {fmt(allocated)}</Typography>
            <Typography variant="body2" fontWeight={700} color={remaining < 0 ? "error.main" : "text.secondary"}>
              {remaining < 0 ? `Over by ${fmt(-remaining)}` : `${fmt(remaining)} left`}
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 5, ...(remaining < 0 ? { "& .MuiLinearProgress-bar": { bgcolor: "error.main" } } : {}) }} />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Typography variant="overline" color="text.secondary">Allocate by category</Typography>
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, mt: 1 }}>
          {categories.map((c) => (
            <Stack key={c.id} direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ fontSize: 18 }}>{c.emoji}</Box>
              <TextField
                label={c.name}
                size="small"
                type="number"
                fullWidth
                value={alloc[c.id] ?? ""}
                onChange={(e) => setCat(c.id, e.target.value)}
                slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }}
              />
            </Stack>
          ))}
        </Box>
      </Card>

      {/* Results */}
      {activeCats.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary">Allocate a budget to a category (or use “Suggest a split”) to see listings that fit.</Typography>
        </Card>
      ) : (
        <Stack spacing={3}>
          {activeCats.map((c) => {
            const budget = Number(alloc[c.id]);
            const all = (listingsByCat[c.id] || []);
            const fits = all.filter((l) => { const p = startingPrice(l); return p != null && p <= budget; })
              .sort((a, b) => (startingPrice(a) ?? 0) - (startingPrice(b) ?? 0));
            const Icon = getCategoryIcon(c.iconKey);
            return (
              <Box key={c.id}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
                  <Avatar variant="rounded" sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(c.color, 0.14), color: c.color }}>
                    {c.emoji ? <Box sx={{ fontSize: 20 }}>{c.emoji}</Box> : <Icon fontSize="small" />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={800}>{c.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{fmt(budget)} budget · {fits.length} of {all.length} fit</Typography>
                  </Box>
                </Stack>
                {fits.length === 0 ? (
                  <Card sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
                    <Typography variant="body2" color="text.secondary">Nothing in {c.name} under {fmt(budget)}. Try allocating more.</Typography>
                  </Card>
                ) : (
                  <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(4,1fr)" } }}>
                    {fits.slice(0, 4).map((l) => {
                      const cat = getCategory(l.categoryId);
                      return (
                        <Card key={l.id} sx={{ overflow: "hidden", cursor: "pointer", "&:hover": { boxShadow: 4 } }} onClick={() => router.push(`/user/listing/${l.id}`)}>
                          <Box sx={{ height: 84, background: `linear-gradient(135deg, ${alpha(cat?.color || "#4f46e5", 0.85)}, ${cat?.color || "#7c3aed"})` }} />
                          <Box sx={{ p: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap>{l.title}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>{l.city}</Typography>
                            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
                              {typeChips(l).slice(0, 2).map((tc) => (
                                <Chip key={tc.type} label={tc.label} size="small" sx={{ fontWeight: 700, height: 20, fontSize: 10, bgcolor: TYPE_COLORS[tc.type]?.bg, color: TYPE_COLORS[tc.type]?.fg }} />
                              ))}
                            </Stack>
                            <Typography variant="subtitle2" fontWeight={800} color="primary.main" sx={{ mt: 0.5 }}>{priceLabel(l)}</Typography>
                          </Box>
                        </Card>
                      );
                    })}
                  </Box>
                )}
                {fits.length > 4 && (
                  <Button size="small" sx={{ mt: 1 }} onClick={() => router.push(`/user/browse?cat=${c.id}`)}>See all {fits.length} in {c.name}</Button>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}