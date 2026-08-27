"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import UnpublishedRoundedIcon from "@mui/icons-material/UnpublishedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MuiLink from "@mui/material/Link";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import RowMenu from "@/components/ui/RowMenu";
import { CategoryLabel } from "@/components/ui/CategoryIcon";
import ListingFormDialog from "@/components/listing/ListingFormDialog";
import { listingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { getCategory, getSubcategory, TYPE_LABELS } from "@/config/categoryTree";
import { priceLabel, typeChips } from "@/utils/listing";
import { uniqueSlug } from "@/utils/slug";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];
const STATUS_TABS = ["All", "Published", "Draft"];
const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function VendorListingsPage() {
  const vendorId = useSelector((s) => s.session.vendorId);
  const allListings = useSelector((s) => s.listings.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [statusTab, setStatusTab] = useState(0);
  const [dialog, setDialog] = useState({ open: false, listing: null });

  const myListings = useMemo(() => allListings.filter((l) => l.vendorId === vendorId), [allListings, vendorId]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return myListings.filter((l) => {
      const okStatus = statusTab === 0 || l.status === STATUS_TABS[statusTab];
      const okQ = !t || l.title.toLowerCase().includes(t);
      return okStatus && okQ;
    });
  }, [myListings, statusTab, q]);

  const published = myListings.filter((l) => l.status === "Published").length;

  const togglePublish = (l) => {
    const next = l.status === "Published" ? "Draft" : "Published";
    dispatch(listingsActions.setStatus({ id: l.id, status: next }));
    dispatch(notify(next === "Published" ? `${l.title} published` : `${l.title} moved to draft`));
  };

  const submit = (data) => {
    if (dialog.listing) {
      dispatch(listingsActions.update({ ...dialog.listing, ...data }));
      dispatch(notify("Listing updated"));
    } else {
      const id = uniqueSlug(data.title, allListings.map((l) => l.id));
      dispatch(listingsActions.add({ id, ...data, vendorId }));
      dispatch(notify("Listing added"));
    }
  };

  return (
    <Box>
      <PageHeader
        overline="Vendor"
        title="My Listings"
        subtitle={`${myListings.length} listing${myListings.length === 1 ? "" : "s"} · ${published} published`}
        action={
          <Button variant="contained" startIcon={<AddBoxRoundedIcon />} onClick={() => setDialog({ open: true, listing: null })}>
            Add listing
          </Button>
        }
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" }, mb: 2 }}>
          <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
            {STATUS_TABS.map((t) => <Tab key={t} label={t} />)}
          </Tabs>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, width: { xs: "100%", md: 260 }, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search my listings…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 820 }}>
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
                        <Avatar variant="rounded" sx={{ bgcolor: AV[i % AV.length], borderRadius: 2, width: 38, height: 38, fontSize: 14 }}>{l.title[0]}</Avatar>
                        <MuiLink component="button" underline="hover" onClick={() => router.push(`/vendor/listings/${l.id}`)} sx={{ fontWeight: 700, color: "text.primary", textAlign: "left" }}>{l.title}</MuiLink>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      <CategoryLabel category={cat?.name} />
                      {sub && <Typography variant="caption" color="text.secondary" sx={{ display: "block", ml: 3.5 }}>{sub.name}</Typography>}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                        {typeChips(l).map((c) => (
                          <Chip key={c.type} label={c.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type].bg, color: TYPE_COLORS[c.type].fg }} />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{priceLabel(l)}</TableCell>
                    <TableCell><StatusChip status={l.status} /></TableCell>
                    <TableCell align="right">
                      <RowMenu
                        actions={[
                          { label: "Open listing", icon: <VisibilityRoundedIcon fontSize="small" />, onClick: () => router.push(`/vendor/listings/${l.id}`) },
                          { label: "Edit", icon: <EditRoundedIcon fontSize="small" />, onClick: () => setDialog({ open: true, listing: l }) },
                          l.status === "Published"
                            ? { label: "Move to draft", icon: <UnpublishedRoundedIcon fontSize="small" />, onClick: () => togglePublish(l) }
                            : { label: "Publish", icon: <PublishRoundedIcon fontSize="small" />, onClick: () => togglePublish(l) },
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
                    {myListings.length === 0 ? "You haven't added any listings yet." : "No listings match these filters."}
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
        lockVendorId={vendorId}
        onClose={() => setDialog({ open: false, listing: null })}
        onSubmit={submit}
      />
    </Box>
  );
}