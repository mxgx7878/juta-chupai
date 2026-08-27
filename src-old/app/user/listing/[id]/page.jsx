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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { alpha } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CategoryIcon from "@/components/ui/CategoryIcon";
import CustomerInquiryDialog from "@/components/user/CustomerInquiryDialog";
import { inquiriesActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { getCategory, getSubcategory, fieldsFor } from "@/config/categoryTree";
import { typePriceLabel, typeChips } from "@/utils/listing";
import { todayISO } from "@/utils/calendar";
import { uniqueSlug } from "@/utils/slug";

const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};

export default function CustomerListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [ask, setAsk] = useState(false);

  const listing = useSelector((s) => s.listings.items.find((l) => l.id === id));
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === listing?.vendorId));
  const email = useSelector((s) => s.session.customerEmail);
  const customer = useSelector((s) => s.customers.items.find((c) => c.email === email));
  const allInquiries = useSelector((s) => s.inquiries.items);

  const attrEntries = useMemo(() => {
    if (!listing) return [];
    return fieldsFor(listing.categoryId)
      .map((f) => ({ label: f.label, value: listing.attrs?.[f.name] }))
      .filter((e) => e.value !== undefined && e.value !== "" && !(Array.isArray(e.value) && e.value.length === 0));
  }, [listing]);

  if (!listing || listing.status !== "Published") {
    return (
      <Box>
        <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/user/browse")}>Back to browse</Button>
        <Card sx={{ p: 6, mt: 2, textAlign: "center" }}>
          <Typography color="text.secondary">This listing isn&apos;t available.</Typography>
        </Card>
      </Box>
    );
  }

  const cat = getCategory(listing.categoryId);
  const sub = getSubcategory(listing.subcategoryId);

  const sendInquiry = (data) => {
    const id2 = `inq-${uniqueSlug(`${customer?.name || "guest"}-${listing.id}-${Date.now()}`)}`;
    dispatch(inquiriesActions.add({
      id: id2,
      listingId: listing.id,
      vendorId: listing.vendorId,
      type: data.type,
      customerName: customer?.name || "Guest",
      customerEmail: customer?.email || "",
      customerCity: customer?.city || "",
      eventDate: data.eventDate || "",
      quantity: data.quantity,
      message: data.message,
      status: "New",
      createdAt: todayISO(),
    }));
    dispatch(notify("Inquiry sent — the vendor will be in touch"));
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/user/browse")} sx={{ mb: 2 }}>Back to browse</Button>

      {/* Hero */}
      <Card sx={{ overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 200, background: `linear-gradient(135deg, ${alpha(cat?.color || "#4f46e5", 0.85)}, ${cat?.color || "#7c3aed"})`, display: "flex", alignItems: "flex-end", p: 2 }}>
          {listing.featured && <Chip label="Featured" sx={{ bgcolor: "rgba(255,255,255,0.9)", fontWeight: 700 }} />}
        </Box>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" } }}>
        {/* Main */}
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "text.secondary", mb: 0.5 }}>
              <CategoryIcon category={cat?.name} fontSize="small" />
              <Typography variant="body2">{cat?.name}{sub ? ` · ${sub.name}` : ""}</Typography>
            </Stack>
            <Typography variant="h4" fontWeight={800}>{listing.title}</Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary", mt: 0.5 }}>
              <PlaceRoundedIcon fontSize="small" /><Typography variant="body2">{listing.city}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, flexWrap: "wrap", gap: 0.5 }}>
              {typeChips(listing).map((c) => (
                <Chip key={c.type} label={c.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type]?.bg, color: TYPE_COLORS[c.type]?.fg }} />
              ))}
            </Stack>
          </Box>

          {listing.description && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>About this listing</Typography>
              <Typography variant="body2" color="text.secondary">{listing.description}</Typography>
            </Card>
          )}

          {attrEntries.length > 0 && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Details</Typography>
              <Stack spacing={1.25}>
                {attrEntries.map((e) => (
                  <Stack key={e.label} direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">{e.label}</Typography>
                    <Typography variant="body2" fontWeight={600}>{Array.isArray(e.value) ? e.value.join(", ") : String(e.value)}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>

        {/* Sidebar — pricing + CTA + vendor */}
        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 }, position: { md: "sticky" }, top: 88 }}>
            <Typography variant="overline" color="text.secondary">Pricing</Typography>
            <Table size="small" sx={{ mb: 2 }}>
              <TableBody>
                {typeChips(listing).map((c) => (
                  <TableRow key={c.type}>
                    <TableCell sx={{ border: 0, pl: 0 }}><Chip label={c.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type]?.bg, color: TYPE_COLORS[c.type]?.fg }} /></TableCell>
                    <TableCell align="right" sx={{ border: 0, pr: 0, fontWeight: 800, color: "primary.main" }}>{typePriceLabel(listing, c.type)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button fullWidth size="large" variant="contained" startIcon={<SendRoundedIcon />} onClick={() => setAsk(true)}>Make an inquiry</Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, textAlign: "center" }}>
              No payment now — the vendor will confirm availability.
            </Typography>
          </Card>

          {vendor && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="overline" color="text.secondary">Offered by</Typography>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mt: 1 }}>
                <Avatar variant="rounded" sx={{ bgcolor: "primary.main", borderRadius: 2, width: 44, height: 44, fontWeight: 700 }}>{vendor.name[0]}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>{vendor.name}</Typography>
                    {vendor.verified && <VerifiedRoundedIcon sx={{ fontSize: 16, color: "primary.main" }} />}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">{vendor.city} · {vendor.rating || "—"}★ ({vendor.reviews ?? 0})</Typography>
                </Box>
                <StorefrontRoundedIcon color="disabled" />
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                {(vendor.services || []).slice(0, 4).map((s) => <Chip key={s} label={s} size="small" sx={{ bgcolor: "grey.100" }} />)}
              </Stack>
            </Card>
          )}
        </Stack>
      </Box>

      <CustomerInquiryDialog open={ask} listing={listing} customer={customer} onClose={() => setAsk(false)} onSubmit={sendInquiry} />
    </Box>
  );
}