"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StatusChip from "@/components/ui/StatusChip";
import { inquiriesActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { SLOT_LABELS, pkr, paymentSummary } from "@/utils/booking";
import { formatDate } from "@/utils/date";

const TABS = ["All", "New", "Converted", "Rejected"];

export default function CustomerInquiriesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const email = useSelector((s) => s.session.customerEmail);
  const allInquiries = useSelector((s) => s.inquiries.items);
  const listings = useSelector((s) => s.listings.items);
  const bookings = useSelector((s) => s.bookings.items);
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
  const rows = useMemo(() => (tab === 0 ? mine : mine.filter((q) => q.status === TABS[tab])), [mine, tab]);
  const confirmed = mine.filter((q) => q.status === "Converted").length;

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>My inquiries</Typography>
        <Typography color="text.secondary">
          {mine.length} sent · {confirmed} turned into a confirmed booking
        </Typography>
      </Stack>

      <Card sx={{ p: { xs: 1.5, md: 2 }, mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
          sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
          {TABS.map((t) => <Tab key={t} label={t} />)}
        </Tabs>
      </Card>

      <Stack spacing={2}>
        {rows.map((q) => {
          const listing = listingById[q.listingId];
          const vendor = vendorById[q.vendorId];
          const booking = q.bookingId ? bookings.find((b) => b.id === q.bookingId) : null;
          const sum = booking ? paymentSummary(booking) : null;

          return (
            <Card key={q.id} sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.75 }}>
                    <Typography variant="subtitle1" fontWeight={800}>{listing?.title || "Listing removed"}</Typography>
                    {q.slot && <Chip size="small" label={SLOT_LABELS[q.slot]} sx={{ fontWeight: 700, bgcolor: q.slot === "day" ? "#fef3c7" : "#e0e7ff", color: q.slot === "day" ? "#b45309" : "#3730a3" }} />}
                    <StatusChip status={q.status} />
                  </Stack>
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5, color: "text.secondary" }}>
                    <EventRoundedIcon sx={{ fontSize: 15 }} />
                    <Typography variant="caption">
                      {formatDate(q.eventDate)} · {q.eventType} · {q.guests} guests
                    </Typography>
                  </Stack>
                  {vendor && (
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.25, color: "text.secondary" }}>
                      <PlaceRoundedIcon sx={{ fontSize: 15 }} />
                      <Typography variant="caption">{vendor.name} · {vendor.city}</Typography>
                    </Stack>
                  )}
                </Box>

                <Stack direction="row" spacing={1}>
                  {listing && (
                    <Button size="small" color="inherit" variant="outlined" onClick={() => router.push(`/user/listing/${listing.id}`)}>
                      View listing
                    </Button>
                  )}
                  {q.status === "New" && (
                    <Button size="small" color="inherit" onClick={() => {
                      dispatch(inquiriesActions.setStatus({ id: q.id, status: "Withdrawn" }));
                      dispatch(notify({ message: "Inquiry withdrawn", severity: "info" }));
                    }}>Withdraw</Button>
                  )}
                </Stack>
              </Stack>

              {q.message && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">{q.message}</Typography>
                </>
              )}

              {booking && sum && (
                <Alert severity="success" sx={{ mt: 2 }} icon={false}>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 0.5 }}>Confirmed — {formatDate(booking.eventDate)}</Typography>
                  <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                    <Typography variant="caption">Total <b>{pkr(sum.total)}</b></Typography>
                    <Typography variant="caption">Paid <b>{pkr(sum.received)}</b></Typography>
                    <Typography variant="caption">Remaining <b>{pkr(sum.remaining)}</b></Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={sum.pct} sx={{ mt: 1, height: 6, borderRadius: 5 }} />
                </Alert>
              )}
            </Card>
          );
        })}

        {rows.length === 0 && (
          <Card sx={{ p: 6, textAlign: "center" }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {mine.length === 0 ? "You haven't sent any inquiries yet." : "Nothing in this status."}
            </Typography>
            {mine.length === 0 && <Button variant="contained" onClick={() => router.push("/user/browse")}>Start browsing</Button>}
          </Card>
        )}
      </Stack>
    </Box>
  );
}
