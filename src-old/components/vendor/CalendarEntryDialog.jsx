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
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { CALENDAR_KINDS } from "@/utils/calendar";
import { formatDate } from "@/utils/inquiry";

function blank(entry, date) {
  return {
    date: entry?.date || date || "",
    kind: entry?.kind || "booking",
    title: entry?.title || "",
    time: entry?.time || "",
    customerName: entry?.customerName || "",
    note: entry?.note || "",
    linkedInquiryId: entry?.linkedInquiryId || "",
  };
}

export default function CalendarEntryDialog({ open, entry, date, vendorId, onClose, onSubmit, onDelete }) {
  const [f, setF] = useState(() => blank(entry, date));
  const inquiries = useSelector((s) => s.inquiries.items);
  const listings = useSelector((s) => s.listings.items);
  const listingById = useMemo(() => Object.fromEntries(listings.map((l) => [l.id, l])), [listings]);

  // confirmed inquiries for this vendor, available to pull onto the calendar
  const linkable = useMemo(
    () => inquiries.filter((q) => q.vendorId === vendorId && q.status === "Confirmed"),
    [inquiries, vendorId],
  );

  useEffect(() => { if (open) setF(blank(entry, date)); }, [open, entry, date]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const pickInquiry = (id) => {
    if (!id) { set("linkedInquiryId", ""); return; }
    const q = inquiries.find((x) => x.id === id);
    if (!q) return;
    const listing = listingById[q.listingId];
    setF((s) => ({
      ...s,
      linkedInquiryId: id,
      title: `${q.customerName} — ${listing?.title || "Inquiry"}`,
      customerName: q.customerName,
      date: q.eventDate || s.date,
      kind: "booking",
    }));
  };

  const isEdit = Boolean(entry);
  const canSave = f.title.trim() && f.date;

  const submit = () => {
    onSubmit({
      date: f.date,
      kind: f.kind,
      title: f.title.trim(),
      time: f.time.trim(),
      customerName: f.customerName.trim(),
      note: f.note.trim(),
      linkedInquiryId: f.linkedInquiryId || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? "Edit entry" : "Add to calendar"}
        {f.date && <Typography variant="body2" color="text.secondary">{formatDate(f.date)}</Typography>}
      </DialogTitle>
      <DialogContent dividers>
        {!isEdit && linkable.length > 0 && (
          <TextField label="Link a confirmed inquiry (optional)" size="small" select fullWidth value={f.linkedInquiryId} onChange={(e) => pickInquiry(e.target.value)} sx={{ mb: 2 }}>
            <MenuItem value="">— none —</MenuItem>
            {linkable.map((q) => (
              <MenuItem key={q.id} value={q.id}>{q.customerName} · {listingById[q.listingId]?.title} · {q.eventDate ? formatDate(q.eventDate) : "no date"}</MenuItem>
            ))}
          </TextField>
        )}

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <TextField label="Title" size="small" required value={f.title} onChange={(e) => set("title", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
          <TextField label="Date" size="small" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Time (optional)" size="small" value={f.time} onChange={(e) => set("time", e.target.value)} placeholder="7:00 PM" />
          <TextField label="Type" size="small" select value={f.kind} onChange={(e) => set("kind", e.target.value)}>
            {CALENDAR_KINDS.map((k) => <MenuItem key={k.id} value={k.id}>{k.label}</MenuItem>)}
          </TextField>
          <TextField label="Customer (optional)" size="small" value={f.customerName} onChange={(e) => set("customerName", e.target.value)} />
          <TextField label="Note (optional)" size="small" multiline minRows={2} value={f.note} onChange={(e) => set("note", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Box>
          {isEdit && onDelete && (
            <Button color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => { onDelete(entry); onClose(); }}>Delete</Button>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button color="inherit" onClick={onClose}>Cancel</Button>
          <Button variant="contained" disabled={!canSave} onClick={submit}>{isEdit ? "Save" : "Add"}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}