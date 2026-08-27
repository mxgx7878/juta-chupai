"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { bookingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { paymentSummary, pkr, PAYMENT_LABELS } from "@/utils/booking";
import { formatDate } from "@/utils/date";
import { todayISO } from "@/utils/calendar";

const METHODS = ["Cash", "Bank transfer", "Cheque", "Card", "Other"];

function Figure({ label, value, tone = "default" }) {
  const color = tone === "error" ? "error.main" : tone === "success" ? "success.main" : "text.primary";
  return (
    <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: "grey.50", textAlign: "center" }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h6" fontWeight={800} sx={{ color }}>{pkr(value)}</Typography>
    </Box>
  );
}

export default function PaymentPanel({ booking }) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ label: "Advance", amount: "", date: todayISO(), method: "Cash" });

  const sum = paymentSummary(booking);
  const payments = booking.payments || [];

  const save = () => {
    const amount = Number(f.amount) || 0;
    if (amount <= 0) return;
    dispatch(bookingsActions.addPayment({
      bookingId: booking.id,
      payment: { id: `pay-${Date.now()}`, label: f.label, amount, date: f.date, method: f.method },
    }));
    dispatch(notify(`${pkr(amount)} recorded`));
    setF({ label: "Advance", amount: "", date: todayISO(), method: "Cash" });
    setAdding(false);
  };

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Payments</Typography>
        {!adding && (
          <Button size="small" startIcon={<AddRoundedIcon />} onClick={() => setAdding(true)}>Record payment</Button>
        )}
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Figure label="Total" value={sum.total} />
        <Figure label="Received" value={sum.received} tone="success" />
        <Figure label="Remaining" value={sum.remaining} tone={sum.remaining > 0 ? "error" : "success"} />
      </Stack>

      <Box sx={{ mt: 2 }}>
        <LinearProgress variant="determinate" value={sum.pct} sx={{ height: 8, borderRadius: 5 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          {sum.settled ? "Fully settled" : `${sum.pct}% received`}
          {sum.overpaid ? " \u00b7 overpaid" : ""}
        </Typography>
      </Box>

      {adding && (
        <Box sx={{ mt: 2, p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)" } }}>
            <TextField label="What for" size="small" select value={f.label} onChange={(e) => setF((s) => ({ ...s, label: e.target.value }))}>
              {PAYMENT_LABELS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
            <TextField label="Amount" size="small" type="number" value={f.amount} onChange={(e) => setF((s) => ({ ...s, amount: e.target.value }))}
              slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
            <TextField label="Date" size="small" type="date" value={f.date} onChange={(e) => setF((s) => ({ ...s, date: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="Method" size="small" select value={f.method} onChange={(e) => setF((s) => ({ ...s, method: e.target.value }))}>
              {METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: "flex-end" }}>
            <Button size="small" color="inherit" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="small" variant="contained" disabled={!(Number(f.amount) > 0)} onClick={save}>Save payment</Button>
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1}>
        {payments.map((p) => (
          <Stack key={p.id} direction="row" spacing={1.5} sx={{ alignItems: "center", p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={700}>{p.label}</Typography>
              <Typography variant="caption" color="text.secondary">{formatDate(p.date)} · {p.method}</Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight={800} color="success.main">{pkr(p.amount)}</Typography>
            <IconButton size="small" onClick={() => {
              dispatch(bookingsActions.removePayment({ bookingId: booking.id, paymentId: p.id }));
              dispatch(notify({ message: "Payment removed", severity: "info" }));
            }}>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        {payments.length === 0 && (
          <Typography variant="body2" color="text.secondary">Nothing received yet.</Typography>
        )}
      </Stack>
    </Card>
  );
}
