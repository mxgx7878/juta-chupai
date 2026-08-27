"use client";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { CITY_OPTIONS } from "@/config/vendorCategories";

/* Profile-only edit. Deliberately excludes category, verification/premium/status,
   packages and category attributes — those belong to the marketplace team or to
   the listings model, not to a vendor editing their storefront. */

function blankForm(vendor) {
  return {
    name: vendor?.name || "",
    owner: vendor?.owner || "",
    city: vendor?.city || CITY_OPTIONS[0],
    experience: vendor?.experience || "",
    hours: vendor?.hours || "",
    services: vendor?.services ? [...vendor.services] : [],
    ig: vendor?.ig || "",
    fb: vendor?.fb || "",
    web: vendor?.web || "",
  };
}

const SectionLabel = ({ children }) => (
  <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 1 }}>{children}</Typography>
);

export default function VendorProfileEditDialog({ open, vendor, onClose, onSubmit }) {
  const [f, setF] = useState(() => blankForm(vendor));
  useEffect(() => { if (open) setF(blankForm(vendor)); }, [open, vendor]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const canSave = f.name.trim() && f.owner.trim();

  const submit = () => {
    onSubmit({
      name: f.name.trim(),
      owner: f.owner.trim(),
      city: f.city,
      experience: f.experience.trim(),
      hours: f.hours.trim(),
      services: f.services,
      ig: f.ig.trim(),
      fb: f.fb.trim(),
      web: f.web.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>
        Edit profile
        <Typography variant="body2" color="text.secondary">How your storefront appears to customers</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <SectionLabel>Storefront</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Business name" size="small" required value={f.name} onChange={(e) => set("name", e.target.value)} />
          <TextField label="Owner / contact person" size="small" required value={f.owner} onChange={(e) => set("owner", e.target.value)} />
          <TextField label="City" size="small" select value={f.city} onChange={(e) => set("city", e.target.value)}>
            {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Experience" size="small" placeholder="e.g. 8 yrs" value={f.experience} onChange={(e) => set("experience", e.target.value)} />
          <TextField label="Business hours" size="small" placeholder="e.g. 10 AM – 11 PM" value={f.hours} onChange={(e) => set("hours", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
        </Box>

        <SectionLabel>What you offer</SectionLabel>
        <Autocomplete
          multiple freeSolo size="small"
          options={[]}
          value={f.services}
          onChange={(_, v) => set("services", v)}
          renderInput={(params) => <TextField {...params} placeholder="Add a service and press Enter" sx={{ mt: 1 }} />}
        />

        <SectionLabel>Contact &amp; social</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Instagram" size="small" value={f.ig} onChange={(e) => set("ig", e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><InstagramIcon fontSize="small" /></InputAdornment> } }} />
          <TextField label="Facebook" size="small" value={f.fb} onChange={(e) => set("fb", e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><FacebookIcon fontSize="small" /></InputAdornment> } }} />
          <TextField label="Website" size="small" value={f.web} onChange={(e) => set("web", e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><LanguageRoundedIcon fontSize="small" /></InputAdornment> } }} sx={{ gridColumn: { sm: "1 / -1" } }} />
        </Box>

        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: "grey.50" }}>
          <Typography variant="caption" color="text.secondary">
            Your category, verification and premium status are managed by the marketplace team. To change them, contact support.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={submit}>Save profile</Button>
      </DialogActions>
    </Dialog>
  );
}