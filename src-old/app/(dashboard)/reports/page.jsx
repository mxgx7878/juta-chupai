"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { BarChart } from "@mui/x-charts/BarChart";
import PageHeader from "@/components/layout/PageHeader";
import SectionCard from "@/components/dashboard/SectionCard";
import CategoryPie from "@/components/dashboard/CategoryPie";
import { months, revenueByMonth, bookingsByCity } from "@/data/screens";
import { exportCsv } from "@/utils/exportCsv";

const axisSx = {
  "& .MuiChartsAxis-tickLabel": { fill: "#919eab", fontSize: 12 },
  "& .MuiChartsGrid-line": { stroke: "rgba(145,158,171,0.18)", strokeDasharray: "4 4" },
};

export default function ReportsPage() {
  return (
    <Box>
      <PageHeader
        overline="Engagement"
        title="Reports"
        subtitle="Revenue, listings and marketplace performance"
        action={
          <Button
            variant="contained"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={() =>
              exportCsv(
                "revenue-report.csv",
                months.map((m, i) => ({ Month: m, "Revenue (PKR m)": revenueByMonth[i] })),
              )
            }
          >
            Export CSV
          </Button>
        }
      />

      <Stack spacing={3}>
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" } }}>
          <SectionCard title="Revenue" subtitle="Gross marketplace value (PKR millions)">
            <BarChart
              height={320}
              hideLegend
              margin={{ left: 8, right: 12, top: 12, bottom: 8 }}
              xAxis={[{ scaleType: "band", data: months, disableLine: true, disableTicks: true }]}
              yAxis={[{ disableLine: true, disableTicks: true, width: 40 }]}
              series={[{ data: revenueByMonth, color: "#4f46e5" }]}
              borderRadius={8}
              grid={{ horizontal: true }}
              sx={axisSx}
            />
          </SectionCard>

          <SectionCard title="Category mix" subtitle="Share of listings">
            <CategoryPie />
          </SectionCard>
        </Box>

        <SectionCard title="Inquiries by city" subtitle="Top performing cities this month">
          <BarChart
            height={300}
            hideLegend
            layout="horizontal"
            margin={{ left: 16, right: 16, top: 8, bottom: 24 }}
            yAxis={[{ scaleType: "band", data: bookingsByCity.map((c) => c.city), disableLine: true, disableTicks: true, width: 88 }]}
            xAxis={[{ disableLine: true, disableTicks: true }]}
            series={[{ data: bookingsByCity.map((c) => c.value), color: "#0ea5a4" }]}
            borderRadius={8}
            grid={{ vertical: true }}
            sx={axisSx}
          />
        </SectionCard>
      </Stack>
    </Box>
  );
}