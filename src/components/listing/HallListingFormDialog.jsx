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
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { CITY_OPTIONS } from "@/config/cities";
import { categoriesByVertical, VERTICALS } from "@/config/categoryTree";

const SETTINGS = ["Indoor", "Outdoor", "Both"];
const CATERING = ["In-house only", "Outside allowed", "In-house or outside"];
const AMENITY_SUGGESTIONS = [
  "Air conditioning", "In-house stage", "Bridal room", "Valet parking",
  "Generator backup", "Sound system", "Lighting", "Open lawn", "Seating",
];

function blankForm(listing, hallCategories) {
  const h = listing?.hall || {};
  return {
    title: listing?.title || "",
    categoryId: listing?.categoryId || hallCategories[0]?.id || "venues",
    subcategoryId: listing?.subcategoryId || "",
    city: listing?.city || CITY_OPTIONS[0],
    description: listing?.description || "",
    status: listing?.status || "Draft",
    capacity: h.capacity ?? "",
    minGuests: h.minGuests ?? "",
    setting: h.setting || "Indoor",
    dayRate: h.dayRate ?? "",
    nightRate: h.nightRate ?? "",
    parking: h.parking ?? "",
    advancePolicy: h.advancePolicy || "",
    catering: h.catering || CATERING[0],
    amenities: h.amenities ? [...h.amenities] : [],
  };
}

const SectionLabel = ({ children }) => (
  <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2 }}>{children}</Typography>
);

export default function HallListingFormDialog({ open, listing, onClose, onSubmit }) {
  const storeCategories = useSelector((s) => s.categories.items);
  const hallCategories = storeCategories.filter((c) => (c.vertical || VERTICALS.GENERIC) === VERTICALS.HALL);
  const fallback = categoriesByVertical(VERTICALS.HALL);
  const cats = hallCategories.length ? hallCategories : fallback;

  const [f, setF] = useState(() => blankForm(listing, cats));
  useEffect(() => { if (open) setF(blankForm(listing, cats)); /* eslint-disable-next-line */ }, [open, listing]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const activeCat = cats.find((c) => c.id === f.categoryId);
  const subs = activeCat?.subcategories || [];

  const isEdit = Boolean(listing);
  const canSave = f.title.trim() && f.categoryId && (f.dayRate !== "" || f.nightRate !== "");

  const submit = () => {
    onSubmit({
      title: f.title.trim(),
      categoryId: f.categoryId,
      subcategoryId: f.subcategoryId || "",
      city: f.city,
      description: f.description.trim(),
      status: f.status,
      vertical: VERTICALS.HALL,
      hall: {
        capacity: Number(f.capacity) || 0,
        minGuests: Number(f.minGuests) || 0,
        setting: f.setting,
        dayRate: Number(f.dayRate) || 0,
        nightRate: Number(f.nightRate) || 0,
        parking: Number(f.parking) || 0,
        advancePolicy: f.advancePolicy.trim(),
        catering: f.catering,
        amenities: f.amenities,
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? `Edit hall \u2014 ${listing.title}` : "Add a hall"}
        <Typography variant="body2" color="text.secondary">
          One listing is one physical hall. Each hall keeps its own availability calendar.
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <SectionLabel>Hall details</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Hall name" size="small" required value={f.title} onChange={(e) => set("title", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
          <TextField label="Category" size="small" select value={f.categoryId} onChange={(e) => { set("categoryId", e.target.value); set("subcategoryId", ""); }}>
            {cats.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
          <TextField label="Type of venue" size="small" select value={f.subcategoryId} onChange={(e) => set("subcategoryId", e.target.value)}>
            <MenuItem value="">—</MenuItem>
            {subs.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
          <TextField label="City" size="small" select value={f.city} onChange={(e) => set("city", e.target.value)}>
            {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Status" size="small" select value={f.status} onChange={(e) => set("status", e.target.value)}>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
          </TextField>
          <TextField label="Description" size="small" multiline rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
        </Box>

        <SectionLabel>Capacity &amp; setting</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, mt: 1 }}>
          <TextField label="Guest capacity" size="small" type="number" value={f.capacity} onChange={(e) => set("capacity", e.target.value)}
            slotProps={{ input: { endAdornment: <InputAdornment position="end">guests</InputAdornment> } }} />
          <TextField label="Minimum guests" size="small" type="number" value={f.minGuests} onChange={(e) => set("minGuests", e.target.value)} />
          <TextField label="Setting" size="small" select value={f.setting} onChange={(e) => set("setting", e.target.value)}>
            {SETTINGS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Box>

        <SectionLabel>Pricing</SectionLabel>
        <Typography variant="caption" color="text.secondary">
          Day and night are booked separately, so the same date can carry two bookings.
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Day rate" size="small" type="number" value={f.dayRate} onChange={(e) => set("dayRate", e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
          <TextField label="Night rate" size="small" type="number" value={f.nightRate} onChange={(e) => set("nightRate", e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
          <TextField label="Advance policy" size="small" placeholder="e.g. 40% to confirm the date" value={f.advancePolicy} onChange={(e) => set("advancePolicy", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
        </Box>

        <SectionLabel>Facilities</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Parking spaces" size="small" type="number" value={f.parking} onChange={(e) => set("parking", e.target.value)} />
          <TextField label="Catering" size="small" select value={f.catering} onChange={(e) => set("catering", e.target.value)}>
            {CATERING.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </Box>
        <Autocomplete
          multiple freeSolo size="small" options={AMENITY_SUGGESTIONS}
          value={f.amenities} onChange={(_, v) => set("amenities", v)}
          renderInput={(params) => <TextField {...params} label="Amenities" placeholder="Add and press Enter" sx={{ mt: 2 }} />}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={submit}>{isEdit ? "Save hall" : "Add hall"}</Button>
      </DialogActions>
    </Dialog>
  );
}
