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
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { CITY_OPTIONS } from "@/config/vendorCategories";
import {
  CATEGORY_TREE,
  getCategory,
  getCategoryByName,
  TYPE_LABELS,
  fieldsFor,
} from "@/config/categoryTree";
import { LISTING_STATUSES } from "@/utils/listing";

const emptyPricing = () => ({
  rent: { amount: "", unit: "per event", deposit: "" },
  purchase: { amount: "" },
  service: { amount: "", unit: "per event" },
});

function blankForm(listing, vendors) {
  // sensible default category when creating: from the chosen/first vendor
  const firstVendor = vendors[0];
  const defaultCat =
    (listing && getCategory(listing.categoryId)) ||
    getCategoryByName(firstVendor?.category) ||
    CATEGORY_TREE[0];

  const pricing = emptyPricing();
  if (listing?.pricing) {
    for (const t of Object.keys(pricing)) {
      if (listing.pricing[t]) pricing[t] = { ...pricing[t], ...listing.pricing[t] };
    }
  }

  return {
    vendorId: listing?.vendorId || firstVendor?.id || "",
    title: listing?.title || "",
    categoryId: listing?.categoryId || defaultCat.id,
    subcategoryId: listing?.subcategoryId || "",
    types: listing?.types ? [...listing.types] : [],
    pricing,
    city: listing?.city || firstVendor?.city || CITY_OPTIONS[0],
    description: listing?.description || "",
    attrs: listing?.attrs ? { ...listing.attrs } : {},
    images: listing?.images ? [...listing.images] : [],
    status: listing?.status || "Draft",
    featured: listing?.featured || false,
  };
}

const SectionLabel = ({ children }) => (
  <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 1 }}>
    {children}
  </Typography>
);

