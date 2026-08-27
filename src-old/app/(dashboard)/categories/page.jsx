"use client";

import { useState, useMemo } from "react";
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
import InputBase from "@mui/material/InputBase";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { alpha } from "@mui/material/styles";
import PageHeader from "@/components/layout/PageHeader";
import { ICON_OPTIONS, ICON_REGISTRY, CATEGORY_COLORS, getCategoryIcon } from "@/config/categoryIcons";
import { FIELD_TEMPLATES, TYPE_LABELS, LISTING_TYPES } from "@/config/categoryTree";
import { categoriesActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { slugify, uniqueSlug } from "@/utils/slug";

const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};
const ALL_TYPES = [LISTING_TYPES.RENT, LISTING_TYPES.PURCHASE, LISTING_TYPES.SERVICE];
const TEMPLATE_KEYS = Object.keys(FIELD_TEMPLATES);

const emptyForm = { name: "", emoji: "🎉", iconKey: "celebration", color: CATEGORY_COLORS[0], allowedTypes: ["rent"], fieldTemplate: "generic" };

// small inline "add subcategory" control
function AddSub({ onAdd }) {
  const [v, setV] = useState("");
  const submit = () => { const t = v.trim(); if (t) { onAdd(t); setV(""); } };
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", px: 1.5, height: 34, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
        <InputBase placeholder="Add subcategory…" value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} sx={{ fontSize: 13, flex: 1 }} />
      </Box>
      <IconButton size="small" onClick={submit} disabled={!v.trim()}><AddRoundedIcon fontSize="small" /></IconButton>
    </Stack>
  );
}

