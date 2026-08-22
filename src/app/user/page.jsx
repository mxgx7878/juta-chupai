"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { CATEGORY_TREE, getCategory } from "@/config/categoryTree";
import { getCategoryIcon } from "@/config/categoryIcons";
import { priceLabel, typeChips } from "@/utils/listing";

const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function UserHomePage() {
  const router = useRouter();
  const email = useSelector((s) => s.session.customerEmail);
  const customers = useSelector((s) => s.customers.items);
  const me = customers.find((c) => c.email === email);
  const listings = useSelector((s) => s.listings.items.filter((l) => l.status === "Published"));

  const featured = useMemo(() => {
    const f = listings.filter((l) => l.featured);
    return (f.length ? f : listings).slice(0, 6);
  }, [listings]);

  const topCategories = useMemo(() => {
    const counts = {};
    listings.forEach((l) => { counts[l.categoryId] = (counts[l.categoryId] || 0) + 1; });
    return CATEGORY_TREE.filter((c) => counts[c.id]).slice(0, 8);
  }, [listings]);

  return (
    <Stack spacing={4}>
      {/* Hero */}
      <Card sx={{ p: { xs: 3, md: 5 }, color: "#fff", border: "none", background: "linear-gradient(120deg,#4f46e5 0%,#7c3aed 55%,#ec4899 100%)" }}>
        <Typography variant="overline" sx={{ opacity: 0.85 }}>Welcome{me ? `, ${me.name.split(" ")[0]}` : ""}</Typography>
        <Typography variant="h3" fontWeight={800} sx={{ maxWidth: 620 }}>Everything for your big day, in one place</Typography>
        <Typography variant="body1" sx={{ mt: 1.5, opacity: 0.9, maxWidth: 560 }}>
          Browse venues, décor, catering, bridal wear and more — rent, buy or book services. Set a budget and we'll show you what fits.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
          <Button size="large" variant="contained" startIcon={<ExploreRoundedIcon />} onClick={() => router.push("/user/browse")} sx={{ bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#f1f1f8" } }}>Browse listings</Button>
          <Button size="large" variant="outlined" startIcon={<CalculateRoundedIcon />} onClick={() => router.push("/user/budget")} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>Plan by budget</Button>
        </Stack>
      </Card>

      {/* Categories */}
      <Box>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Shop by category</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" } }}>
          {topCategories.map((c) => {
            const Icon = getCategoryIcon(c.iconKey);
            return (
              <Card key={c.id} sx={{ p: 2.5, cursor: "pointer", textAlign: "center", transition: "0.15s", "&:hover": { boxShadow: 4, transform: "translateY(-2px)" } }} onClick={() => router.push(`/user/browse?cat=${c.id}`)}>
                <Avatar variant="rounded" sx={{ width: 46, height: 46, borderRadius: 2, mx: "auto", mb: 1, bgcolor: alpha(c.color, 0.14), color: c.color }}>
                  {c.emoji ? <Box sx={{ fontSize: 22 }}>{c.emoji}</Box> : <Icon />}
                </Avatar>
                <Typography variant="subtitle2" fontWeight={700}>{c.name}</Typography>
              </Card>
            );
          })}
        </Box>
      </Box>

      {/* Featured */}
      <Box>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>Featured listings</Typography>
          <Button endIcon={<ArrowForwardRoundedIcon />} onClick={() => router.push("/user/browse")}>See all</Button>
        </Stack>
        <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" } }}>
          {featured.map((l) => {
            const cat = getCategory(l.categoryId);
            return (
              <Card key={l.id} sx={{ overflow: "hidden", cursor: "pointer", transition: "0.15s", "&:hover": { boxShadow: 4 } }} onClick={() => router.push(`/user/listing/${l.id}`)}>
                <Box sx={{ height: 140, background: `linear-gradient(135deg, ${alpha(cat?.color || "#4f46e5", 0.85)}, ${cat?.color || "#7c3aed"})`, display: "flex", alignItems: "flex-end", p: 1.5 }}>
                  {l.featured && <Chip label="Featured" size="small" sx={{ bgcolor: "rgba(255,255,255,0.9)", fontWeight: 700 }} />}
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>{l.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{cat?.name} · {l.city}</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
                    {typeChips(l).map((c) => (
                      <Chip key={c.type} label={c.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type]?.bg, color: TYPE_COLORS[c.type]?.fg }} />
                    ))}
                  </Stack>
                  <Typography variant="subtitle1" fontWeight={800} color="primary.main" sx={{ mt: 1 }}>{priceLabel(l)}</Typography>
                </Box>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Stack>
  );
}