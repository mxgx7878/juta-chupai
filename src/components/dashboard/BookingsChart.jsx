"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { months, bookingsSeries, quotesSeries } from "@/data/dashboard";

export default function BookingsChart() {
  return (
    <LineChart
      height={320}
      hideLegend
      margin={{ left: 8, right: 12, top: 12, bottom: 8 }}
      xAxis={[{ scaleType: "point", data: months, disableLine: true, disableTicks: true }]}
      yAxis={[{ disableLine: true, disableTicks: true, width: 44 }]}
      grid={{ horizontal: true }}
      series={[
        { data: bookingsSeries, label: "Bookings", color: "#4f46e5", area: true, curve: "monotoneX", showMark: false },
        { data: quotesSeries, label: "Quotes", color: "#0ea5a4", curve: "monotoneX", showMark: false },
      ]}
      sx={{
        "& .MuiAreaElement-series-auto": { fillOpacity: 0.16 },
        "& .MuiAreaElement-root": { fillOpacity: 0.16 },
        "& .MuiLineElement-root": { strokeWidth: 3 },
        "& .MuiChartsAxis-tickLabel": { fill: "#919eab", fontSize: 12 },
        "& .MuiChartsGrid-line": { stroke: "rgba(145,158,171,0.18)", strokeDasharray: "4 4" },
      }}
    />
  );
}
