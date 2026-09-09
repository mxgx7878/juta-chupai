"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ListingCard from "@/components/user/ListingCard";
import { getCategoryIcon } from "@/config/categoryIcons";
import { VERTICALS } from "@/config/categoryTree";

export default function UserHomePage() {
  const router = useRouter();
  const email = useSelector((s) => s.session.customerEmail);
  const me = useSelector((s) => s.customers.items.find((c) => c.email === email));
  const allListings = useSelector((s) => s.listings.items);
  const storeCategories = useSelector((s) => s.categories.items);
  const myInquiries = useSelector((s) => s.inquiries.items.filter((q) => q.customerEmail === email));

  const published = useMemo(() => allListings.filter((l) => l.status === "Published"), [allListings]);
  const featured = useMemo(
    () => [...published].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 6),
    [published],
  );
  const liveCats = useMemo(() => {
    const ids = new Set(published.map((l) => l.categoryId));
    return storeCategories.filter((c) => ids.has(c.id));
  }, [published, storeCategories]);

  const countOf = (v) => published.filter((l) => l.vertical === v).length;

  return (
    <Stack spacing={4}>
      <Card sx={{ p: { xs: 3, md: 5 }, color: "#fff", border: "none", background: "linear-gradient(120deg,#4f46e5 0%,#7c3aed 55%,#ec4899 100%)" }}>
        <Typography variant="overline" sx={{ opacity: 0.85 }}>Welcome{me ? `, ${me.name.split(" ")[0]}` : ""}</Typography>
        <Typography variant="h3" fontWeight={800} sx={{ maxWidth: 620 }}>Everything for your big day, in one place</Typography>
        <Typography variant="body1" sx={{ mt: 1.5, opacity: 0.9, maxWidth: 560 }}>
          {countOf(VERTICALS.HALL)} venues and {countOf(VERTICALS.CATERING)} catering packages, ready to enquire.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
          <Button size="large" variant="contained" startIcon={<SearchRoundedIcon />} onClick={() => router.push("/user/browse")}
            sx={{ bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#f1f1f8" } }}>Browse listings</Button>
          <Button size="large" variant="outlined" startIcon={<CalculateRoundedIcon />} onClick={() => router.push("/user/budget")}
            sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>Plan by budget</Button>
        </Stack>
        {myInquiries.length > 0 && (
          <Chip
            onClick={() => router.push("/user/inquiries")}
            label={`${myInquiries.length} inquiry sent — view status`}
            sx={{ mt: 3, bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          />
        )}
      </Card>

      {/* Verticals */}
      <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        {[
          { v: VERTICALS.HALL, title: "Venues & halls", blurb: "Check live availability, day or night, then enquire.", color: "#4f46e5" },
          { v: VERTICALS.CATERING, title: "Catering", blurb: "Compare menus and per-head deals for your headcount.", color: "#f59e0b" },
        ].map((x) => (
          <Card key={x.v} onClick={() => router.push(`/user/browse?type=${x.v}`)}
            sx={{ p: 3, cursor: "pointer", transition: "0.15s", "&:hover": { boxShadow: 5 } }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" fontWeight={800}>{x.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{x.blurb}</Typography>
                <Chip size="small" label={`${countOf(x.v)} listings`} sx={{ mt: 1.5, fontWeight: 700, bgcolor: alpha(x.color, 0.12), color: x.color }} />
              </Box>
              <ArrowForwardRoundedIcon sx={{ color: x.color }} />
            </Stack>
          </Card>
        ))}
      </Box>

      {/* Categories */}
      <Box>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Shop by category</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" } }}>
          {liveCats.map((c) => {
            const Icon = getCategoryIcon(c.iconKey);
            const n = published.filter((l) => l.categoryId === c.id).length;
            return (
              <Card key={c.id} onClick={() => router.push("/user/browse")}
                sx={{ p: 2.5, textAlign: "center", cursor: "pointer", "&:hover": { boxShadow: 4 } }}>
                <Avatar variant="rounded" sx={{ width: 46, height: 46, borderRadius: 2, mx: "auto", mb: 1, bgcolor: alpha(c.color, 0.14), color: c.color }}>
                  <Icon />
                </Avatar>
                <Typography variant="subtitle2" fontWeight={700}>{c.name}</Typography>
                <Typography variant="caption" color="text.secondary">{n} listing{n === 1 ? "" : "s"}</Typography>
              </Card>
            );
          })}
        </Box>
      </Box>

      {/* Featured */}
      <Box>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight={800}>Popular right now</Typography>
          <Button size="small" color="inherit" endIcon={<ArrowForwardRoundedIcon />} onClick={() => router.push("/user/browse")}>See all</Button>
        </Stack>
        <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" } }}>
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </Box>
      </Box>
    </Stack>
  );
}