export default function CategoriesPage() {
  const categories = useSelector((s) => s.categories.items);
  const listings = useSelector((s) => s.listings.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [dialog, setDialog] = useState({ open: false, edit: null });
  const [form, setForm] = useState(emptyForm);

  const countByCat = useMemo(() => {
    const m = {};
    listings.forEach((l) => { m[l.categoryId] = (m[l.categoryId] || 0) + 1; });
    return m;
  }, [listings]);

  const openAdd = () => { setForm(emptyForm); setDialog({ open: true, edit: null }); };
  const openEdit = (c) => {
    setForm({ name: c.name, emoji: c.emoji || "🎉", iconKey: c.iconKey, color: c.color, allowedTypes: [...(c.allowedTypes || [])], fieldTemplate: c.fieldTemplate || "generic" });
    setDialog({ open: true, edit: c });
  };
  const close = () => setDialog({ open: false, edit: null });

  const toggleType = (t) =>
    setForm((f) => ({ ...f, allowedTypes: f.allowedTypes.includes(t) ? f.allowedTypes.filter((x) => x !== t) : [...f.allowedTypes, t] }));

  const save = () => {
    const name = form.name.trim();
    if (dialog.edit) {
      dispatch(categoriesActions.update({ name: dialog.edit.name, emoji: form.emoji, iconKey: form.iconKey, color: form.color, allowedTypes: form.allowedTypes, fieldTemplate: form.fieldTemplate }));
      dispatch(notify(`“${name}” updated`));
    } else {
      const id = uniqueSlug(name, categories.map((c) => c.id));
      dispatch(categoriesActions.add({ id, name, emoji: form.emoji, iconKey: form.iconKey, color: form.color, allowedTypes: form.allowedTypes, fieldTemplate: form.fieldTemplate, subcategories: [] }));
      dispatch(notify(`Category “${name}” created`));
    }
    close();
  };

  const canSave = form.name.trim() && form.allowedTypes.length > 0;

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="Categories"
        subtitle="Manage the category tree — parents, subcategories, the listing types each allows, and its field template."
        action={<Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}>Add category</Button>}
      />

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)", xl: "repeat(3,1fr)" } }}>
        {categories.map((c) => {
          const Icon = getCategoryIcon(c.iconKey);
          const count = countByCat[c.id] || 0;
          const subs = c.subcategories || [];
          return (
            <Card key={c.id} sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar variant="rounded" sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: alpha(c.color, 0.14), color: c.color }}>
                  {c.emoji ? <Box sx={{ fontSize: 24 }}>{c.emoji}</Box> : <Icon />}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography variant="h6" fontWeight={700} noWrap>{c.name}</Typography>
                    {c.custom && <Chip size="small" label="Custom" sx={{ bgcolor: "grey.100", fontWeight: 600 }} />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {count} listing{count === 1 ? "" : "s"} · {subs.length} subcategor{subs.length === 1 ? "y" : "ies"}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => openEdit(c)}><EditRoundedIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => { dispatch(categoriesActions.remove(c.name)); dispatch(notify({ message: `${c.name} removed`, severity: "info" })); }}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              {/* allowed types */}
              <Stack direction="row" spacing={0.75} sx={{ mt: 1.5, flexWrap: "wrap", gap: 0.75 }}>
                {(c.allowedTypes || []).map((t) => (
                  <Chip key={t} size="small" label={TYPE_LABELS[t]} sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[t]?.bg, color: TYPE_COLORS[t]?.fg }} />
                ))}
                <Chip size="small" variant="outlined" label={`fields: ${c.fieldTemplate || "generic"}`} sx={{ fontWeight: 600 }} />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                Subcategories
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
                {subs.map((s) => (
                  <Chip
                    key={s.id}
                    label={s.name}
                    size="small"
                    onDelete={() => { dispatch(categoriesActions.removeSubcategory({ category: c.name, subId: s.id })); dispatch(notify({ message: `${s.name} removed`, severity: "info" })); }}
                    sx={{ bgcolor: alpha(c.color, 0.1), color: c.color, fontWeight: 600 }}
                  />
                ))}
                {subs.length === 0 && <Typography variant="caption" color="text.secondary">No subcategories yet.</Typography>}
              </Stack>
              <AddSub onAdd={(name) => { dispatch(categoriesActions.addSubcategory({ category: c.name, name })); dispatch(notify(`“${name}” added`)); }} />

              <Button fullWidth variant="outlined" color="inherit" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 2.5 }} onClick={() => router.push(`/vendors?cat=${encodeURIComponent(c.name)}`)}>
                View {c.name} vendors
              </Button>
            </Card>
          );
        })}
      </Box>

      {/* Add / edit category dialog */}
      <Dialog open={dialog.open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{dialog.edit ? `Edit — ${dialog.edit.name}` : "Add category"}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "80px 1fr", mt: 1 }}>
            <TextField label="Emoji" size="small" value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} />
            <TextField label="Category name" size="small" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} disabled={Boolean(dialog.edit)} helperText={dialog.edit ? "Renaming isn't supported here" : " "} />
          </Box>

          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 1.5, mb: 1 }}>Listing types allowed</Typography>
          <Stack direction="row" spacing={1}>
            {ALL_TYPES.map((t) => (
              <FormControlLabel key={t} control={<Checkbox checked={form.allowedTypes.includes(t)} onChange={() => toggleType(t)} />} label={TYPE_LABELS[t]} />
            ))}
          </Stack>

          <TextField label="Field template" size="small" select fullWidth value={form.fieldTemplate} onChange={(e) => setForm((f) => ({ ...f, fieldTemplate: e.target.value }))} sx={{ mt: 1 }}>
            {TEMPLATE_KEYS.map((k) => (
              <MenuItem key={k} value={k}>{k}{FIELD_TEMPLATES[k].length ? ` (${FIELD_TEMPLATES[k].map((x) => x.name).join(", ")})` : " (no extra fields)"}</MenuItem>
            ))}
          </TextField>

          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2.5, mb: 1 }}>Icon</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 1 }}>
            {ICON_OPTIONS.map((key) => {
              const IconC = ICON_REGISTRY[key];
              const active = form.iconKey === key;
              return (
                <IconButton key={key} onClick={() => setForm((f) => ({ ...f, iconKey: key }))} sx={{ border: "1px solid", borderColor: active ? form.color : "divider", borderRadius: 2, bgcolor: active ? alpha(form.color, 0.12) : "transparent", color: active ? form.color : "text.secondary" }}>
                  <IconC fontSize="small" />
                </IconButton>
              );
            })}
          </Box>

          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2.5, mb: 1 }}>Colour</Typography>
          <Stack direction="row" spacing={1}>
            {CATEGORY_COLORS.map((col) => (
              <Box key={col} onClick={() => setForm((f) => ({ ...f, color: col }))} sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: col, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", outline: form.color === col ? "2px solid" : "none", outlineColor: col, outlineOffset: 2 }}>
                {form.color === col && <CheckRoundedIcon sx={{ fontSize: 16, color: "#fff" }} />}
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="inherit" onClick={close}>Cancel</Button>
          <Button variant="contained" disabled={!canSave} onClick={save}>{dialog.edit ? "Save changes" : "Create category"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}