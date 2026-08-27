"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { exportCsv } from "@/utils/exportCsv";

import MetricCard from "@/components/dashboard/MetricCard";
import SectionCard from "@/components/dashboard/SectionCard";
import CategoryPie from "@/components/dashboard/CategoryPie";
import VendorApprovals from "@/components/dashboard/VendorApprovals";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import RecentInquiries from "@/components/dashboard/RecentInquiries";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";

const PERIODS = ["This week", "This month", "This quarter", "This year"];

export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("This month");
  const [periodAnchor, setPeriodAnchor] = useState(null);

  const listings = useSelector((s) => s.listings.items);
  const inquiries = useSelector((s) => s.inquiries.items);
  const vendors = useSelector((s) => s.vendors.items);

  const metrics = useMemo(() => {
    const published = listings.filter((l) => l.status === "Published").length;
    const newInq = inquiries.filter((q) => q.status === "New").length;
    const activeVendors = vendors.filter((v) => v.status === "Approved").length;
    const pending = vendors.filter((v) => v.status === "Pending").length;
    return [
      { label: "Published listings", value: String(published), change: `${listings.length} total`, up: true, note: "live in discovery", icon: Inventory2RoundedIcon, color: "primary" },
      { label: "New inquiries", value: String(newInq), change: `${inquiries.length} total`, up: true, note: "awaiting response", icon: QuestionAnswerRoundedIcon, color: "secondary" },
      { label: "Active vendors", value: String(activeVendors), change: `+${activeVendors}`, up: true, note: "approved & listed", icon: StorefrontRoundedIcon, color: "success" },
      { label: "Pending approvals", value: String(pending), change: pending ? `${pending} to review` : "all clear", up: pending === 0, note: "needs review", icon: PendingActionsRoundedIcon, color: "warning" },
    ];
  }, [listings, inquiries, vendors]);

  const exportReport = () =>
    exportCsv(
      "marketplace-report.csv",
      metrics.map((m) => ({ Metric: m.label, Value: m.value, Change: m.change, Note: m.note })),
    );

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            Overview
          </Typography>
          <Typography variant="h4" fontWeight={800}>
            Marketplace at a glance
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="inherit" endIcon={<ArrowDropDownRoundedIcon />} onClick={(e) => setPeriodAnchor(e.currentTarget)}>
            {period}
          </Button>
          <Menu anchorEl={periodAnchor} open={Boolean(periodAnchor)} onClose={() => setPeriodAnchor(null)}>
            {PERIODS.map((p) => (
              <MenuItem key={p} selected={p === period} onClick={() => { setPeriod(p); setPeriodAnchor(null); }}>
                {p}
              </MenuItem>
            ))}
          </Menu>
          <Button variant="contained" startIcon={<FileDownloadRoundedIcon />} onClick={exportReport}>
            Export report
          </Button>
        </Stack>
      </Stack>

      {/* Welcome banner */}
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          color: "#fff",
          border: "none",
          background:
            "linear-gradient(120deg,#3730a3 0%,#4f46e5 45%,#7c3aed 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            right: -60,
            top: -80,
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ position: "relative", justifyContent: "space-between", alignItems: { md: "flex-end" } }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Chip
              label="Wedding season · live"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "#fff", fontWeight: 700 }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ mt: 2 }}>
              Good morning, Ayesha
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
              Listings are up 21.6% this month across 14 cities. You have 26 vendors
              and 3 reported reviews waiting for review.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<EventAvailableRoundedIcon />}
              onClick={() => router.push("/vendors")}
              sx={{ bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#f1f1f8" } }}
            >
              Review approvals
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => router.push("/reports")}
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
            >
              View reports
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* Metrics */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(4,1fr)",
          },
        }}
      >
        {metrics.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}
      </Box>

      {/* Category mix + activity */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        }}
      >
        <SectionCard title="Category mix" subtitle="Share of listings by category">
          <CategoryPie />
        </SectionCard>
        <SectionCard
          title="Recent inquiries"
          subtitle="Latest customer requests"
          action={<Button size="small" color="inherit" onClick={() => router.push("/inquiries")}>View all</Button>}
        >
          <RecentInquiries />
        </SectionCard>
      </Box>

      {/* Approvals */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
        }}
      >
        <SectionCard
          title="Vendor approvals"
          subtitle="New applications awaiting review"
          action={<Button size="small" color="inherit" onClick={() => router.push("/vendors")}>Review all</Button>}
        >
          <VendorApprovals />
        </SectionCard>
        <SectionCard title="Activity" subtitle="Live platform events">
          <ActivityFeed />
        </SectionCard>
      </Box>
    </Stack>
  );
}