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
import InputBase from "@mui/material/InputBase";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import RowMenu from "@/components/ui/RowMenu";
import BookingFormDialog from "@/components/booking/BookingFormDialog";
import PaymentPanel from "@/components/booking/PaymentPanel";
import { bookingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { paymentSummary, pkr, SLOT_LABELS, nextBookingStatuses } from "@/utils/booking";
import { vendorVertical, copyFor } from "@/utils/vertical";
import { formatDate } from "@/utils/date";
import { todayISO } from "@/utils/calendar";

const STATUS_TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function VendorBookingsPage() {
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === vendorId));
  const storeCategories = useSelector((s) => s.categories.items);
  const allListings = useSelector((s) => s.listings.items);
  const allBookings = useSelector((s) => s.bookings.items);
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const [dialog, setDialog] = useState({ open: false, booking: null });
  const [payFor, setPayFor] = useState(null);

  const vertical = vendorVertical(vendor, storeCategories);
  const copy = copyFor(vertical);
  const myListings = useMemo(() => allListings.filter((l) => l.vendorId === vendorId), [allListings, vendorId]);
  const listingById = useMemo(() => Object.fromEntries(myListings.map((l) => [l.id, l])), [myListings]);

  const mine = useMemo(() => {
    const ids = new Set(myListings.map((l) => l.id));
    return allBookings
      .filter((b) => ids.has(b.listingId))
      .sort((a, b) => (a.eventDate || "").localeCompare(b.eventDate || ""));
  }, [allBookings, myListings]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return mine.filter((b) => {
      const okTab = tab === 0 || b.status === STATUS_TABS[tab];
      const hay = `${b.customerName} ${listingById[b.listingId]?.title || ""} ${b.eventType}`.toLowerCase();
      return okTab && (!t || hay.includes(t));
    });
  }, [mine, tab, q, listingById]);

  const outstanding = mine
    .filter((b) => !["Cancelled"].includes(b.status))
    .reduce((a, b) => a + paymentSummary(b).remaining, 0);

  const submit = (data) => {
    if (dialog.booking) {
      dispatch(bookingsActions.update({ ...dialog.booking, ...data }));
      dispatch(notify("Booking updated"));
    } else {
      dispatch(bookingsActions.add({
        id: `bkg-${Date.now()}`,
        vendorId,
        inquiryId: null,
        createdAt: todayISO(),
        payments: [],
        ...data,
      }));
      dispatch(notify("Booking created"));
    }
  };

  const payBooking = payFor ? allBookings.find((b) => b.id === payFor) : null;

  return (
    <Box>
      <PageHeader
        overline="Vendor"
        title="Bookings"
        subtitle={`${mine.length} booking${mine.length === 1 ? "" : "s"} \u00b7 ${pkr(outstanding)} still to collect`}
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} disabled={myListings.length === 0} onClick={() => setDialog({ open: true, booking: null })}>
            New booking
          </Button>
        }
      />

      <Card sx={{ p: { xs: 1.5, md: 2 }, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" } }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
            {STATUS_TABS.map((t) => <Tab key={t} label={t} />)}
          </Tabs>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, width: { xs: "100%", md: 240 }, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search bookings\u2026" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
        </Stack>
      </Card>

      <Stack spacing={2}>
        {rows.map((b) => {
          const sum = paymentSummary(b);
          const listing = listingById[b.listingId];
          return (
            <Card key={b.id} sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: { md: "center" } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.75 }}>
                    <Typography variant="subtitle1" fontWeight={800}>{b.customerName}</Typography>
                    {b.slot && <Chip size="small" label={SLOT_LABELS[b.slot]} sx={{ fontWeight: 700, bgcolor: b.slot === "day" ? "#fef3c7" : "#e0e7ff", color: b.slot === "day" ? "#b45309" : "#3730a3" }} />}
                    <StatusChip status={b.status} />
                    {b.inquiryId && <Chip size="small" variant="outlined" label="From inquiry" sx={{ fontWeight: 600 }} />}
                  </Stack>
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5, color: "text.secondary" }}>
                    <EventRoundedIcon sx={{ fontSize: 15 }} />
                    <Typography variant="caption">
                      {formatDate(b.eventDate)} · {listing?.title || "Listing removed"} · {b.eventType} · {b.guests} guests{b.perHead ? ` · ${pkr(b.perHead)}/head` : ""}
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ width: { xs: "100%", md: 300 } }}>
                  <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">Total <b>{pkr(sum.total)}</b></Typography>
                    <Typography variant="caption" color="success.main">Got <b>{pkr(sum.received)}</b></Typography>
                    <Typography variant="caption" color={sum.remaining > 0 ? "error.main" : "success.main"}>Left <b>{pkr(sum.remaining)}</b></Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={sum.pct} sx={{ mt: 0.75, height: 6, borderRadius: 5 }} />
                </Box>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Button size="small" variant="outlined" color="inherit" startIcon={<PaymentsRoundedIcon />} onClick={() => setPayFor(b.id)}>
                    Payments
                  </Button>
                  <RowMenu
                    actions={[
                      { label: "Edit booking", icon: <EditRoundedIcon fontSize="small" />, onClick: () => setDialog({ open: true, booking: b }) },
                      ...nextBookingStatuses(b.status).map((st) => ({
                        label: `Mark ${st}`,
                        onClick: () => { dispatch(bookingsActions.setStatus({ id: b.id, status: st })); dispatch(notify(`Booking marked ${st}`)); },
                      })),
                      { label: "Delete", icon: <DeleteOutlineRoundedIcon fontSize="small" />, danger: true, onClick: () => { dispatch(bookingsActions.remove(b.id)); dispatch(notify({ message: "Booking deleted", severity: "info" })); } },
                    ]}
                  />
                </Stack>
              </Stack>
              {b.note && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary">{b.note}</Typography>
                </>
              )}
            </Card>
          );
        })}
        {rows.length === 0 && (
          <Card sx={{ p: 6, textAlign: "center" }}>
            <Typography color="text.secondary">
              {mine.length === 0 ? "No bookings yet." : "Nothing matches these filters."}
            </Typography>
          </Card>
        )}
      </Stack>

      <BookingFormDialog
        open={dialog.open}
        booking={dialog.booking}
        listings={myListings}
        vertical={vertical}
        onClose={() => setDialog({ open: false, booking: null })}
        onSubmit={submit}
      />

      <Dialog open={Boolean(payBooking)} onClose={() => setPayFor(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {payBooking?.customerName}
          <Typography variant="body2" color="text.secondary">
            {listingById[payBooking?.listingId]?.title} · {formatDate(payBooking?.eventDate)}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {payBooking && <PaymentPanel booking={payBooking} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
