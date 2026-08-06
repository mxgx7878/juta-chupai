"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts/PieChart";
import { categoryMix } from "@/data/dashboard";

const COLORS = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899"];

export default function CategoryPie() {
  const total = categoryMix.reduce((s, d) => s + d.value, 0);
  const data = categoryMix.map((c, i) => ({ id: i, value: c.value, label: c.label, color: COLORS[i % COLORS.length] }));

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
          <Typography variant="h5" fontWeight={800}>
            {total}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            of bookings
          </Typography>
        </Box>
      </Box>
      <Stack spacing={1.25} sx={{ width: "100%" }}>
        {data.map((d) => (
          <Stack key={d.label} direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: d.color }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {d.label}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {d.value}%
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
