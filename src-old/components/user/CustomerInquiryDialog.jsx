"use client";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { TYPE_LABELS } from "@/config/categoryTree";
import { typePriceLabel, listingTypes } from "@/utils/listing";

const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function CustomerInquiryDialog({ open, listing, customer, onClose, onSubmit }) {
  const types = listing ? listingTypes(listing) : [];
  const [type, setType] = useState(types[0] || "");
  const [eventDate, setEventDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) { setType(types[0] || ""); setEventDate(""); setQuantity(1); setMessage(""); }
  }, [open, listing]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!listing) return null;
  const needsDate = type === "rent" || type === "service";
  const isPurchase = type === "purchase";
  const canSend = type && (!needsDate || eventDate);

  const submit = () => {
    onSubmit({
      type,
      eventDate: needsDate ? eventDate : "",
      quantity: isPurchase ? Number(quantity) || 1 : undefined,
      message: message.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        Make an inquiry
        <Typography variant="body2" color="text.secondary">{listing.title}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: "grey.50" }}>
          <Typography variant="caption" color="text.secondary">Sending as</Typography>
          <Typography variant="subtitle2" fontWeight={700}>{customer?.name} · {customer?.email}</Typography>
        </Box>

        <Typography variant="overline" color="text.secondary">I&apos;m interested in</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 0.5, mb: 2, flexWrap: "wrap", gap: 1 }}>
          {types.map((t) => (
            <Chip
              key={t}
              label={`${TYPE_LABELS[t]} · ${typePriceLabel(listing, t)}`}
              onClick={() => setType(t)}
              variant={type === t ? "filled" : "outlined"}
              sx={{ fontWeight: 700, ...(type === t ? { bgcolor: TYPE_COLORS[t]?.bg, color: TYPE_COLORS[t]?.fg } : {}) }}
            />
          ))}
        </Stack>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {needsDate && (
            <TextField label="Event date" size="small" type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          )}
          {isPurchase && (
            <TextField label="Quantity" size="small" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} slotProps={{ htmlInput: { min: 1 } }} />
          )}
          <TextField label="Message (optional)" size="small" multiline minRows={2} value={message} onChange={(e) => setMessage(e.target.value)} sx={{ gridColumn: "1 / -1" }} placeholder="Share any details — guest count, colours, timing…" />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSend} onClick={submit}>Send inquiry</Button>
      </DialogActions>
    </Dialog>
  );
}