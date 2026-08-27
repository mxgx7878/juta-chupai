"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import StatusChip from "@/components/ui/StatusChip";
import { TYPE_LABELS } from "@/config/categoryTree";
import { formatDate } from "@/utils/inquiry";

const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function RecentInquiries() {
  const inquiries = useSelector((s) => s.inquiries.items);
  const listings = useSelector((s) => s.listings.items);
  const router = useRouter();
  const listingById = useMemo(() => Object.fromEntries(listings.map((l) => [l.id, l])), [listings]);

  const rows = useMemo(
    () => [...inquiries].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5),
    [inquiries],
  );

  return (
    <Stack spacing={1.5}>
      {rows.map((iq) => (
        <Stack
          key={iq.id}
          direction="row"
          spacing={1.5}
          onClick={() => router.push("/inquiries")}
          sx={{ alignItems: "center", cursor: "pointer", p: 1, borderRadius: 2, "&:hover": { bgcolor: "grey.50" } }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>{iq.customerName}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {listingById[iq.listingId]?.title || "Listing"} · {formatDate(iq.createdAt)}
            </Typography>
          </Box>
          <Chip label={TYPE_LABELS[iq.type] || iq.type} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[iq.type]?.bg, color: TYPE_COLORS[iq.type]?.fg }} />
          <StatusChip status={iq.status} />
        </Stack>
      ))}
      {rows.length === 0 && <Typography variant="body2" color="text.secondary">No inquiries yet.</Typography>}
    </Stack>
  );
}