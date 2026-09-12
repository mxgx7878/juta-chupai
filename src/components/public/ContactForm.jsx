"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { notify } from "@/store/uiSlice";
import { colors } from "@/theme/tokens";

const TOPICS = [
  "Finding a venue for my event",
  "A booking I have already made",
  "Listing my venue or catering business",
  "Partnerships and press",
  "Something else",
];

const BLANK = { name: "", email: "", phone: "", topic: TOPICS[0], message: "" };

/** Contact form. No backend yet, so a submission is acknowledged locally and the
    fields are cleared — wire `onSubmit` to the API when the endpoint exists. */
export default function ContactForm() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(BLANK);
  const [sent, setSent] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const valid =
    form.name.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(form.email.trim()) &&
    form.message.trim().length > 9;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    setSent(true);
    setForm(BLANK);
    dispatch(notify("Message sent — we'll reply within one business day"));
  };

  return (
    <Card sx={{ p: { xs: 2.5, md: 4 } }} component="form" onSubmit={submit} noValidate>
      <Typography variant="h5">Send us a message</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 3 }}>
        Tell us the city, the date and the guest count and we'll come back with a shortlist.
      </Typography>

      {sent && <Alert severity="success" sx={{ mb: 2.5 }}>Thanks — your message is with the team.</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        <TextField label="Full name" size="small" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        <TextField label="Email" size="small" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <TextField label="Mobile number" size="small" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <TextField label="What is it about?" size="small" select value={form.topic} onChange={(e) => set("topic", e.target.value)}>
          {TOPICS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
      </Box>

      <TextField
        label="Message"
        size="small"
        required
        multiline
        minRows={4}
        sx={{ mt: 2 }}
        fullWidth
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
        helperText="At least a line or two, so we can be useful in the first reply."
      />

      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 3 }}>
        <Button type="submit" variant="contained" size="large" startIcon={<SendRoundedIcon />} disabled={!valid}>
          Send message
        </Button>
        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
          We never share your details with vendors you have not contacted.
        </Typography>
      </Stack>
    </Card>
  );
}
