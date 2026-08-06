"use client";

import { useState } from "react";
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
import BookingsChart from "@/components/dashboard/BookingsChart";
import CategoryPie from "@/components/dashboard/CategoryPie";
import RecentBookingsTable from "@/components/dashboard/RecentBookingsTable";
import VendorApprovals from "@/components/dashboard/VendorApprovals";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { metrics } from "@/data/dashboard";

const PERIODS = ["This week", "This month", "This quarter", "This year"];

export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("This month");
  const [periodAnchor, setPeriodAnchor] = useState(null);

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
              Bookings are up 21.6% this month across 14 cities. You have 26 vendors
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

      {/* Charts row */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
        }}
      >
        <SectionCard
          title="Bookings & quotes"
          subtitle="Confirmed bookings vs. quote requests over the year"
          action={
            <Stack direction="row" spacing={2}>
              <Legend color="#4f46e5" label="Bookings" />
              <Legend color="#0ea5a4" label="Quotes" />
            </Stack>
          }
        >
          <BookingsChart />
        </SectionCard>
        <SectionCard title="Category mix" subtitle="Share of bookings by service">
          <CategoryPie />
        </SectionCard>
      </Box>

      {/* Table + activity */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
        }}
      >
        <SectionCard
          title="Recent bookings"
          subtitle="Latest activity across the marketplace"
          action={<Button size="small" color="inherit" onClick={() => router.push("/bookings")}>View all</Button>}
        >
          <RecentBookingsTable />
        </SectionCard>
        <SectionCard title="Activity" subtitle="Live platform events">
          <ActivityFeed />
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
      </Box>
    </Stack>
  );
}

function Legend({ color, label }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
    </Stack>
  );
}
