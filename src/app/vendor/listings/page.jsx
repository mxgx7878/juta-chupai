"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import MuiLink from "@mui/material/Link";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import UnpublishedRoundedIcon from "@mui/icons-material/UnpublishedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import RowMenu from "@/components/ui/RowMenu";
import ListingFormDialog from "@/components/listing/ListingFormDialog";
import { listingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { pkr } from "@/utils/booking";
import { uniqueSlug } from "@/utils/slug";
import { vendorVertical, copyFor } from "@/utils/vertical";
import { VERTICALS } from "@/config/categoryTree";

const STATUS_TABS = ["All", "Published", "Draft"];

export default function VendorListingsPage() {
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === vendorId));
  const storeCategories = useSelector((s) => s.categories.items);
  const allListings = useSelector((s) => s.listings.items);
  const bookings = useSelector((s) => s.bookings.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [statusTab, setStatusTab] = useState(0);
  const [dialog, setDialog] = useState({ open: false, listing: null });

  const vertical = vendorVertical(vendor, storeCategories);
  const copy = copyFor(vertical);
  const isCatering = vertical === VERTICALS.CATERING;
  const enabled = vertical !== VERTICALS.GENERIC;

  const mine = useMemo(() => allListings.filter((l) => l.vendorId === vendorId), [allListings, vendorId]);
  const rows = useMemo(
    () => (statusTab === 0 ? mine : mine.filter((l) => l.status === STATUS_TABS[statusTab])),
    [mine, statusTab],
  );

  const bookingCount = (id) => bookings.filter((b) => b.listingId === id && b.status !== "Cancelled").length;
  const published = mine.filter((l) => l.status === "Published").length;

  const togglePublish = (l) => {
    const next = l.status === "Published" ? "Draft" : "Published";
    dispatch(listingsActions.setStatus({ id: l.id, status: next }));
    dispatch(notify(next === "Published" ? `${l.title} published` : `${l.title} moved to draft`));
  };

  const submit = (data) => {
    if (dialog.listing) {
      dispatch(listingsActions.update({ ...dialog.listing, ...data }));
      dispatch(notify(`${copy.listingNoun} updated`));
    } else {
      const id = uniqueSlug(data.title, allListings.map((l) => l.id));
      dispatch(listingsActions.add({ id, vendorId, images: [], featured: false, ...data }));
      dispatch(notify(`${copy.listingNoun} added`));
    }
  };

  if (!enabled) {
    return (
      <Box>
        <PageHeader overline="Vendor" title="My Listings" subtitle={vendor?.category} />
        <Card sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary">
            Listings aren&apos;t enabled for {vendor?.category} yet. Halls and catering are live so far.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        overline="Vendor"
        title={copy.navLabel}
        subtitle={
          isCatering
            ? `${mine.length} package${mine.length === 1 ? "" : "s"} · ${published} published. Catering doesn't block dates.`
            : `${mine.length} hall${mine.length === 1 ? "" : "s"} · ${published} published. Each hall keeps its own calendar.`
        }
        action={<Button variant="contained" startIcon={<AddBoxRoundedIcon />} onClick={() => setDialog({ open: true, listing: null })}>{copy.addLabel}</Button>}
      />

      <Card sx={{ p: { xs: 1.5, md: 2 }, mb: 2 }}>
        <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
          {STATUS_TABS.map((t) => <Tab key={t} label={t} />)}
        </Tabs>
      </Card>

      <Card sx={{ p: { xs: 1, md: 2 } }}>
        <TableContainer>
          <Table sx={{ minWidth: 820 }}>
            <TableHead>
              <TableRow>
                <TableCell>{copy.listingNoun}</TableCell>
                {isCatering ? (
                  <>
                    <TableCell align="center">Guests</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell align="center">Deals</TableCell>
                    <TableCell align="center">Menus</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="center">Capacity</TableCell>
                    <TableCell>Day rate</TableCell>
                    <TableCell>Night rate</TableCell>
                  </>
                )}
                <TableCell align="center">Bookings</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((l) => (
                <TableRow key={l.id} hover>
                  <TableCell>
                    <MuiLink component="button" underline="hover" onClick={() => router.push(`/vendor/listings/${l.id}`)} sx={{ fontWeight: 700, color: "text.primary", textAlign: "left" }}>
                      {l.title}
                    </MuiLink>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {l.city} · {isCatering ? l.catering?.serviceStyle : l.hall?.setting}
                    </Typography>
                  </TableCell>
                  {isCatering ? (
                    <>
                      <TableCell align="center">{l.catering?.minGuests}–{l.catering?.maxGuests}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{pkr(l.catering?.perHeadFrom)}<Typography component="span" variant="caption" color="text.secondary">/head</Typography></TableCell>
                      <TableCell align="center"><Chip size="small" label={l.catering?.deals?.length || 0} sx={{ fontWeight: 700, bgcolor: "grey.100" }} /></TableCell>
                      <TableCell align="center"><Chip size="small" label={l.catering?.menus?.length || 0} sx={{ fontWeight: 700, bgcolor: "grey.100" }} /></TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="center">{l.hall?.capacity || "—"}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{l.hall?.dayRate ? pkr(l.hall.dayRate) : "—"}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{l.hall?.nightRate ? pkr(l.hall.nightRate) : "—"}</TableCell>
                    </>
                  )}
                  <TableCell align="center">
                    <Chip size="small" label={bookingCount(l.id)} sx={{ fontWeight: 700, bgcolor: "grey.100" }} />
                  </TableCell>
                  <TableCell><StatusChip status={l.status} /></TableCell>
                  <TableCell align="right">
                    <RowMenu
                      actions={[
                        { label: `Open ${copy.listingNoun.toLowerCase()}`, icon: <VisibilityRoundedIcon fontSize="small" />, onClick: () => router.push(`/vendor/listings/${l.id}`) },
                        { label: "Edit", icon: <EditRoundedIcon fontSize="small" />, onClick: () => setDialog({ open: true, listing: l }) },
                        l.status === "Published"
                          ? { label: "Move to draft", icon: <UnpublishedRoundedIcon fontSize="small" />, onClick: () => togglePublish(l) }
                          : { label: "Publish", icon: <PublishRoundedIcon fontSize="small" />, onClick: () => togglePublish(l) },
                        { label: "Delete", icon: <DeleteOutlineRoundedIcon fontSize="small" />, danger: true, onClick: () => { dispatch(listingsActions.remove(l.id)); dispatch(notify({ message: `${copy.listingNoun} deleted`, severity: "info" })); } },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isCatering ? 8 : 7} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    {mine.length === 0 ? copy.emptyLabel : "Nothing in this status."}
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
        vertical={vertical}
        onClose={() => setDialog({ open: false, listing: null })}
        onSubmit={submit}
      />
    </Box>
  );
}
