"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { alpha } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import ListingCard from "@/components/user/ListingCard";
import { getCategoryIcon } from "@/config/categoryIcons";
import { CITY_OPTIONS } from "@/config/cities";
import { VERTICALS } from "@/config/categoryTree";

const TYPE_OPTIONS = [
  { value: "all", label: "All services" },
  { value: VERTICALS.HALL, label: "Venues & halls" },
  { value: VERTICALS.CATERING, label: "Catering" },
];

const benefits = [
  { title: "Verified vendors", text: "Compare established wedding businesses and their services.", icon: VerifiedRoundedIcon },
  { title: "Clear availability", text: "Check venue dates and event slots before sending an inquiry.", icon: EventAvailableRoundedIcon },
  { title: "Direct inquiries", text: "Share your event details with the right vendor in one simple flow.", icon: ForumRoundedIcon },
];

export default function PublicHomePage() {
  const router = useRouter();
  const [type, setType] = useState("all");
  const [city, setCity] = useState("all");
  const listings = useSelector((state) => state.listings.items);
  const categories = useSelector((state) => state.categories.items);
  const vendors = useSelector((state) => state.vendors.items);

  const published = useMemo(() => listings.filter((item) => item.status === "Published"), [listings]);
  const featured = useMemo(
    () => [...published].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 6),
    [published],
  );
  const liveCategories = useMemo(() => {
    const ids = new Set(published.map((item) => item.categoryId));
    return categories.filter((item) => ids.has(item.id)).slice(0, 8);
  }, [categories, published]);

  const search = () => {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (city !== "all") params.set("city", city);
    router.push(`/listings${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <Stack spacing={{ xs: 7, md: 10 }}>
      <Box sx={{ position: "relative", overflow: "hidden", bgcolor: "#211f42", color: "#fff" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(236,72,153,0.35), transparent 34%), radial-gradient(circle at 60% 90%, rgba(14,165,164,0.28), transparent 30%)" }} />
        <Box sx={{ position: "relative", maxWidth: 1440, minHeight: { xs: 620, md: 690 }, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 7, md: 10 }, display: "grid", gap: 5, gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" }, alignItems: "center" }}>
          <Box>
            <Chip label="Pakistan’s wedding marketplace" sx={{ mb: 2.5, bgcolor: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.16)" }} />
            <Typography variant="h1" sx={{ fontSize: { xs: "2.65rem", sm: "3.7rem", md: "4.7rem" }, lineHeight: 0.98, maxWidth: 800 }}>
              Plan the celebration you&apos;ll always remember.
            </Typography>
            <Typography variant="h6" sx={{ mt: 3, maxWidth: 650, opacity: 0.75, fontWeight: 400, lineHeight: 1.6 }}>
              Discover venues, compare catering packages and connect with trusted wedding vendors—all in one place.
            </Typography>

            <Card sx={{ mt: 4, p: { xs: 2, sm: 2.5 }, maxWidth: 760, bgcolor: "rgba(255,255,255,0.98)" }}>
              <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto" } }}>
                <TextField select label="What do you need?" value={type} onChange={(event) => setType(event.target.value)} size="small">
                  {TYPE_OPTIONS.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
                </TextField>
                <TextField select label="Event city" value={city} onChange={(event) => setCity(event.target.value)} size="small">
                  <MenuItem value="all">All cities</MenuItem>
                  {CITY_OPTIONS.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                </TextField>
                <Button variant="contained" size="large" startIcon={<SearchRoundedIcon />} onClick={search} sx={{ px: 3 }}>Search</Button>
              </Box>
            </Card>

            <Stack direction="row" spacing={{ xs: 2.5, sm: 5 }} sx={{ mt: 4 }}>
              {[
                [`${published.length}+`, "Live listings"],
                [`${vendors.filter((item) => item.status === "Approved").length}+`, "Approved vendors"],
                [`${new Set(published.map((item) => item.city)).size}+`, "Cities"],
              ].map(([value, label]) => (
                <Box key={label}>
                  <Typography variant="h5" fontWeight={900}>{value}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.65 }}>{label}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ display: { xs: "none", lg: "grid" }, gridTemplateColumns: "1fr 1fr", gap: 2.5, transform: "rotate(2deg)" }}>
            <Card sx={{ p: 3, mt: 8, bgcolor: "rgba(255,255,255,0.96)" }}>
              <Avatar variant="rounded" sx={{ bgcolor: alpha("#4f46e5", 0.12), color: "primary.main", width: 54, height: 54 }}><AccountBalanceRoundedIcon /></Avatar>
              <Typography variant="h5" fontWeight={900} color="text.primary" sx={{ mt: 3 }}>Find the right venue</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>Compare capacity, setting, pricing and live availability.</Typography>
              <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 2 }} onClick={() => router.push("/listings?type=hall")}>Explore venues</Button>
            </Card>
            <Card sx={{ p: 3, mb: 8, bgcolor: "rgba(255,255,255,0.96)" }}>
              <Avatar variant="rounded" sx={{ bgcolor: alpha("#f59e0b", 0.15), color: "warning.main", width: 54, height: 54 }}><RestaurantRoundedIcon /></Avatar>
              <Typography variant="h5" fontWeight={900} color="text.primary" sx={{ mt: 3 }}>Build your menu</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>Browse catering packages, cuisines and per-head deals.</Typography>
              <Button endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 2 }} onClick={() => router.push("/listings?type=catering")}>Explore catering</Button>
            </Card>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1440, width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { sm: "flex-end" }, mb: 3 }}>
          <Box>
            <Typography variant="overline" color="primary.main">Browse by category</Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "2.7rem" } }}>Everything your event needs</Typography>
          </Box>
          <Button onClick={() => router.push("/listings")} endIcon={<ArrowForwardRoundedIcon />}>View all listings</Button>
        </Stack>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(3,1fr)", lg: "repeat(4,1fr)" } }}>
          {liveCategories.map((category) => {
            const Icon = getCategoryIcon(category.iconKey);
            const count = published.filter((item) => item.categoryId === category.id).length;
            return (
              <Card key={category.id} onClick={() => router.push("/listings")} sx={{ p: { xs: 2, md: 2.5 }, cursor: "pointer", transition: "0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: 5 } }}>
                <Avatar variant="rounded" sx={{ bgcolor: alpha(category.color, 0.12), color: category.color, width: 48, height: 48 }}><Icon /></Avatar>
                <Typography fontWeight={800} sx={{ mt: 2 }}>{category.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{count} listing{count === 1 ? "" : "s"}</Typography>
              </Card>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1440, width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between", alignItems: { sm: "flex-end" }, mb: 3 }}>
          <Box>
            <Typography variant="overline" color="primary.main">Handpicked for you</Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "2.7rem" } }}>Popular right now</Typography>
          </Box>
          <Button onClick={() => router.push("/listings")} endIcon={<ArrowForwardRoundedIcon />}>See all</Button>
        </Stack>
        <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" } }}>
          {featured.map((listing) => <ListingCard key={listing.id} listing={listing} hrefBase="/listings" />)}
        </Box>
      </Box>

      <Box sx={{ bgcolor: "#efeffb", py: { xs: 7, md: 10 } }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, textAlign: "center" }}>
          <Typography variant="overline" color="primary.main">Designed for easier planning</Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "2.7rem" } }}>From discovery to inquiry</Typography>
          <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, mt: 5, textAlign: "left" }}>
            {benefits.map((item) => (
              <Card key={item.title} sx={{ p: 3.5 }}>
                <Avatar variant="rounded" sx={{ bgcolor: alpha("#4f46e5", 0.1), color: "primary.main" }}><item.icon /></Avatar>
                <Typography variant="h6" fontWeight={800} sx={{ mt: 2.5 }}>{item.title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>{item.text}</Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, width: "calc(100% - 32px)", mx: "auto", p: { xs: 4, md: 7 }, borderRadius: 5, color: "#fff", textAlign: "center", background: "linear-gradient(120deg,#4f46e5,#7c3aed 62%,#ec4899)" }}>
        <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>Ready to start planning?</Typography>
        <Typography sx={{ mt: 1.5, opacity: 0.82 }}>Browse wedding services and send your first inquiry today.</Typography>
        <Button variant="contained" size="large" startIcon={<SearchRoundedIcon />} onClick={() => router.push("/listings")} sx={{ mt: 3, bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#f4f4fb" } }}>Browse all listings</Button>
      </Box>
    </Stack>
  );
}
