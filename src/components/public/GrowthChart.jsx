"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { growth } from "@/data/publicSite";
import { colors, withAlpha } from "@/theme/tokens";

/* One measure at a time, one y-axis, one hue.
   Bookings, vendors and booking value live on wildly different scales, so they
   are switched rather than plotted together — a second axis would make the
   comparison meaningless. */
const METRICS = [
  { id: "bookings", label: "Bookings", series: growth.bookings, format: (v) => v.toLocaleString("en-PK"), suffix: "events", chart: "bar" },
  { id: "vendors", label: "Vendors joined", series: growth.vendorsJoined, format: (v) => v.toLocaleString("en-PK"), suffix: "vendors", chart: "bar" },
  { id: "value", label: "Booking value", series: growth.bookingValue, format: (v) => `PKR ${v}M`, suffix: "per month", chart: "line" },
];

const AXIS_SX = {
  "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": { stroke: colors.border },
  "& .MuiChartsAxis-tickLabel": { fill: colors.textSecondary, fontSize: 12 },
  "& .MuiChartsGrid-line": { stroke: withAlpha(colors.textSecondary, 0.16), strokeDasharray: "4 4" },
};

export default function GrowthChart() {
  const [active, setActive] = useState(METRICS[0]);
  const total = active.series.reduce((a, b) => a + b, 0);
  const last = active.series[active.series.length - 1];
  const first = active.series[0];
  const delta = Math.round(((last - first) / first) * 100);

  return (
    <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "flex-start" }, mb: 3 }}>
        <Box>
          <Typography variant="h6">{active.label} over the last 12 months</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "baseline", mt: 0.5 }}>
            <Typography variant="h4">{active.format(last)}</Typography>
            <Typography variant="body2" sx={{ color: colors.success, fontWeight: 700 }}>+{delta}% year on year</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {active.id === "value" ? `PKR ${total}M booked across the year` : `${total.toLocaleString("en-PK")} ${active.suffix} in total`}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {METRICS.map((m) => (
            <Chip
              key={m.id}
              label={m.label}
              size="small"
              onClick={() => setActive(m)}
              variant={active.id === m.id ? "filled" : "outlined"}
              color={active.id === m.id ? "primary" : "default"}
              sx={{ fontWeight: 700 }}
            />
          ))}
        </Stack>
      </Stack>

      <Box sx={{ width: "100%", height: 300 }}>
        {active.chart === "bar" ? (
          <BarChart
            height={300}
            grid={{ horizontal: true }}
            margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
            xAxis={[{ scaleType: "band", data: growth.months, disableLine: true, disableTicks: true, categoryGapRatio: 0.55 }]}
            yAxis={[{ disableLine: true, disableTicks: true, valueFormatter: (v) => active.format(v) }]}
            series={[{ data: active.series, color: colors.primary, label: active.label, valueFormatter: (v) => active.format(v) }]}
            borderRadius={4}
            hideLegend
            sx={AXIS_SX}
          />
        ) : (
          <LineChart
            height={300}
            grid={{ horizontal: true }}
            margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
            xAxis={[{ scaleType: "point", data: growth.months, disableLine: true, disableTicks: true }]}
            yAxis={[{ disableLine: true, disableTicks: true, valueFormatter: (v) => `${v}M` }]}
            series={[{
              data: active.series,
              color: colors.primary,
              label: active.label,
              area: true,
              curve: "monotoneX",
              showMark: true,
              valueFormatter: (v) => active.format(v),
            }]}
            hideLegend
            sx={{
              ...AXIS_SX,
              "& .MuiAreaElement-root": { fill: withAlpha(colors.primary, 0.14) },
              "& .MuiLineElement-root": { strokeWidth: 2 },
              "& .MuiMarkElement-root": { stroke: colors.surface, strokeWidth: 2, r: 4 },
            }}
          />
        )}
      </Box>
    </Card>
  );
}