export default function ListingFormDialog({ open, listing, onClose, onSubmit }) {
  const vendors = useSelector((s) => s.vendors.items);
  const [f, setF] = useState(() => blankForm(listing, vendors));

  useEffect(() => {
    if (open) setF(blankForm(listing, vendors));
  }, [open, listing, vendors]);

  const category = getCategory(f.categoryId) || CATEGORY_TREE[0];
  const allowedTypes = category.allowedTypes || [];
  const attrFields = fieldsFor(f.categoryId);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setAttr = (k, v) => setF((s) => ({ ...s, attrs: { ...s.attrs, [k]: v } }));
  const setPrice = (type, k, v) =>
    setF((s) => ({ ...s, pricing: { ...s.pricing, [type]: { ...s.pricing[type], [k]: v } } }));

  // Switching category: reset subcategory and drop any now-disallowed types.
  const onCategory = (categoryId) => {
    const c = getCategory(categoryId);
    setF((s) => ({
      ...s,
      categoryId,
      subcategoryId: "",
      types: s.types.filter((t) => c.allowedTypes.includes(t)),
      attrs: {},
    }));
  };

  const toggleType = (t) =>
    setF((s) => ({
      ...s,
      types: s.types.includes(t) ? s.types.filter((x) => x !== t) : [...s.types, t],
    }));

  const isEdit = Boolean(listing);
  const pricingValid = f.types.every((t) => String(f.pricing[t]?.amount).trim() !== "");
  const canSave =
    f.vendorId && f.title.trim() && f.categoryId && f.subcategoryId && f.types.length > 0 && pricingValid;

  const submit = () => {
    // keep pricing only for selected types, coerce numbers
    const pricing = {};
    for (const t of f.types) {
      const p = f.pricing[t];
      pricing[t] = { amount: Number(p.amount) };
      if (p.unit) pricing[t].unit = p.unit;
      if (t === "rent" && String(p.deposit).trim() !== "") pricing[t].deposit = Number(p.deposit);
    }
    onSubmit({
      vendorId: f.vendorId,
      title: f.title.trim(),
      categoryId: f.categoryId,
      subcategoryId: f.subcategoryId,
      types: f.types,
      pricing,
      city: f.city,
      description: f.description.trim(),
      attrs: f.attrs,
      images: f.images,
      status: f.status,
      featured: f.featured,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? `Edit listing — ${listing.title}` : "Add listing"}
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.25 }}>
          <CategoryIcon category={category.name} fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {category.name} · pricing adapts to the selected types
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <SectionLabel>Listing details</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Title" size="small" required value={f.title} onChange={(e) => set("title", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />

          <TextField label="Vendor" size="small" select required value={f.vendorId} onChange={(e) => set("vendorId", e.target.value)}>
            {vendors.map((v) => (
              <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
            ))}
          </TextField>

          <TextField label="City" size="small" select value={f.city} onChange={(e) => set("city", e.target.value)}>
            {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>

          <TextField label="Category" size="small" select value={f.categoryId} onChange={(e) => onCategory(e.target.value)}>
            {CATEGORY_TREE.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <span>{c.emoji}</span><span>{c.name}</span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>

          <TextField label="Subcategory" size="small" select required value={f.subcategoryId} onChange={(e) => set("subcategoryId", e.target.value)}>
            {category.subcategories.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Types (limited to what the category allows) */}
        <SectionLabel>Listing type</SectionLabel>
        <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap" }}>
          {allowedTypes.map((t) => (
            <FormControlLabel
              key={t}
              control={<Checkbox checked={f.types.includes(t)} onChange={() => toggleType(t)} />}
              label={TYPE_LABELS[t]}
            />
          ))}
        </Stack>
        {f.types.length === 0 && (
          <Typography variant="caption" color="text.secondary">Pick at least one type this listing is offered as.</Typography>
        )}

        {/* Per-type pricing */}
        {f.types.length > 0 && (
          <>
            <SectionLabel>Pricing</SectionLabel>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {f.types.includes("rent") && (
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, alignItems: "center" }}>
                  <Chip label="Rent" size="small" sx={{ fontWeight: 700, bgcolor: "#e0edff", color: "#1d4ed8", width: "fit-content" }} />
                  <TextField label="Rent price" size="small" type="number" value={f.pricing.rent.amount} onChange={(e) => setPrice("rent", "amount", e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
                  <TextField label="Unit" size="small" value={f.pricing.rent.unit} onChange={(e) => setPrice("rent", "unit", e.target.value)} placeholder="per event" />
                  <TextField label="Security deposit" size="small" type="number" value={f.pricing.rent.deposit} onChange={(e) => setPrice("rent", "deposit", e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} sx={{ gridColumn: { sm: "2 / 3" } }} />
                </Box>
              )}
              {f.types.includes("purchase") && (
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, alignItems: "center" }}>
                  <Chip label="Purchase" size="small" sx={{ fontWeight: 700, bgcolor: "#dcfce7", color: "#15803d", width: "fit-content" }} />
                  <TextField label="Purchase price" size="small" type="number" value={f.pricing.purchase.amount} onChange={(e) => setPrice("purchase", "amount", e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
                </Box>
              )}
              {f.types.includes("service") && (
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, alignItems: "center" }}>
                  <Chip label="Service" size="small" sx={{ fontWeight: 700, bgcolor: "#ede9fe", color: "#6d28d9", width: "fit-content" }} />
                  <TextField label="Service price" size="small" type="number" value={f.pricing.service.amount} onChange={(e) => setPrice("service", "amount", e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
                  <TextField label="Unit" size="small" value={f.pricing.service.unit} onChange={(e) => setPrice("service", "unit", e.target.value)} placeholder="per event" />
                </Box>
              )}
            </Stack>
          </>
        )}

        {/* Category-template attributes */}
        {attrFields.length > 0 && (
          <>
            <SectionLabel>{category.name} details</SectionLabel>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
              {attrFields.map((field) =>
                field.type === "select" ? (
                  <TextField key={field.name} label={field.label} size="small" select value={f.attrs[field.name] || ""} onChange={(e) => setAttr(field.name, e.target.value)}>
                    {field.options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                  </TextField>
                ) : (
                  <TextField
                    key={field.name}
                    label={field.label}
                    size="small"
                    type={field.type === "number" ? "number" : "text"}
                    value={f.attrs[field.name] || ""}
                    onChange={(e) => setAttr(field.name, e.target.value)}
                    slotProps={field.suffix ? { input: { endAdornment: <InputAdornment position="end">{field.suffix}</InputAdornment> } } : undefined}
                  />
                ),
              )}
            </Box>
          </>
        )}

        {/* Description + status */}
        <SectionLabel>Description &amp; status</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr", mt: 1 }}>
          <TextField label="Description" size="small" multiline minRows={2} value={f.description} onChange={(e) => set("description", e.target.value)} />
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField label="Status" size="small" select value={f.status} onChange={(e) => set("status", e.target.value)}>
              {LISTING_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <FormControlLabel control={<Checkbox checked={f.featured} onChange={(e) => set("featured", e.target.checked)} />} label="Featured listing" />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={submit}>
          {isEdit ? "Save listing" : "Add listing"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}