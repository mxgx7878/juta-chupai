"use client";

import { useState, useEffect } from "react";
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
import { SLOTS, pkr } from "@/utils/booking";
import { isSlotFree } from "@/utils/availability";
import { EVENT_TYPES } from "@/data/marketplace";
import { VERTICALS } from "@/config/categoryTree";

/* The customer-facing ask. Halls need a date + slot; catering needs guests,
   a deal and where to serve. Sending an inquiry never books anything — the
   vendor converts it. */
export default function CustomerInquiryDialog({ open, listing, prefill, onClose, onSubmit }) {
  const me = useSelector((s) => s.customers.items.find((c) => c.email === s.session.customerEmail));
  const allBookings = useSelector((s) => s.bookings.items);
  const isCatering = listing?.vertical === VERTICALS.CATERING;

  const blank = () => ({
    eventDate: prefill?.eventDate || "",
    slot: prefill?.slot || "night",
    eventType: "Barat",
    guests: isCatering ? listing?.catering?.minGuests || "" : "",
    dealId: "",
    venueAddress: "",
    message: "",
    name: me?.name || "",
    email: me?.email || "",
    phone: me?.phone || "",
  });

  const [f, setF] = useState(blank);
  useEffect(() => { if (open) setF(blank()); /* eslint-disable-next-line */ }, [open, listing, prefill]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  if (!listing) return null;

  const deals = listing.catering?.deals || [];
  const activeDeal = deals.find((d) => d.id === f.dealId);
  const perHead = activeDeal?.perHead || listing.catering?.perHeadFrom || 0;
  const estimate = isCatering && Number(f.guests) ? perHead * Number(f.guests) : 0;

  const taken = !isCatering && f.eventDate && !isSlotFree(allBookings, listing.id, f.eventDate, f.slot);
  const cap = isCatering ? listing.catering?.maxGuests : listing.hall?.capacity;
  const over = cap && Number(f.guests) > cap;

  const canSend = f.name.trim() && f.email.trim() && f.eventDate && !taken;

  const submit = () => {
    onSubmit({
      listingId: listing.id,
      vendorId: listing.vendorId,
      vertical: listing.vertical,
      customerName: f.name.trim(),
      customerEmail: f.email.trim(),
      customerPhone: f.phone.trim(),
      customerCity: me?.city || "",
      eventDate: f.eventDate,
      slot: isCatering ? null : f.slot,
      eventType: f.eventType,
      guests: Number(f.guests) || 0,
      dealId: isCatering ? f.dealId || null : null,
      venueAddress: isCatering ? f.venueAddress.trim() : "",
      message: f.message.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>
        Enquire about {listing.title}
        <Typography variant="body2" color="text.secondary">
          {isCatering
            ? "Tell them your headcount and date — they'll come back with a quote."
            : "Check the date is free, then send your details. Nothing is booked until the venue confirms."}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {taken && (
          <Alert severity="error" sx={{ mb: 2 }}>
            That {f.slot} slot is already booked. Try another date or the {f.slot === "day" ? "night" : "day"} slot.
          </Alert>
        )}
        {over && <Alert severity="warning" sx={{ mb: 2 }}>{listing.title} takes up to {cap} guests.</Alert>}

        <Typography variant="overline" color="text.secondary">Your event</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Event date" size="small" type="date" required value={f.eventDate} onChange={(e) => set("eventDate", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          {!isCatering && (
            <TextField label="Day or night" size="small" select value={f.slot} onChange={(e) => set("slot", e.target.value)}>
              {SLOTS.map((s) => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}
            </TextField>
          )}
          <TextField label="Event type" size="small" select value={f.eventType} onChange={(e) => set("eventType", e.target.value)}>
            {EVENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField label="Guests" size="small" type="number" value={f.guests} onChange={(e) => set("guests", e.target.value)} />
          {isCatering && (
            <>
              <TextField label="Deal you're interested in" size="small" select value={f.dealId} onChange={(e) => set("dealId", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }}>
                <MenuItem value="">Not sure yet</MenuItem>
                {deals.map((d) => <MenuItem key={d.id} value={d.id}>{d.name} — {pkr(d.perHead)}/head</MenuItem>)}
              </TextField>
              <TextField label="Where should they serve?" size="small" placeholder="Venue name or address" value={f.venueAddress} onChange={(e) => set("venueAddress", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
            </>
          )}
        </Box>

        {estimate > 0 && (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 2 }}>
            <Chip label={`Rough estimate: ${pkr(estimate)}`} sx={{ fontWeight: 700, bgcolor: "#dcfce7", color: "#15803d" }} />
            <Typography variant="caption" color="text.secondary">{f.guests} × {pkr(perHead)}/head</Typography>
          </Stack>
        )}

        <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 3 }}>Your details</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, mt: 1 }}>
          <TextField label="Name" size="small" required value={f.name} onChange={(e) => set("name", e.target.value)} />
          <TextField label="Email" size="small" required value={f.email} onChange={(e) => set("email", e.target.value)} />
          <TextField label="Phone" size="small" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </Box>
        <TextField label="Anything else?" size="small" multiline rows={3} fullWidth sx={{ mt: 2 }}
          placeholder={isCatering ? "Dietary needs, live stations, service timing…" : "Decor, timings, outside catering…"}
          value={f.message} onChange={(e) => set("message", e.target.value)} />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSend} onClick={submit}>Send inquiry</Button>
      </DialogActions>
    </Dialog>
  );
}
