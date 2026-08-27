"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";

const COLORS = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];

/* Listings were removed in the vertical rebuild, so the mix is computed from
   vendors per category until listings return. */
export default function CategoryPie() {
  const vendors = useSelector((s) => s.vendors.items);

  const data = useMemo(() => {
    const counts = {};
    vendors.forEach((v) => { counts[v.category] = (counts[v.category] || 0) + 1; });
    const total = vendors.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, n], i) => ({
        id: i,
        value: Math.round((n / total) * 100),
        label: name,
        color: COLORS[i % COLORS.length],
      }));
  }, [vendors]);

  const shown = data.reduce((s, d) => s + d.value, 0);

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "center" }}>
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <PieChart
          series={[{ data, innerRadius: 58, outerRadius: 84, paddingAngle: 3, cornerRadius: 6, highlightScope: { fade: "global", highlight: "item" } }]}
          width={190}
          height={190}
          hideLegend
        />
        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <Typography variant="h5" fontWeight={800}>{shown}%</Typography>
          <Typography variant="caption" color="text.secondary">of vendors</Typography>
        </Box>
      </Box>
      <Stack spacing={1.25} sx={{ width: "100%" }}>
        {data.map((d) => (
          <Stack key={d.label} direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: d.color }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{d.label}</Typography>
            <Typography variant="body2" fontWeight={700}>{d.value}%</Typography>
          </Stack>
        ))}
        {data.length === 0 && <Typography variant="body2" color="text.secondary">No vendors yet.</Typography>}
      </Stack>
    </Stack>
  );
}
