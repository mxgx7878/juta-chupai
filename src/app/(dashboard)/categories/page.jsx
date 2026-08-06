"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { alpha } from "@mui/material/styles";
import PageHeader from "@/components/layout/PageHeader";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { VENDOR_CATEGORIES } from "@/config/vendorCategories";
import { ICON_OPTIONS, ICON_REGISTRY, CATEGORY_COLORS, getCategoryIcon } from "@/config/categoryIcons";
import { categoriesActions } from "@/store";
import { notify } from "@/store/uiSlice";

const emptyForm = { name: "", iconKey: "celebration", color: CATEGORY_COLORS[0], services: [] };

export default function CategoriesPage() {
  const categories = useSelector((s) => s.categories.items);
  const vendors = useSelector((s) => s.vendors.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const countFor = (name) => vendors.filter((v) => v.category === name).length;
  const openAdd = () => { setForm(emptyForm); setOpen(true); };

  const save = () => {
    dispatch(categoriesActions.add({ name: form.name.trim(), iconKey: form.iconKey, color: form.color, services: form.services }));
    dispatch(notify(`Category “${form.name.trim()}” created`));
    setOpen(false);
  };

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="Categories"
        subtitle="Create categories here — each one becomes selectable in the vendor form and defines its extra fields."
        action={
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}>
            Add category
          </Button>
        }
      />

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)", xl: "repeat(3,1fr)" } }}>
        {categories.map((c) => {
          const schema = VENDOR_CATEGORIES[c.name];
          const fields = schema?.fields || [];
          const services = c.services?.length ? c.services : schema?.services || [];
          const count = countFor(c.name);
          return (
            <Card key={c.name} sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar variant="rounded" sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: alpha(c.color, 0.14) }}>
                  <CategoryIcon category={c.name} fontSize="medium" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography variant="h6" fontWeight={700}>
                      {c.name}
                    </Typography>
                    {c.custom && <Chip size="small" label="Custom" sx={{ bgcolor: "grey.100", fontWeight: 600 }} />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {count} vendor{count === 1 ? "" : "s"} listed
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => { dispatch(categoriesActions.remove(c.name)); dispatch(notify({ message: `${c.name} removed`, severity: "info" })); }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mb: 1, color: "text.secondary" }}>
                <TuneRoundedIcon sx={{ fontSize: 16 }} />
                <Typography variant="overline">Form fields for this category</Typography>
              </Stack>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
                {fields.map((fld) => (
                  <Chip key={fld.name} label={fld.label} size="small" sx={{ bgcolor: alpha(c.color, 0.1), color: c.color, fontWeight: 600 }} />
                ))}
                {fields.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Custom category · no extra fields.
                  </Typography>
                )}
              </Stack>

              {services.length > 0 && (
                <>
                  <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2, mb: 1 }}>
                    Suggested services
                  </Typography>
                  <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
                    {services.slice(0, 5).map((s) => (
                      <Chip key={s} label={s} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </>
              )}

              <Button fullWidth variant="outlined" color="inherit" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 2.5 }} onClick={() => router.push(`/vendors?cat=${encodeURIComponent(c.name)}`)}>
                View {c.name} vendors
              </Button>
            </Card>
          );
        })}
      </Box>

      {/* Add category dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add category</DialogTitle>
        <DialogContent dividers>
          <TextField label="Category name" fullWidth size="small" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} sx={{ mt: 1 }} />

          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2.5, mb: 1 }}>
            Icon
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1 }}>
            {ICON_OPTIONS.map((key) => {
              const Icon = ICON_REGISTRY[key];
              const active = form.iconKey === key;
              return (
                <IconButton
                  key={key}
                  onClick={() => setForm((f) => ({ ...f, iconKey: key }))}
                  sx={{
                    border: "1px solid",
                    borderColor: active ? form.color : "divider",
                    borderRadius: 2,
                    bgcolor: active ? alpha(form.color, 0.12) : "transparent",
                    color: active ? form.color : "text.secondary",
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              );
            })}
          </Box>

          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2.5, mb: 1 }}>
            Colour
          </Typography>
          <Stack direction="row" spacing={1}>
            {CATEGORY_COLORS.map((col) => (
              <Box
                key={col}
                onClick={() => setForm((f) => ({ ...f, color: col }))}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  bgcolor: col,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: form.color === col ? "2px solid" : "none",
                  outlineColor: col,
                  outlineOffset: 2,
                }}
              >
                {form.color === col && <CheckRoundedIcon sx={{ fontSize: 16, color: "#fff" }} />}
              </Box>
            ))}
          </Stack>

          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2.5, mb: 1 }}>
            Suggested services
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={[]}
            value={form.services}
            onChange={(_, v) => setForm((f) => ({ ...f, services: v }))}
            renderInput={(params) => <TextField {...params} placeholder="Add a service and press Enter" />}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="inherit" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" disabled={!form.name.trim()} onClick={save}>
            Create category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
