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
import Rating from "@mui/material/Rating";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StatusChip from "@/components/ui/StatusChip";
import { TYPE_LABELS } from "@/config/categoryTree";
import { priceLabel, typeChips } from "@/utils/listing";
import { formatDate } from "@/utils/inquiry";

const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

function Metric({ icon: Icon, label, value, color }) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Avatar variant="rounded" sx={{ bgcolor: `${color}.light`, color: `${color}.main`, borderRadius: 2 }}><Icon /></Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export default function VendorDashboardPage() {
  const router = useRouter();
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === vendorId));
  const myListings = useSelector((s) => s.listings.items.filter((l) => l.vendorId === vendorId));
  const myInquiries = useSelector((s) => s.inquiries.items.filter((q) => q.vendorId === vendorId));
  const listingById = useMemo(() => Object.fromEntries(myListings.map((l) => [l.id, l])), [myListings]);

  const published = myListings.filter((l) => l.status === "Published").length;
  const newInq = myInquiries.filter((q) => q.status === "New").length;
  const confirmed = myInquiries.filter((q) => q.status === "Confirmed").length;
  const recent = [...myInquiries].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5);

  if (!vendor) return null;

  return (
    <Stack spacing={3}>
      {/* Welcome */}
      <Card sx={{ p: { xs: 3, md: 4 }, color: "#fff", border: "none", background: "linear-gradient(120deg,#0e7490 0%,#2f6fed 60%,#4f46e5 100%)" }}>
        <Typography variant="overline" sx={{ opacity: 0.85 }}>Vendor dashboard</Typography>
        <Typography variant="h4" fontWeight={800}>Welcome back, {vendor.owner?.split(" ")[0] || vendor.name}</Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          {vendor.name} · {vendor.city} — {published} live listing{published === 1 ? "" : "s"} and {newInq} new inquir{newInq === 1 ? "y" : "ies"} to review.
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
          <Button variant="contained" startIcon={<Inventory2RoundedIcon />} onClick={() => router.push("/vendor/listings")} sx={{ bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#eef" } }}>Manage listings</Button>
          <Button variant="outlined" endIcon={<ArrowForwardRoundedIcon />} onClick={() => router.push("/vendor/inquiries")} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>View inquiries</Button>
        </Stack>
      </Card>

      {/* Metrics */}
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" } }}>
        <Metric icon={Inventory2RoundedIcon} label="Published listings" value={`${published}/${myListings.length}`} color="primary" />
        <Metric icon={QuestionAnswerRoundedIcon} label="New inquiries" value={newInq} color="secondary" />
        <Metric icon={EventAvailableRoundedIcon} label="Confirmed" value={confirmed} color="success" />
        <Card sx={{ p: 2.5 }}>
          <Typography variant="caption" color="text.secondary">Rating</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.5 }}>
            <Typography variant="h5" fontWeight={800}>{vendor.rating || "—"}</Typography>
            <Rating value={vendor.rating || 0} precision={0.1} readOnly size="small" />
          </Stack>
          <Typography variant="caption" color="text.secondary">{vendor.reviews ?? 0} reviews</Typography>
        </Card>
      </Box>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
        {/* Recent inquiries */}
        <Card sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography variant="h6" fontWeight={700}>Recent inquiries</Typography>
            <Button size="small" color="inherit" onClick={() => router.push("/vendor/inquiries")}>View all</Button>
          </Stack>
          <Stack spacing={1.25}>
            {recent.map((q) => (
              <Stack key={q.id} direction="row" spacing={1.5} sx={{ alignItems: "center", p: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>{q.customerName}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                    {listingById[q.listingId]?.title || "Listing"} · {formatDate(q.createdAt)}
                  </Typography>
                </Box>
                <Chip label={TYPE_LABELS[q.type] || q.type} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[q.type]?.bg, color: TYPE_COLORS[q.type]?.fg }} />
                <StatusChip status={q.status} />
              </Stack>
            ))}
            {recent.length === 0 && <Typography variant="body2" color="text.secondary">No inquiries yet.</Typography>}
          </Stack>
        </Card>

        {/* My listings */}
        <Card sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography variant="h6" fontWeight={700}>My listings</Typography>
            <Button size="small" color="inherit" onClick={() => router.push("/vendor/listings")}>Manage</Button>
          </Stack>
          <Stack spacing={1.25}>
            {myListings.slice(0, 5).map((l) => (
              <Stack key={l.id} direction="row" spacing={1.5} sx={{ alignItems: "center", p: 1, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>{l.title}</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
                    {typeChips(l).map((c) => (
                      <Chip key={c.type} label={c.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type]?.bg, color: TYPE_COLORS[c.type]?.fg }} />
                    ))}
                  </Stack>
                </Box>
                <Typography variant="body2" fontWeight={800} sx={{ color: "primary.main", whiteSpace: "nowrap" }}>{priceLabel(l)}</Typography>
                <StatusChip status={l.status} />
              </Stack>
            ))}
            {myListings.length === 0 && <Typography variant="body2" color="text.secondary">No listings yet.</Typography>}
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
}