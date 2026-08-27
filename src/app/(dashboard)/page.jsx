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
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";

const PERIODS = ["This week", "This month", "This quarter", "This year"];

export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("This month");
  const [periodAnchor, setPeriodAnchor] = useState(null);

  const vendors = useSelector((s) => s.vendors.items);
  const customers = useSelector((s) => s.customers.items);
  const categories = useSelector((s) => s.categories.items);

  const metrics = useMemo(() => {
    const activeVendors = vendors.filter((v) => v.status === "Approved").length;
    const pending = vendors.filter((v) => v.status === "Pending").length;
    const activeCustomers = customers.filter((c) => c.status === "Active").length;
    const subCount = categories.reduce((a, c) => a + (c.subcategories?.length || 0), 0);
    return [
      { label: "Active vendors", value: String(activeVendors), change: `${vendors.length} total`, up: true, note: "approved & listed", icon: StorefrontRoundedIcon, color: "primary" },
      { label: "Pending approvals", value: String(pending), change: pending ? `${pending} to review` : "all clear", up: pending === 0, note: "needs review", icon: PendingActionsRoundedIcon, color: "warning" },
      { label: "Customers", value: String(activeCustomers), change: `${customers.length} total`, up: true, note: "registered & active", icon: GroupRoundedIcon, color: "success" },
      { label: "Categories", value: String(categories.length), change: `${subCount} subcategories`, up: true, note: "in the tree", icon: CategoryRoundedIcon, color: "secondary" },
    ];
  }, [vendors, customers, categories]);

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
              Vendors, categories and cities are live. Listings, inquiries and bookings
              are being rebuilt around the hall and catering verticals.
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

      {/* Category mix */}
      <SectionCard title="Category mix" subtitle="Share of vendors by category">
        <CategoryPie />
      </SectionCard>

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