"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import UnpublishedRoundedIcon from "@mui/icons-material/UnpublishedRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import StatusChip from "@/components/ui/StatusChip";
import CategoryIcon from "@/components/ui/CategoryIcon";
import ListingFormDialog from "@/components/listing/ListingFormDialog";
import { listingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { getCategory, getSubcategory, TYPE_LABELS, fieldsFor } from "@/config/categoryTree";
import { typePriceLabel, typeChips } from "@/utils/listing";
import { formatDate } from "@/utils/inquiry";

const GRAD = ["linear-gradient(135deg,#4f46e5,#7c3aed)", "linear-gradient(135deg,#0ea5a4,#2f6fed)", "linear-gradient(135deg,#f59e0b,#ec4899)"];
const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);

  const listing = useSelector((s) => s.listings.items.find((l) => l.id === id));
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === listing?.vendorId));
  const listingInquiries = useSelector((s) => s.inquiries.items.filter((q) => q.listingId === id));

  const attrEntries = useMemo(() => {
    if (!listing) return [];
    return fieldsFor(listing.categoryId)
      .map((f) => ({ label: f.label, value: listing.attrs?.[f.name] }))
      .filter((e) => e.value !== undefined && e.value !== "" && !(Array.isArray(e.value) && e.value.length === 0));
  }, [listing]);

  if (!listing) {
    return (
      <Box>
        <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/listings")}>
          Back to listings
        </Button>
        <Card sx={{ p: 6, mt: 2, textAlign: "center" }}>
          <Typography color="text.secondary">Listing not found.</Typography>
        </Card>
      </Box>
    );
  }

  const cat = getCategory(listing.categoryId);
  const sub = getSubcategory(listing.subcategoryId);
  const published = listing.status === "Published";

  const togglePublish = () => {
    const next = published ? "Draft" : "Published";
    dispatch(listingsActions.setStatus({ id: listing.id, status: next }));
    dispatch(notify(next === "Published" ? "Listing published" : "Listing moved to draft"));
  };

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/listings")}>
          Listings
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="inherit" startIcon={<EditRoundedIcon />} onClick={() => setEdit(true)}>Edit</Button>
          <Button variant="outlined" color="inherit" startIcon={published ? <UnpublishedRoundedIcon /> : <PublishRoundedIcon />} onClick={togglePublish}>
            {published ? "Move to draft" : "Publish"}
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={() => { dispatch(listingsActions.remove(listing.id)); dispatch(notify({ message: "Listing deleted", severity: "info" })); router.push("/listings"); }}>
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* Hero */}
      <Card sx={{ overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 110, background: GRAD[listing.title.length % GRAD.length] }} />
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "flex-end" }, mt: -4 }}>
            <Avatar variant="rounded" sx={{ width: 80, height: 80, borderRadius: 3, fontSize: 28, fontWeight: 700, bgcolor: "primary.main", border: "4px solid", borderColor: "background.paper" }}>
              {listing.title[0]}
            </Avatar>
            <Box sx={{ flex: 1, pb: 0.5 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Typography variant="h5" fontWeight={800}>{listing.title}</Typography>
                {listing.featured && <Chip size="small" label="Featured" sx={{ fontWeight: 700, bgcolor: "warning.light", color: "warning.main" }} />}
              </Stack>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5, color: "text.secondary", flexWrap: "wrap" }}>
                <CategoryIcon category={cat?.name} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {cat?.name}{sub ? ` · ${sub.name}` : ""} · {listing.city}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
                {typeChips(listing).map((c) => (
                  <Chip key={c.type} label={c.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type]?.bg, color: TYPE_COLORS[c.type]?.fg }} />
                ))}
              </Stack>
            </Box>
            <StatusChip status={listing.status} />
          </Stack>
        </Box>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" } }}>
        <Stack spacing={3}>
          {/* Pricing */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Pricing</Typography>
            <Table>
              <TableBody>
                {typeChips(listing).map((c) => (
                  <TableRow key={c.type}>
                    <TableCell sx={{ width: 120 }}>
                      <Chip label={c.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type]?.bg, color: TYPE_COLORS[c.type]?.fg }} />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: "primary.main" }}>{typePriceLabel(listing, c.type)}</TableCell>
                    <TableCell align="right" sx={{ color: "text.secondary" }}>
                      {c.type === "rent" && listing.pricing?.rent?.deposit ? `Deposit PKR ${Number(listing.pricing.rent.deposit).toLocaleString("en-PK")}` : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Description */}
          {listing.description && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Description</Typography>
              <Typography variant="body2" color="text.secondary">{listing.description}</Typography>
            </Card>
          )}

          {/* Inquiries against this listing */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="h6" fontWeight={700}>Inquiries ({listingInquiries.length})</Typography>
              <Button size="small" color="inherit" onClick={() => router.push("/inquiries")}>Open inquiries</Button>
            </Stack>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Event date</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listingInquiries.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{q.customerName}</TableCell>
                    <TableCell>{TYPE_LABELS[q.type] || q.type}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{q.eventDate ? formatDate(q.eventDate) : "—"}</TableCell>
                    <TableCell align="right"><StatusChip status={q.status} /></TableCell>
                  </TableRow>
                ))}
                {listingInquiries.length === 0 && (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: "text.secondary" }}>No inquiries yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Gallery */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Gallery</Typography>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))" }}>
              {(listing.images && listing.images.length > 0 ? listing.images : [null, null, null, null]).map((src, i) => (
                <Box key={i} sx={{ aspectRatio: "4 / 3", borderRadius: 2, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: src ? "none" : GRAD[i % GRAD.length] }}>
                  {src ? <Box component="img" src={src} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageRoundedIcon sx={{ color: "rgba(255,255,255,0.7)", fontSize: 28 }} />}
                </Box>
              ))}
            </Box>
          </Card>
        </Stack>

        {/* Sidebar */}
        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Vendor</Typography>
            {vendor ? (
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Avatar variant="rounded" sx={{ bgcolor: "primary.main", borderRadius: 2, width: 44, height: 44, fontWeight: 700 }}>{vendor.name[0]}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <MuiLink component="button" underline="hover" onClick={() => router.push(`/vendors/${vendor.id}`)} sx={{ fontWeight: 700, color: "text.primary" }}>
                    {vendor.name}
                  </MuiLink>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{vendor.city} · by {vendor.owner}</Typography>
                </Box>
                <StorefrontRoundedIcon color="disabled" />
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">Vendor not found.</Typography>
            )}
          </Card>

          {attrEntries.length > 0 && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{cat?.name} details</Typography>
              <Stack spacing={1.25}>
                {attrEntries.map((e) => (
                  <Stack key={e.label} direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">{e.label}</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ textAlign: "right" }}>{Array.isArray(e.value) ? e.value.join(", ") : String(e.value)}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          )}

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>At a glance</Typography>
            <Stack spacing={1.25}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <StatusChip status={listing.status} />
              </Stack>
              <Divider />
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <PlaceRoundedIcon fontSize="small" /><Typography variant="body2">{listing.city}</Typography>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Box>

      <ListingFormDialog
        open={edit}
        listing={listing}
        onClose={() => setEdit(false)}
        onSubmit={(data) => { dispatch(listingsActions.update({ ...listing, ...data })); dispatch(notify("Listing updated")); }}
      />
    </Box>
  );
}