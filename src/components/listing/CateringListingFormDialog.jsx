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
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { CITY_OPTIONS } from "@/config/cities";
import { categoriesByVertical, VERTICALS } from "@/config/categoryTree";

const SERVICE_STYLES = ["Buffet", "Plated", "Live stations", "Family style", "Boxed / delivery"];
const CUISINE_SUGGESTIONS = ["Pakistani", "Mughlai", "BBQ", "Continental", "Italian", "Chinese", "Desserts", "Afghani"];

const newDeal = () => ({ id: `deal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: "", perHead: "", minGuests: "", includes: [] });
const newMenu = () => ({ id: `menu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: "", perHead: "", sections: [{ name: "", items: [] }] });

function blankForm(listing, cats) {
  const c = listing?.catering || {};
  return {
    title: listing?.title || "",
    categoryId: listing?.categoryId || cats[0]?.id || "catering",
    subcategoryId: listing?.subcategoryId || "",
    city: listing?.city || CITY_OPTIONS[0],
    description: listing?.description || "",
    status: listing?.status || "Draft",
    minGuests: c.minGuests ?? "",
    maxGuests: c.maxGuests ?? "",
    serviceStyle: c.serviceStyle || SERVICE_STYLES[0],
    cuisines: c.cuisines ? [...c.cuisines] : [],
    perHeadFrom: c.perHeadFrom ?? "",
    staffing: c.staffing || "",
    travelsTo: c.travelsTo || "",
    notice: c.notice || "",
    deals: c.deals?.length ? c.deals.map((d) => ({ ...d, includes: [...(d.includes || [])] })) : [newDeal()],
    menus: c.menus?.length
      ? c.menus.map((m) => ({ ...m, sections: (m.sections || []).map((s) => ({ ...s, items: [...(s.items || [])] })) }))
      : [newMenu()],
  };
}

const SectionLabel = ({ children }) => (
  <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2 }}>{children}</Typography>
);

