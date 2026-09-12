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
import InputBase from "@mui/material/InputBase";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { alpha } from "@mui/material/styles";
import PageHeader from "@/components/layout/PageHeader";
import { ICON_OPTIONS, ICON_REGISTRY, CATEGORY_COLORS, getCategoryIcon } from "@/config/categoryIcons";
import { VERTICAL_OPTIONS, VERTICAL_LABELS, VERTICALS } from "@/config/categoryTree";
import { categoriesActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { uniqueSlug } from "@/utils/slug";

const VERTICAL_COLORS = {
  hall: { bg: "#e0edff", fg: "#1d4ed8" },
  catering: { bg: "#fef3c7", fg: "#b45309" },
  generic: { bg: "#f1f5f9", fg: "#64748b" },
};

const FILTERS = ["All", "Hall / Venue", "Catering", "Generic"];
const FILTER_VERTICAL = [null, VERTICALS.HALL, VERTICALS.CATERING, VERTICALS.GENERIC];

const emptyForm = {
  name: "",
  emoji: "\u{1F389}",
  iconKey: "celebration",
  color: CATEGORY_COLORS[0],
  vertical: VERTICALS.GENERIC,
};

// small inline "add subcategory" control
function AddSub({ onAdd }) {
  const [v, setV] = useState("");
  const submit = () => { const t = v.trim(); if (t) { onAdd(t); setV(""); } };
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", px: 1.5, height: 34, flex: 1, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
        <InputBase placeholder="Add subcategory\u2026" value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} sx={{ fontSize: 13, flex: 1 }} />
      </Box>
      <IconButton size="small" onClick={submit} disabled={!v.trim()}><AddRoundedIcon fontSize="small" /></IconButton>
    </Stack>
  );
}

export default function CategoriesPage() {
  const categories = useSelector((s) => s.categories.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [dialog, setDialog] = useState({ open: false, edit: null });
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState(0);

  const vFilter = FILTER_VERTICAL[filter];
  const rows = vFilter ? categories.filter((c) => (c.vertical || VERTICALS.GENERIC) === vFilter) : categories;

  const openAdd = () => { setForm(emptyForm); setDialog({ open: true, edit: null }); };
  const openEdit = (c) => {
    setForm({
      name: c.name,
      emoji: c.emoji || "\u{1F389}",
      iconKey: c.iconKey,
      color: c.color,
      vertical: c.vertical || VERTICALS.GENERIC,
    });
    setDialog({ open: true, edit: c });
  };
  const close = () => setDialog({ open: false, edit: null });

  const save = () => {
    const name = form.name.trim();
    if (dialog.edit) {
      dispatch(categoriesActions.update({
        name: dialog.edit.name, emoji: form.emoji, iconKey: form.iconKey, color: form.color, vertical: form.vertical,
      }));
      dispatch(notify(`\u201C${name}\u201D updated`));
    } else {
      const id = uniqueSlug(name, categories.map((c) => c.id));
      dispatch(categoriesActions.add({
        id, name, emoji: form.emoji, iconKey: form.iconKey, color: form.color, vertical: form.vertical, subcategories: [],
      }));
      dispatch(notify(`Category \u201C${name}\u201D created`));
    }
    close();
  };

  const canSave = Boolean(form.name.trim());

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="Categories"
        subtitle="Manage the category tree \u2014 parents, subcategories, and the vertical each belongs to."
        action={<Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}>Add category</Button>}
      />

      <Card sx={{ p: { xs: 1.5, md: 2 }, mb: 3 }}>
        <Tabs value={filter} onChange={(_, v) => setFilter(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
          {FILTERS.map((t) => <Tab key={t} label={t} />)}
        </Tabs>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)", xl: "repeat(3,1fr)" } }}>
        {rows.map((c) => {
          const Icon = getCategoryIcon(c.iconKey);
          const subs = c.subcategories || [];
          const vert = c.vertical || VERTICALS.GENERIC;
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
                    {subs.length} subcategor{subs.length === 1 ? "y" : "ies"}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => openEdit(c)}><EditRoundedIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => { dispatch(categoriesActions.remove(c.name)); dispatch(notify({ message: `${c.name} removed`, severity: "info" })); }}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              {/* vertical */}
              <Stack direction="row" spacing={0.75} sx={{ mt: 1.5, flexWrap: "wrap", gap: 0.75 }}>
                <Chip size="small" label={VERTICAL_LABELS[vert]} sx={{ fontWeight: 700, bgcolor: VERTICAL_COLORS[vert]?.bg, color: VERTICAL_COLORS[vert]?.fg }} />
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
              <AddSub onAdd={(name) => { dispatch(categoriesActions.addSubcategory({ category: c.name, name })); dispatch(notify(`\u201C${name}\u201D added`)); }} />

              <Button fullWidth variant="outlined" color="inherit" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 2.5 }} onClick={() => router.push(`/vendors?cat=${encodeURIComponent(c.name)}`)}>
                View {c.name} vendors
              </Button>
            </Card>
          );
        })}
        {rows.length === 0 && (
          <Card sx={{ p: 6, textAlign: "center", gridColumn: "1 / -1" }}>
            <Typography color="text.secondary">No categories in this vertical.</Typography>
          </Card>
        )}
      </Box>

      {/* Add / edit category dialog */}
      <Dialog open={dialog.open} onClose={close} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{dialog.edit ? `Edit \u2014 ${dialog.edit.name}` : "Add category"}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "80px 1fr", mt: 1 }}>
            <TextField label="Emoji" size="small" value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} />
            <TextField label="Category name" size="small" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} disabled={Boolean(dialog.edit)} helperText={dialog.edit ? "Renaming isn't supported here" : " "} />
          </Box>

          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 1.5, mb: 1 }}>Vertical</Typography>
          <TextField
            size="small"
            select
            fullWidth
            value={form.vertical}
            onChange={(e) => setForm((f) => ({ ...f, vertical: e.target.value }))}
            helperText={VERTICAL_OPTIONS.find((v) => v.id === form.vertical)?.hint || " "}
          >
            {VERTICAL_OPTIONS.map((v) => (
              <MenuItem key={v.id} value={v.id}>{v.label}</MenuItem>
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
