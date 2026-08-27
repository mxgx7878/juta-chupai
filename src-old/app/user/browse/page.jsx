"use client";

import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import InputBase from "@mui/material/InputBase";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { CATEGORY_TREE, getCategory, TYPE_LABELS } from "@/config/categoryTree";
import { CITY_OPTIONS } from "@/config/vendorCategories";
import { priceLabel, typeChips, startingPrice } from "@/utils/listing";

const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function BrowsePage() {
  const router = useRouter();
  const listings = useSelector((s) => s.listings.items.filter((l) => l.status === "Published"));
  const vendors = useSelector((s) => s.vendors.items);
  const vendorName = useMemo(() => Object.fromEntries(vendors.map((v) => [v.id, v.name])), [vendors]);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [type, setType] = useState("all");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("cat");
    if (c) setCat(c);
  }, []);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    let out = listings.filter((l) => {
      const okCat = cat === "all" || l.categoryId === cat;
      const okType = type === "all" || (l.types || []).includes(type);
      const okCity = city === "all" || l.city === city;
      const okQ = !t || l.title.toLowerCase().includes(t) || (vendorName[l.vendorId] || "").toLowerCase().includes(t);
      return okCat && okType && okCity && okQ;
    });
    if (sort === "price-asc") out = [...out].sort((a, b) => (startingPrice(a) ?? Infinity) - (startingPrice(b) ?? Infinity));
    else if (sort === "price-desc") out = [...out].sort((a, b) => (startingPrice(b) ?? -Infinity) - (startingPrice(a) ?? -Infinity));
    else out = [...out].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return out;
  }, [listings, q, cat, type, city, sort, vendorName]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={800}>Browse listings</Typography>
        <Typography color="text.secondary">{rows.length} listing{rows.length === 1 ? "" : "s"} available</Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, flex: 1, minWidth: 200, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search listings or vendors…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
          <Select size="small" value={cat} onChange={(e) => setCat(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="all">All categories</MenuItem>
            {CATEGORY_TREE.map((c) => <MenuItem key={c.id} value={c.id}>{c.emoji} {c.name}</MenuItem>)}
          </Select>
          <Select size="small" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 130 }}>
            <MenuItem value="all">All types</MenuItem>
            <MenuItem value="rent">{TYPE_LABELS.rent}</MenuItem>
            <MenuItem value="purchase">{TYPE_LABELS.purchase}</MenuItem>
            <MenuItem value="service">{TYPE_LABELS.service}</MenuItem>
          </Select>
          <Select size="small" value={city} onChange={(e) => setCity(e.target.value)} sx={{ minWidth: 130 }}>
            <MenuItem value="all">All cities</MenuItem>
            {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
          <Select size="small" value={sort} onChange={(e) => setSort(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="featured">Featured first</MenuItem>
            <MenuItem value="price-asc">Price: low to high</MenuItem>
            <MenuItem value="price-desc">Price: high to low</MenuItem>
          </Select>
        </Stack>
      </Card>

      {/* Grid */}
      {rows.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary">No listings match your filters.</Typography>
        </Card>
      ) : (
        <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" } }}>
          {rows.map((l) => {
            const c = getCategory(l.categoryId);
            return (
              <Card key={l.id} sx={{ overflow: "hidden", cursor: "pointer", transition: "0.15s", "&:hover": { boxShadow: 4, transform: "translateY(-2px)" } }} onClick={() => router.push(`/user/listing/${l.id}`)}>
                <Box sx={{ height: 140, background: `linear-gradient(135deg, ${alpha(c?.color || "#4f46e5", 0.85)}, ${c?.color || "#7c3aed"})`, display: "flex", alignItems: "flex-end", justifyContent: "space-between", p: 1.5 }}>
                  {l.featured ? <Chip label="Featured" size="small" sx={{ bgcolor: "rgba(255,255,255,0.9)", fontWeight: 700 }} /> : <span />}
                  <Chip label={c?.emoji} size="small" sx={{ bgcolor: "rgba(255,255,255,0.85)" }} />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>{l.title}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                    {vendorName[l.vendorId]} · {l.city}
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
                    {typeChips(l).map((tc) => (
                      <Chip key={tc.type} label={tc.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[tc.type]?.bg, color: TYPE_COLORS[tc.type]?.fg }} />
                    ))}
                  </Stack>
                  <Typography variant="subtitle1" fontWeight={800} color="primary.main" sx={{ mt: 1 }}>{priceLabel(l)}</Typography>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </Stack>
  );
}