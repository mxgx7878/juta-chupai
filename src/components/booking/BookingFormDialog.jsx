"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import { SLOTS, BOOKING_STATUSES, pkr } from "@/utils/booking";
import { isSlotFree } from "@/utils/availability";
import { EVENT_TYPES } from "@/data/marketplace";
import { VERTICALS } from "@/config/categoryTree";

function blankForm(booking, prefill, listings) {
  const first = listings[0];
  return {
    listingId: booking?.listingId || prefill?.listingId || first?.id || "",
    customerName: booking?.customerName || prefill?.customerName || "",
    customerEmail: booking?.customerEmail || prefill?.customerEmail || "",
    customerPhone: booking?.customerPhone || prefill?.customerPhone || "",
    eventDate: booking?.eventDate || prefill?.eventDate || "",
    slot: booking?.slot || prefill?.slot || "night",
    eventType: booking?.eventType || prefill?.eventType || "Barat",
    guests: booking?.guests ?? prefill?.guests ?? "",
    totalAmount: booking?.totalAmount ?? "",
    status: booking?.status || "Pending",
    note: booking?.note || prefill?.note || "",
    /* catering only */
    dealId: booking?.dealId || prefill?.dealId || "",
    menuId: booking?.menuId || prefill?.menuId || "",
    perHead: booking?.perHead ?? "",
    venueAddress: booking?.venueAddress || prefill?.venueAddress || "",
  };
}

const SectionLabel = ({ children }) => (
  <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2 }}>{children}</Typography>
);

