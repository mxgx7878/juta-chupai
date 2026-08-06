"use client";

import Chip from "@mui/material/Chip";
import { statusColor } from "@/data/screens";

export default function StatusChip({ status }) {
  return (
    <Chip
      size="small"
      label={status}
      sx={(t) => {
        const c = t.palette[statusColor[status]] || t.palette.grey;
        return {
          bgcolor: c.light || t.palette.grey[100],
          color: c.dark || c.main || t.palette.text.secondary,
          fontWeight: 700,
        };
      }}
    />
  );
}
