"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import { TYPE_LABELS } from "@/config/categoryTree";
import { formatDate } from "@/utils/inquiry";
import { inquiriesActions } from "@/store";
import { notify } from "@/store/uiSlice";

const STATUS_TABS = ["All", "New", "Confirmed", "Completed", "Rejected"];
const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

// customer-facing wording for each status
const STATUS_NOTE = {
  New: "Waiting for the vendor to respond",
  Confirmed: "Confirmed by the vendor 🎉",
  Completed: "Completed",
  Rejected: "Declined or withdrawn",
};

export default function CustomerInquiriesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const email = useSelector((s) => s.session.customerEmail);
  const allInquiries = useSelector((s) => s.inquiries.items);
  const listings = useSelector((s) => s.listings.items);
  const vendors = useSelector((s) => s.vendors.items);

  const [tab, setTab] = useState(0);

  const listingById = useMemo(() => Object.fromEntries(listings.map((l) => [l.id, l])), [listings]);
  const vendorById = useMemo(() => Object.fromEntries(vendors.map((v) => [v.id, v])), [vendors]);

  const mine = useMemo(
    () => allInquiries
      .filter((q) => q.customerEmail === email)
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    [allInquiries, email],
  );
  const rows = useMemo(() => (tab === 0 ? mine : mine.filter((q) => q.status === STATUS_TABS[tab])), [mine, tab]);

  const withdraw = (q) => { dispatch(inquiriesActions.setStatus({ id: q.id, status: "Rejected" })); dispatch(notify({ message: "Inquiry withdrawn", severity: "info" })); };

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="My inquiries"
        subtitle={`${mine.length} inquir${mine.length === 1 ? "y" : "ies"} sent`}
        action={<Button variant="contained" startIcon={<ExploreRoundedIcon />} onClick={() => router.push("/user/browse")}>Browse more</Button>}
      />

      <Card sx={{ p: { xs: 1.5, md: 2 }, mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
          {STATUS_TABS.map((t) => <Tab key={t} label={t} />)}
        </Tabs>
      </Card>

      {rows.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {mine.length === 0 ? "You haven't sent any inquiries yet." : "Nothing in this status."}
          </Typography>
          {mine.length === 0 && <Button variant="contained" startIcon={<ExploreRoundedIcon />} onClick={() => router.push("/user/browse")}>Start browsing</Button>}
        </Card>
      ) : (
        <Stack spacing={2}>
          {rows.map((q) => {
            const listing = listingById[q.listingId];
            const vendor = vendorById[q.vendorId];
            return (
              <Card key={q.id} sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
                  <Avatar variant="rounded" sx={{ width: 46, height: 46, borderRadius: 2, bgcolor: "primary.main", fontWeight: 700 }}>
                    {(listing?.title || "?")[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                      {listing ? (
                        <MuiLink component="button" underline="hover" onClick={() => router.push(`/user/listing/${listing.id}`)} sx={{ fontWeight: 700, color: "text.primary" }}>
                          {listing.title}
                        </MuiLink>
                      ) : (
                        <Typography variant="subtitle1" fontWeight={700}>Listing no longer available</Typography>
                      )}
                      <Chip label={TYPE_LABELS[q.type] || q.type} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[q.type]?.bg, color: TYPE_COLORS[q.type]?.fg }} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {vendor?.name || "Vendor"} · sent {formatDate(q.createdAt)}
                      {q.eventDate ? " · " : ""}
                      {q.eventDate ? <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.3 }}><EventRoundedIcon sx={{ fontSize: 13 }} /> {formatDate(q.eventDate)}</Box> : null}
                    </Typography>
                    {q.message && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>&ldquo;{q.message}&rdquo;</Typography>}
                  </Box>
                  <Stack spacing={0.5} sx={{ alignItems: { sm: "flex-end" } }}>
                    <StatusChip status={q.status} />
                    <Typography variant="caption" color="text.secondary">{STATUS_NOTE[q.status]}</Typography>
                  </Stack>
                </Stack>
                {(q.status === "New" || q.status === "Confirmed") && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
                      <Button size="small" color="inherit" onClick={() => withdraw(q)}>Withdraw</Button>
                    </Stack>
                  </>
                )}
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}