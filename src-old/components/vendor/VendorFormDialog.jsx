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
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { CATEGORY_NAMES, CITY_OPTIONS, categoryMeta } from "@/config/vendorCategories";
import CategoryIcon from "@/components/ui/CategoryIcon";

const emptyPackage = () => ({ name: "", price: "", detail: "" });

function blankForm(vendor) {
  return {
    name: vendor?.name || "",
    owner: vendor?.owner || "",
    category: vendor?.category || "Venues",
    city: vendor?.city || "Lahore",
    experience: vendor?.experience || "",
    hours: vendor?.hours || "",
    ig: vendor?.ig || "",
    fb: vendor?.fb || "",
    web: vendor?.web || "",
    services: vendor?.services || [],
    packages: vendor?.packages?.length ? vendor.packages.map((p) => ({ ...p })) : [emptyPackage()],
    attrs: vendor?.attrs ? { ...vendor.attrs } : {},
    gallery: vendor?.gallery ? [...vendor.gallery] : [],
  };
}

const SectionLabel = ({ children }) => (
  <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 1 }}>
    {children}
  </Typography>
);

export default function VendorFormDialog({ open, vendor, onClose, onSubmit }) {
  const categoryNames = useSelector((s) => s.categories.items.map((c) => c.name));
  const [f, setF] = useState(() => blankForm(vendor));

  useEffect(() => {
    if (open) setF(blankForm(vendor));
  }, [open, vendor]);

  const meta = categoryMeta(f.category);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const setAttr = (k, v) => setF((s) => ({ ...s, attrs: { ...s.attrs, [k]: v } }));

  const setPackage = (i, k, v) =>
    setF((s) => ({ ...s, packages: s.packages.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)) }));
  const addPackage = () => setF((s) => ({ ...s, packages: [...s.packages, emptyPackage()] }));
  const removePackage = (i) => setF((s) => ({ ...s, packages: s.packages.filter((_, idx) => idx !== i) }));

  const onFiles = (e) => {
    const urls = Array.from(e.target.files || []).map((file) => URL.createObjectURL(file));
    setF((s) => ({ ...s, gallery: [...s.gallery, ...urls] }));
    e.target.value = "";
  };
  const removeImage = (i) => setF((s) => ({ ...s, gallery: s.gallery.filter((_, idx) => idx !== i) }));

  const isEdit = Boolean(vendor);
  const canSave = f.name.trim() && f.owner.trim() && f.category;

  const submit = () => {
    const packages = f.packages.filter((p) => p.name.trim() || p.price.trim());
    onSubmit({ ...f, packages });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? `Edit vendor — ${vendor.name}` : "Add vendor"}
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.25 }}>
          <CategoryIcon category={f.category} fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {f.category} vendor · form adapts to the category
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <SectionLabel>Business details</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Business name" size="small" required value={f.name} onChange={(e) => set("name", e.target.value)} />
          <TextField label="Owner / contact" size="small" required value={f.owner} onChange={(e) => set("owner", e.target.value)} />
          <TextField label="Category" size="small" select value={f.category} onChange={(e) => set("category", e.target.value)}>
            {categoryNames.map((c) => (
              <MenuItem key={c} value={c}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <CategoryIcon category={c} fontSize="small" />
                  <span>{c}</span>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
          <TextField label="City" size="small" select value={f.city} onChange={(e) => set("city", e.target.value)}>
            {CITY_OPTIONS.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Experience" size="small" placeholder="e.g. 8 yrs" value={f.experience} onChange={(e) => set("experience", e.target.value)} />
          <TextField label="Business hours" size="small" placeholder="e.g. 10 AM – 11 PM" value={f.hours} onChange={(e) => set("hours", e.target.value)} />
        </Box>

        {/* Category-specific fields */}
        {meta.fields.length > 0 && (
          <>
            <SectionLabel>{f.category} details</SectionLabel>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
              {meta.fields.map((field) => {
                if (field.type === "multiselect") {
                  return (
                    <Autocomplete
                      key={field.name}
                      multiple
                      size="small"
                      options={field.options}
                      value={f.attrs[field.name] || []}
                      onChange={(_, v) => setAttr(field.name, v)}
                      renderInput={(params) => <TextField {...params} label={field.label} />}
                      sx={{ gridColumn: { sm: "1 / -1" } }}
                    />
                  );
                }
                if (field.type === "select") {
                  return (
                    <TextField
                      key={field.name}
                      label={field.label}
                      size="small"
                      select
                      value={f.attrs[field.name] || ""}
                      onChange={(e) => setAttr(field.name, e.target.value)}
                    >
                      {field.options.map((o) => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </TextField>
                  );
                }
                return (
                  <TextField
                    key={field.name}
                    label={field.label}
                    size="small"
                    type={field.type === "number" ? "number" : "text"}
                    value={f.attrs[field.name] || ""}
                    onChange={(e) => setAttr(field.name, e.target.value)}
                    slotProps={field.suffix ? { input: { endAdornment: <InputAdornment position="end">{field.suffix}</InputAdornment> } } : undefined}
                  />
                );
              })}
            </Box>
          </>
        )}

        {/* Services */}
        <SectionLabel>Services offered</SectionLabel>
        <Autocomplete
          multiple
          freeSolo
          size="small"
          options={meta.services}
          value={f.services}
          onChange={(_, v) => set("services", v)}
          renderInput={(params) => <TextField {...params} placeholder="Add a service and press Enter" sx={{ mt: 1 }} />}
        />

        {/* Packages */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <SectionLabel>Packages &amp; pricing</SectionLabel>
          <Button size="small" startIcon={<AddRoundedIcon />} onClick={addPackage}>
            Add package
          </Button>
        </Stack>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {f.packages.map((p, i) => (
            <Stack key={i} direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: { sm: "center" } }}>
              <TextField label="Package" size="small" value={p.name} onChange={(e) => setPackage(i, "name", e.target.value)} sx={{ width: { sm: 160 } }} />
              <TextField label="Price" size="small" value={p.price} onChange={(e) => setPackage(i, "price", e.target.value)} sx={{ width: { sm: 160 } }} />
              <TextField label="What's included" size="small" value={p.detail} onChange={(e) => setPackage(i, "detail", e.target.value)} sx={{ flex: 1 }} />
              <IconButton size="small" onClick={() => removePackage(i)} disabled={f.packages.length === 1}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        {/* Gallery */}
        <SectionLabel>Gallery / images</SectionLabel>
        <Box sx={{ mt: 1 }}>
          <Button component="label" variant="outlined" color="inherit" startIcon={<AddPhotoAlternateRoundedIcon />}>
            Upload images
            <input hidden type="file" accept="image/*" multiple onChange={onFiles} />
          </Button>
          {f.gallery.length > 0 && (
            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(auto-fill,minmax(96px,1fr))", mt: 2 }}>
              {f.gallery.map((src, i) => (
                <Box key={i} sx={{ position: "relative", aspectRatio: "1 / 1", borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
                  <Box component="img" src={src} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(i)}
                    sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(0,0,0,0.55)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.75)" } }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" disabled={!canSave} onClick={submit}>
          {isEdit ? "Save vendor" : "Add vendor"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