export default function BookingFormDialog({ open, booking, prefill, listings = [], vertical, onClose, onSubmit }) {
  const allBookings = useSelector((s) => s.bookings.items);
  const [f, setF] = useState(() => blankForm(booking, prefill, listings));
  const [touchedTotal, setTouchedTotal] = useState(false);

  useEffect(() => {
    if (open) { setF(blankForm(booking, prefill, listings)); setTouchedTotal(Boolean(booking)); }
    /* eslint-disable-next-line */
  }, [open, booking, prefill]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const listing = listings.find((l) => l.id === f.listingId);
  const v = listing?.vertical || vertical || VERTICALS.HALL;
  const isCatering = v === VERTICALS.CATERING;

  const deals = listing?.catering?.deals || [];
  const menus = listing?.catering?.menus || [];
  const activeDeal = deals.find((d) => d.id === f.dealId);

  /* Hall: total follows the slot rate. Catering: total = guests x per head. */
  useEffect(() => {
    if (touchedTotal) return;
    if (isCatering) {
      const rate = Number(f.perHead) || activeDeal?.perHead || listing?.catering?.perHeadFrom || 0;
      const g = Number(f.guests) || 0;
      if (rate && g) setF((s) => ({ ...s, totalAmount: rate * g }));
    } else if (listing) {
      const rate = f.slot === "day" ? listing.hall?.dayRate : listing.hall?.nightRate;
      if (rate) setF((s) => ({ ...s, totalAmount: rate }));
    }
    /* eslint-disable-next-line */
  }, [f.listingId, f.slot, f.guests, f.perHead, f.dealId]);

  /* picking a deal sets the per-head rate */
  useEffect(() => {
    if (activeDeal?.perHead) setF((s) => ({ ...s, perHead: activeDeal.perHead }));
    /* eslint-disable-next-line */
  }, [f.dealId]);

  const clash = useMemo(() => {
    if (isCatering || !f.listingId || !f.eventDate || !f.slot) return false;
    return !isSlotFree(allBookings, f.listingId, f.eventDate, f.slot, booking?.id || null);
  }, [allBookings, f.listingId, f.eventDate, f.slot, booking, isCatering]);

  const blockingNow = ["Confirmed", "Completed"].includes(f.status);
  const hardClash = clash && blockingNow;

  const isEdit = Boolean(booking);
  const canSave = f.customerName.trim() && f.listingId && f.eventDate && !hardClash;

  const submit = () => {
    const base = {
      listingId: f.listingId,
      customerName: f.customerName.trim(),
      customerEmail: f.customerEmail.trim(),
      customerPhone: f.customerPhone.trim(),
      eventDate: f.eventDate,
      eventType: f.eventType,
      guests: Number(f.guests) || 0,
      totalAmount: Number(f.totalAmount) || 0,
      status: f.status,
      note: f.note.trim(),
    };
    onSubmit(isCatering
      ? { ...base, slot: null, dealId: f.dealId || null, menuId: f.menuId || null, perHead: Number(f.perHead) || 0, venueAddress: f.venueAddress.trim() }
      : { ...base, slot: f.slot });
    onClose();
  };

  const cap = isCatering ? listing?.catering?.maxGuests : listing?.hall?.capacity;
  const overCapacity = cap && Number(f.guests) > cap;
  const underMin = isCatering && listing?.catering?.minGuests && Number(f.guests) > 0 && Number(f.guests) < listing.catering.minGuests;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? `Edit booking — ${booking.customerName}` : prefill ? "Convert inquiry to booking" : "New booking"}
        <Typography variant="body2" color="text.secondary">
          {isCatering
            ? "Catering doesn't block dates — several events on one day is fine."
            : "Day and night are separate bookings on the same date."}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {hardClash && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {listing?.title} is already booked for the {f.slot} slot on this date. Pick another date, slot or hall.
          </Alert>
        )}
        {clash && !blockingNow && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            That date and slot is already taken. You can save this as Pending, but it can&apos;t be confirmed while the other booking stands.
          </Alert>
        )}
        {overCapacity && (
          <Alert severity="warning" sx={{ mb: 1 }}>{f.guests} guests is over {listing.title}&apos;s maximum of {cap}.</Alert>
        )}
        {underMin && (
          <Alert severity="warning" sx={{ mb: 1 }}>{listing.title} has a minimum of {listing.catering.minGuests} guests.</Alert>
        )}

        <SectionLabel>Event</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label={isCatering ? "Package" : "Hall"} size="small" select required value={f.listingId} onChange={(e) => set("listingId", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }}>
            {listings.map((l) => <MenuItem key={l.id} value={l.id}>{l.title}</MenuItem>)}
          </TextField>
          <TextField label="Event date" size="small" type="date" required value={f.eventDate} onChange={(e) => set("eventDate", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          {!isCatering && (
            <TextField label="Slot" size="small" select value={f.slot} onChange={(e) => set("slot", e.target.value)}>
              {SLOTS.map((s) => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}
            </TextField>
          )}
          <TextField label="Event type" size="small" select value={f.eventType} onChange={(e) => set("eventType", e.target.value)}>
            {EVENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField label="Guests" size="small" type="number" value={f.guests} onChange={(e) => set("guests", e.target.value)} />
          {isCatering && (
            <TextField label="Venue / delivery address" size="small" value={f.venueAddress} onChange={(e) => set("venueAddress", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
          )}
        </Box>

        {isCatering && (
          <>
            <SectionLabel>Deal &amp; menu</SectionLabel>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
              <TextField label="Deal" size="small" select value={f.dealId} onChange={(e) => set("dealId", e.target.value)}
                helperText={activeDeal ? `Min ${activeDeal.minGuests} guests` : " "}>
                <MenuItem value="">—</MenuItem>
                {deals.map((d) => <MenuItem key={d.id} value={d.id}>{d.name} — {pkr(d.perHead)}/head</MenuItem>)}
              </TextField>
              <TextField label="Menu" size="small" select value={f.menuId} onChange={(e) => set("menuId", e.target.value)}>
                <MenuItem value="">—</MenuItem>
                {menus.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
              </TextField>
            </Box>
            {activeDeal?.includes?.length > 0 && (
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
                {activeDeal.includes.map((x) => <Chip key={x} label={x} size="small" sx={{ bgcolor: "grey.100", fontWeight: 600 }} />)}
              </Stack>
            )}
          </>
        )}

        <SectionLabel>Customer</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, mt: 1 }}>
          <TextField label="Name" size="small" required value={f.customerName} onChange={(e) => set("customerName", e.target.value)} />
          <TextField label="Email" size="small" value={f.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} />
          <TextField label="Phone" size="small" value={f.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} />
        </Box>

        <SectionLabel>Amount &amp; status</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: isCatering ? "repeat(3,1fr)" : "1fr 1fr" }, mt: 1 }}>
          {isCatering && (
            <TextField label="Per head" size="small" type="number" value={f.perHead} onChange={(e) => set("perHead", e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
          )}
          <TextField label="Total amount" size="small" type="number" value={f.totalAmount}
            onChange={(e) => { setTouchedTotal(true); set("totalAmount", e.target.value); }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }}
            helperText={isCatering
              ? (Number(f.perHead) && Number(f.guests) ? `${f.guests} × ${pkr(f.perHead)} = ${pkr(Number(f.perHead) * Number(f.guests))}` : "Set guests and per head to auto-calculate")
              : (listing ? `${f.slot === "day" ? "Day" : "Night"} rate is ${pkr(f.slot === "day" ? listing.hall?.dayRate : listing.hall?.nightRate)}` : " ")} />
          <TextField label="Status" size="small" select value={f.status} onChange={(e) => set("status", e.target.value)}
            helperText={isCatering ? "Catering never blocks a date" : "Only Confirmed and Completed hold the date"}>
            {BOOKING_STATUSES.map((s) => <MenuItem key={s} value={s} disabled={clash && ["Confirmed", "Completed"].includes(s)}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Note" size="small" multiline rows={2} value={f.note} onChange={(e) => set("note", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={submit}>
          {isEdit ? "Save booking" : prefill ? "Create booking" : "Add booking"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
