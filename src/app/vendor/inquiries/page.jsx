"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import BookingFormDialog from "@/components/booking/BookingFormDialog";
import { inquiriesActions, bookingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { SLOT_LABELS } from "@/utils/booking";
import { vendorVertical } from "@/utils/vertical";
import { formatDate } from "@/utils/date";
import { todayISO } from "@/utils/calendar";

const STATUS_TABS = ["All", "New", "Converted", "Rejected"];
const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];
const initials = (n) => (n || "?").split(" ").map((p) => p[0]).join("").slice(0, 2);

export default function VendorInquiriesPage() {
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === vendorId));
  const storeCategories = useSelector((s) => s.categories.items);
  const allInquiries = useSelector((s) => s.inquiries.items);
  const allListings = useSelector((s) => s.listings.items);
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);
  const [converting, setConverting] = useState(null);

  const vertical = vendorVertical(vendor, storeCategories);
  const myListings = useMemo(() => allListings.filter((l) => l.vendorId === vendorId), [allListings, vendorId]);
  const listingById = useMemo(() => Object.fromEntries(allListings.map((l) => [l.id, l])), [allListings]);

  const mine = useMemo(
    () => allInquiries
      .filter((q) => q.vendorId === vendorId)
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    [allInquiries, vendorId],
  );
  const rows = useMemo(() => (tab === 0 ? mine : mine.filter((q) => q.status === STATUS_TABS[tab])), [mine, tab]);
  const newCount = mine.filter((q) => q.status === "New").length;

  const convert = (data) => {
    const bookingId = `bkg-${Date.now()}`;
    dispatch(bookingsActions.add({
      id: bookingId,
      vendorId,
      inquiryId: converting.id,
      createdAt: todayISO(),
      payments: [],
      ...data,
    }));
    dispatch(inquiriesActions.markConverted({ id: converting.id, bookingId }));
    dispatch(notify("Inquiry converted to a booking"));
  };

  return (
    <Box>
      <PageHeader
        overline="Vendor"
        title="Inquiries"
        subtitle={`${mine.length} inquir${mine.length === 1 ? "y" : "ies"} \u00b7 ${newCount} waiting on you`}
      />

      <Card sx={{ p: { xs: 1.5, md: 2 }, mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
          {STATUS_TABS.map((t) => <Tab key={t} label={t} />)}
        </Tabs>
      </Card>

      <Stack spacing={2}>
        {rows.map((q, i) => (
          <Card key={q.id} sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
              <Avatar sx={{ bgcolor: AV[i % AV.length], width: 44, height: 44, fontSize: 14, fontWeight: 700 }}>
                {initials(q.customerName)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.75 }}>
                  <Typography variant="subtitle1" fontWeight={800}>{q.customerName}</Typography>
                  {q.slot && <Chip size="small" label={SLOT_LABELS[q.slot] || q.slot} sx={{ fontWeight: 700, bgcolor: q.slot === "day" ? "#fef3c7" : "#e0e7ff", color: q.slot === "day" ? "#b45309" : "#3730a3" }} />}
                  <StatusChip status={q.status} />
                </Stack>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5, color: "text.secondary" }}>
                  <EventRoundedIcon sx={{ fontSize: 15 }} />
                  <Typography variant="caption">
                    {formatDate(q.eventDate)} · {listingById[q.listingId]?.title || "Listing removed"} · {q.eventType} · {q.guests} guests
                  </Typography>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                {q.status === "New" && (
                  <>
                    <Button size="small" variant="contained" color="success" startIcon={<CheckRoundedIcon />} onClick={() => setConverting(q)}>
                      Convert to booking
                    </Button>
                    <Button size="small" variant="outlined" color="inherit" startIcon={<CloseRoundedIcon />}
                      onClick={() => { dispatch(inquiriesActions.setStatus({ id: q.id, status: "Rejected" })); dispatch(notify({ message: "Inquiry declined", severity: "info" })); }}>
                      Decline
                    </Button>
                  </>
                )}
                {q.status === "Rejected" && (
                  <Button size="small" color="inherit" onClick={() => { dispatch(inquiriesActions.setStatus({ id: q.id, status: "New" })); dispatch(notify("Inquiry reopened")); }}>
                    Reopen
                  </Button>
                )}
                {q.status === "Converted" && (
                  <Chip size="small" color="success" variant="outlined" label="Booked" sx={{ fontWeight: 700 }} />
                )}
              </Stack>
            </Stack>
            {q.message && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" color="text.secondary">{q.message}</Typography>
              </>
            )}
          </Card>
        ))}
        {rows.length === 0 && (
          <Card sx={{ p: 6, textAlign: "center" }}>
            <Typography color="text.secondary">{mine.length === 0 ? "No inquiries yet." : "Nothing in this status."}</Typography>
          </Card>
        )}
      </Stack>

      <BookingFormDialog
        open={Boolean(converting)}
        prefill={converting ? {
          listingId: converting.listingId,
          customerName: converting.customerName,
          customerEmail: converting.customerEmail,
          eventDate: converting.eventDate,
          slot: converting.slot,
          eventType: converting.eventType,
          guests: converting.guests,
          venueAddress: converting.venueAddress,
          note: converting.message,
        } : null}
        listings={myListings}
        vertical={vertical}
        onClose={() => setConverting(null)}
        onSubmit={convert}
      />
    </Box>
  );
}
