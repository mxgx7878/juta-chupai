"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import UnpublishedRoundedIcon from "@mui/icons-material/UnpublishedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Button from "@mui/material/Button";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import MuiLink from "@mui/material/Link";
import PageHeader from "@/components/layout/PageHeader";
import ListingFormDialog from "@/components/listing/ListingFormDialog";
import StatusChip from "@/components/ui/StatusChip";
import RowMenu from "@/components/ui/RowMenu";
import { CategoryLabel } from "@/components/ui/CategoryIcon";
import { listingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { CATEGORY_TREE, getCategory, getSubcategory, TYPE_LABELS } from "@/config/categoryTree";
import { priceLabel, typeChips } from "@/utils/listing";
import { uniqueSlug } from "@/utils/slug";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];
const STATUS_TABS = ["All", "Published", "Draft", "Pending", "Rejected"];
const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function ListingsPage() {
  const listings = useSelector((s) => s.listings.items);
  const vendors = useSelector((s) => s.vendors.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [statusTab, setStatusTab] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [dialog, setDialog] = useState({ open: false, listing: null });

  const vendorName = useMemo(() => {
    const map = {};
    vendors.forEach((v) => { map[v.id] = v.name; });
    return map;
  }, [vendors]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return listings.filter((l) => {
      const okStatus = statusTab === 0 || l.status === STATUS_TABS[statusTab];
      const okType = typeFilter === "all" || (l.types || []).includes(typeFilter);
      const okCat = catFilter === "all" || l.categoryId === catFilter;
      const vname = (vendorName[l.vendorId] || "").toLowerCase();
      const okQ = !t || l.title.toLowerCase().includes(t) || vname.includes(t) || (l.city || "").toLowerCase().includes(t);
      return okStatus && okType && okCat && okQ;
    });
  }, [listings, statusTab, typeFilter, catFilter, q, vendorName]);

  const publishedCount = listings.filter((l) => l.status === "Published").length;

  const togglePublish = (l) => {
    const next = l.status === "Published" ? "Draft" : "Published";
    dispatch(listingsActions.setStatus({ id: l.id, status: next }));
    dispatch(notify(next === "Published" ? `${l.title} published` : `${l.title} moved to draft`));
  };

  const submitListing = (data) => {
    if (dialog.listing) {
      dispatch(listingsActions.update({ ...dialog.listing, ...data }));
      dispatch(notify("Listing updated"));
    } else {
      const id = uniqueSlug(data.title, listings.map((l) => l.id));
      dispatch(listingsActions.add({ id, ...data }));
      dispatch(notify("Listing added"));
    }
  };

  return (
    <Box>
      <PageHeader
        overline="Marketplace"
        title="Listings"
        subtitle={`${listings.length} listings · ${publishedCount} published`}
        action={
          <Button variant="contained" startIcon={<AddBoxRoundedIcon />} onClick={() => setDialog({ open: true, listing: null })}>
            Add listing
          </Button>
        }
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        {/* Filters */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" }, mb: 2 }}>
          <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
            {STATUS_TABS.map((t) => <Tab key={t} label={t} />)}
          </Tabs>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, width: { xs: "100%", md: 260 }, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search listings…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
          <Select size="small" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ minWidth: 150 }}>
            <MenuItem value="all">All types</MenuItem>
            <MenuItem value="rent">{TYPE_LABELS.rent}</MenuItem>
            <MenuItem value="purchase">{TYPE_LABELS.purchase}</MenuItem>
            <MenuItem value="service">{TYPE_LABELS.service}</MenuItem>
          </Select>
          <Select size="small" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} sx={{ minWidth: 200 }}>
            <MenuItem value="all">All categories</MenuItem>
            {CATEGORY_TREE.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.emoji} {c.name}</MenuItem>
            ))}
          </Select>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow>
                <TableCell>Listing</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Starting price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((l, i) => {
                const cat = getCategory(l.categoryId);
                const sub = getSubcategory(l.subcategoryId);
                return (
                  <TableRow key={l.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                        <Avatar variant="rounded" sx={{ bgcolor: AV[i % AV.length], borderRadius: 2, width: 38, height: 38, fontSize: 14 }}>
                          {l.title[0]}
                        </Avatar>
                        <Box>
                          <MuiLink component="button" underline="hover" onClick={() => router.push(`/listings/${l.id}`)} sx={{ fontWeight: 700, color: "text.primary", textAlign: "left" }}>{l.title}</MuiLink>
                          <Typography variant="caption" color="text.secondary">
                            {vendorName[l.vendorId] || "Unknown vendor"} · {l.city}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      <CategoryLabel category={cat?.name} />
                      {sub && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 3.5 }}>
                          {sub.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                        {typeChips(l).map((c) => (
                          <Chip key={c.type} label={c.label} size="small"
                            sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type].bg, color: TYPE_COLORS[c.type].fg }} />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{priceLabel(l)}</TableCell>
                    <TableCell><StatusChip status={l.status} /></TableCell>
                    <TableCell align="right">
                      <RowMenu
                        actions={[
                          { label: "Open listing", icon: <VisibilityRoundedIcon fontSize="small" />, onClick: () => router.push(`/listings/${l.id}`) },
                          { label: "Preview vendor", icon: <StorefrontRoundedIcon fontSize="small" />, onClick: () => router.push(`/vendors/${l.vendorId}`) },
                          l.status === "Published"
                            ? { label: "Move to draft", icon: <UnpublishedRoundedIcon fontSize="small" />, onClick: () => togglePublish(l) }
                            : { label: "Publish", icon: <PublishRoundedIcon fontSize="small" />, onClick: () => togglePublish(l) },
                          { label: "Edit listing", icon: <EditRoundedIcon fontSize="small" />, onClick: () => setDialog({ open: true, listing: l }) },
                          { label: "Delete", icon: <DeleteOutlineRoundedIcon fontSize="small" />, danger: true, onClick: () => { dispatch(listingsActions.remove(l.id)); dispatch(notify({ message: "Listing deleted", severity: "info" })); } },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    No listings match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <ListingFormDialog
        open={dialog.open}
        listing={dialog.listing}
        onClose={() => setDialog({ open: false, listing: null })}
        onSubmit={submitListing}
      />
    </Box>
  );
}