export default function CateringListingFormDialog({ open, listing, onClose, onSubmit }) {
  const storeCategories = useSelector((s) => s.categories.items);
  const fromStore = storeCategories.filter((c) => (c.vertical || VERTICALS.GENERIC) === VERTICALS.CATERING);
  const cats = fromStore.length ? fromStore : categoriesByVertical(VERTICALS.CATERING);

  const [f, setF] = useState(() => blankForm(listing, cats));
  useEffect(() => { if (open) setF(blankForm(listing, cats)); /* eslint-disable-next-line */ }, [open, listing]);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const subs = cats.find((c) => c.id === f.categoryId)?.subcategories || [];

  /* deals */
  const setDeal = (i, k, v) => setF((s) => ({ ...s, deals: s.deals.map((d, x) => (x === i ? { ...d, [k]: v } : d)) }));
  const addDeal = () => setF((s) => ({ ...s, deals: [...s.deals, newDeal()] }));
  const removeDeal = (i) => setF((s) => ({ ...s, deals: s.deals.filter((_, x) => x !== i) }));

  /* menus */
  const setMenu = (i, k, v) => setF((s) => ({ ...s, menus: s.menus.map((m, x) => (x === i ? { ...m, [k]: v } : m)) }));
  const addMenu = () => setF((s) => ({ ...s, menus: [...s.menus, newMenu()] }));
  const removeMenu = (i) => setF((s) => ({ ...s, menus: s.menus.filter((_, x) => x !== i) }));
  const setSection = (mi, si, k, v) =>
    setF((s) => ({ ...s, menus: s.menus.map((m, x) => x === mi
      ? { ...m, sections: m.sections.map((sec, y) => (y === si ? { ...sec, [k]: v } : sec)) } : m) }));
  const addSection = (mi) =>
    setF((s) => ({ ...s, menus: s.menus.map((m, x) => (x === mi ? { ...m, sections: [...m.sections, { name: "", items: [] }] } : m)) }));
  const removeSection = (mi, si) =>
    setF((s) => ({ ...s, menus: s.menus.map((m, x) => (x === mi ? { ...m, sections: m.sections.filter((_, y) => y !== si) } : m)) }));

  const isEdit = Boolean(listing);
  const canSave = f.title.trim() && f.categoryId && f.perHeadFrom !== "";

  const submit = () => {
    onSubmit({
      title: f.title.trim(),
      categoryId: f.categoryId,
      subcategoryId: f.subcategoryId || "",
      city: f.city,
      description: f.description.trim(),
      status: f.status,
      vertical: VERTICALS.CATERING,
      catering: {
        minGuests: Number(f.minGuests) || 0,
        maxGuests: Number(f.maxGuests) || 0,
        serviceStyle: f.serviceStyle,
        cuisines: f.cuisines,
        perHeadFrom: Number(f.perHeadFrom) || 0,
        staffing: f.staffing.trim(),
        travelsTo: f.travelsTo.trim(),
        notice: f.notice.trim(),
        deals: f.deals
          .filter((d) => d.name.trim())
          .map((d) => ({ ...d, perHead: Number(d.perHead) || 0, minGuests: Number(d.minGuests) || 0 })),
        menus: f.menus
          .filter((m) => m.name.trim())
          .map((m) => ({
            ...m,
            perHead: Number(m.perHead) || 0,
            sections: m.sections.filter((s) => s.name.trim() || s.items.length),
          })),
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEdit ? `Edit package — ${listing.title}` : "Add a catering package"}
        <Typography variant="body2" color="text.secondary">
          Catering has no availability calendar — you can serve several events on the same date.
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <SectionLabel>Package details</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1 }}>
          <TextField label="Package name" size="small" required value={f.title} onChange={(e) => set("title", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
          <TextField label="Category" size="small" select value={f.categoryId} onChange={(e) => { set("categoryId", e.target.value); set("subcategoryId", ""); }}>
            {cats.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
          <TextField label="Type" size="small" select value={f.subcategoryId} onChange={(e) => set("subcategoryId", e.target.value)}>
            <MenuItem value="">—</MenuItem>
            {subs.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
          <TextField label="Base city" size="small" select value={f.city} onChange={(e) => set("city", e.target.value)}>
            {CITY_OPTIONS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Status" size="small" select value={f.status} onChange={(e) => set("status", e.target.value)}>
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Published">Published</MenuItem>
          </TextField>
          <TextField label="Description" size="small" multiline rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
        </Box>

        <SectionLabel>Service &amp; scale</SectionLabel>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, mt: 1 }}>
          <TextField label="Minimum guests" size="small" type="number" value={f.minGuests} onChange={(e) => set("minGuests", e.target.value)} />
          <TextField label="Maximum guests" size="small" type="number" value={f.maxGuests} onChange={(e) => set("maxGuests", e.target.value)} />
          <TextField label="Service style" size="small" select value={f.serviceStyle} onChange={(e) => set("serviceStyle", e.target.value)}>
            {SERVICE_STYLES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Starting price per head" size="small" type="number" required value={f.perHeadFrom} onChange={(e) => set("perHeadFrom", e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
          <TextField label="Staffing" size="small" placeholder="e.g. 1 waiter per 25 guests" value={f.staffing} onChange={(e) => set("staffing", e.target.value)} />
          <TextField label="Notice needed" size="small" placeholder="e.g. 10 days" value={f.notice} onChange={(e) => set("notice", e.target.value)} />
          <TextField label="Travels to" size="small" placeholder="Cities you serve" value={f.travelsTo} onChange={(e) => set("travelsTo", e.target.value)} sx={{ gridColumn: { sm: "1 / -1" } }} />
        </Box>
        <Autocomplete
          multiple freeSolo size="small" options={CUISINE_SUGGESTIONS}
          value={f.cuisines} onChange={(_, v) => set("cuisines", v)}
          renderInput={(params) => <TextField {...params} label="Cuisines" placeholder="Add and press Enter" sx={{ mt: 2 }} />}
        />

        {/* ---- DEALS ---- */}
        <Divider sx={{ mt: 3 }} />
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block" }}>Deals</Typography>
            <Typography variant="caption" color="text.secondary">Priced tiers a customer can pick when booking.</Typography>
          </Box>
          <Button size="small" startIcon={<AddRoundedIcon />} onClick={addDeal}>Add deal</Button>
        </Stack>
        <Stack spacing={2} sx={{ mt: 1.5 }}>
          {f.deals.map((d, i) => (
            <Box key={d.id} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <TextField label="Deal name" size="small" value={d.name} onChange={(e) => setDeal(i, "name", e.target.value)} sx={{ flex: 1 }} />
                <TextField label="Per head" size="small" type="number" value={d.perHead} onChange={(e) => setDeal(i, "perHead", e.target.value)} sx={{ width: 140 }}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
                <TextField label="Min guests" size="small" type="number" value={d.minGuests} onChange={(e) => setDeal(i, "minGuests", e.target.value)} sx={{ width: 120 }} />
                <IconButton size="small" onClick={() => removeDeal(i)} disabled={f.deals.length === 1}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Autocomplete
                multiple freeSolo size="small" options={[]}
                value={d.includes} onChange={(_, v) => setDeal(i, "includes", v)}
                renderInput={(params) => <TextField {...params} label="What's included" placeholder="Add an item and press Enter" sx={{ mt: 1.5 }} />}
              />
            </Box>
          ))}
        </Stack>

        {/* ---- MENUS ---- */}
        <Divider sx={{ mt: 3 }} />
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block" }}>Menus</Typography>
            <Typography variant="caption" color="text.secondary">The actual dishes, grouped into courses.</Typography>
          </Box>
          <Button size="small" startIcon={<AddRoundedIcon />} onClick={addMenu}>Add menu</Button>
        </Stack>
        <Stack spacing={2} sx={{ mt: 1.5 }}>
          {f.menus.map((m, mi) => (
            <Box key={m.id} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <TextField label="Menu name" size="small" value={m.name} onChange={(e) => setMenu(mi, "name", e.target.value)} sx={{ flex: 1 }} />
                <TextField label="Per head" size="small" type="number" value={m.perHead} onChange={(e) => setMenu(mi, "perHead", e.target.value)} sx={{ width: 140 }}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }} />
                <IconButton size="small" onClick={() => removeMenu(mi)} disabled={f.menus.length === 1}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                {m.sections.map((sec, si) => (
                  <Stack key={si} direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: { sm: "flex-start" } }}>
                    <TextField label="Course" size="small" placeholder="e.g. Mains" value={sec.name} onChange={(e) => setSection(mi, si, "name", e.target.value)} sx={{ width: { sm: 150 } }} />
                    <Autocomplete
                      multiple freeSolo size="small" options={[]} sx={{ flex: 1 }}
                      value={sec.items} onChange={(_, v) => setSection(mi, si, "items", v)}
                      renderTags={(value, getTagProps) => value.map((option, index) => {
                        const { key, ...rest } = getTagProps({ index });
                        return <Chip key={key} label={option} size="small" {...rest} />;
                      })}
                      renderInput={(params) => <TextField {...params} placeholder="Add a dish and press Enter" />}
                    />
                    <IconButton size="small" onClick={() => removeSection(mi, si)} disabled={m.sections.length === 1}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
              <Button size="small" startIcon={<AddRoundedIcon />} sx={{ mt: 1 }} onClick={() => addSection(mi)}>Add course</Button>
            </Box>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!canSave} onClick={submit}>{isEdit ? "Save package" : "Add package"}</Button>
      </DialogActions>
    </Dialog>
  );
}
