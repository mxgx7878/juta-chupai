"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import { alpha } from "@mui/material/styles";
import StatusChip from "@/components/ui/StatusChip";
import CategoryIcon from "@/components/ui/CategoryIcon";
import VendorFormDialog from "@/components/vendor/VendorFormDialog";
import { vendorsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { categoryMeta } from "@/config/vendorCategories";
import { priceLabel, typeChips } from "@/utils/listing";

const GRAD = ["linear-gradient(135deg,#4f46e5,#7c3aed)", "linear-gradient(135deg,#0ea5a4,#2f6fed)", "linear-gradient(135deg,#f59e0b,#ec4899)", "linear-gradient(135deg,#7c3aed,#ec4899)"];
const TYPE_COLORS = { rent: { bg: "#e0edff", fg: "#1d4ed8" }, purchase: { bg: "#dcfce7", fg: "#15803d" }, service: { bg: "#ede9fe", fg: "#6d28d9" } };


function Stat({ label, value }) {
  return (
    <Box sx={{ textAlign: "center", flex: 1, py: 1.5, borderRadius: 2, bgcolor: "grey.50" }}>
      <Typography variant="h6" fontWeight={800}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export default function VendorDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === slug));
  const vendorListings = useSelector((s) => s.listings.items.filter((l) => l.vendorId === slug));
  const [edit, setEdit] = useState(false);

  if (!vendor) {
    return (
      <Box>
        <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/vendors")}>
          Back to vendors
        </Button>
        <Card sx={{ p: 6, mt: 2, textAlign: "center" }}>
          <Typography color="text.secondary">Vendor not found.</Typography>
        </Card>
      </Box>
    );
  }

  const meta = categoryMeta(vendor.category);
  const attrEntries = meta.fields
    .map((f) => ({ label: f.label, value: vendor.attrs?.[f.name] }))
    .filter((e) => e.value !== undefined && e.value !== "" && !(Array.isArray(e.value) && e.value.length === 0));

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/vendors")}>
          Vendors
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="inherit" startIcon={<EditRoundedIcon />} onClick={() => setEdit(true)}>
            Edit
          </Button>
          {vendor.status === "Approved" ? (
            <Button variant="outlined" color="error" startIcon={<BlockRoundedIcon />} onClick={() => { dispatch(vendorsActions.setStatus({ id: vendor.id, status: "Rejected" })); dispatch(notify({ message: "Vendor suspended", severity: "warning" })); }}>
              Suspend
            </Button>
          ) : (
            <Button variant="contained" color="success" startIcon={<CheckRoundedIcon />} onClick={() => { dispatch(vendorsActions.setStatus({ id: vendor.id, status: "Approved" })); dispatch(notify("Vendor approved")); }}>
              Approve
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Hero */}
      <Card sx={{ overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 120, background: GRAD[vendor.name.length % GRAD.length] }} />
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "flex-end" }, mt: -5 }}>
            <Avatar variant="rounded" sx={{ width: 88, height: 88, borderRadius: 3, fontSize: 30, fontWeight: 700, bgcolor: "primary.main", border: "4px solid", borderColor: "background.paper" }}>
              {vendor.name[0]}
            </Avatar>
            <Box sx={{ flex: 1, pb: 0.5 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Typography variant="h5" fontWeight={800}>
                  {vendor.name}
                </Typography>
                {vendor.verified && <Chip size="small" icon={<VerifiedRoundedIcon />} label="Verified" color="primary" sx={{ fontWeight: 700 }} />}
                {vendor.premium && <Chip size="small" icon={<WorkspacePremiumRoundedIcon />} label="Premium" color="secondary" sx={{ fontWeight: 700 }} />}
                {vendor.featured && <Chip size="small" icon={<StarRoundedIcon />} label="Featured" sx={{ fontWeight: 700, bgcolor: "warning.light", color: "warning.main" }} />}
              </Stack>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5, color: "text.secondary" }}>
                <CategoryIcon category={vendor.category} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {vendor.category} · {vendor.city} · by {vendor.owner}
                </Typography>
              </Stack>
            </Box>
            <StatusChip status={vendor.status} />
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
            <Stat label="Rating" value={vendor.rating || "—"} />
            <Stat label="Reviews" value={vendor.reviews ?? 0} />
            <Stat label="Listings" value={vendorListings.length} />
            <Stat label="Experience" value={vendor.experience || "—"} />
          </Stack>
        </Box>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" } }}>
        <Stack spacing={3}>
          {/* Listings */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              Listings ({vendorListings.length})
            </Typography>
            <Stack spacing={1.25}>
              {vendorListings.map((l) => (
                <Stack key={l.id} direction="row" spacing={1.5} sx={{ alignItems: "center", p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>{l.title}</Typography>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: "wrap", gap: 0.5 }}>
                      {typeChips(l).map((c) => (
                        <Chip key={c.type} label={c.label} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[c.type]?.bg, color: TYPE_COLORS[c.type]?.fg }} />
                      ))}
                    </Stack>
                  </Box>
                  <Typography variant="body2" fontWeight={800} sx={{ color: "primary.main", whiteSpace: "nowrap" }}>{priceLabel(l)}</Typography>
                  <StatusChip status={l.status} />
                </Stack>
              ))}
              {vendorListings.length === 0 && <Typography color="text.secondary" variant="body2">No listings yet.</Typography>}
            </Stack>
          </Card>

          {/* Services */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              Services
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {(vendor.services || []).map((s) => (
                <Chip key={s} label={s} sx={{ bgcolor: "grey.100", fontWeight: 600 }} />
              ))}
              {(!vendor.services || vendor.services.length === 0) && <Typography color="text.secondary">No services added.</Typography>}
            </Stack>
          </Card>

          {/* Packages */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              Packages &amp; pricing
            </Typography>
            <Table>
              <TableBody>
                {(vendor.packages || []).map((p) => (
                  <TableRow key={p.name}>
                    <TableCell sx={{ fontWeight: 700 }}>{p.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{p.detail}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: "primary.main" }}>
                      {p.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Gallery */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              Gallery
            </Typography>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))" }}>
              {(vendor.gallery && vendor.gallery.length > 0
                ? vendor.gallery
                : [null, null, null, null]
              ).map((src, i) => (
                <Box
                  key={i}
                  sx={{
                    aspectRatio: "4 / 3",
                    borderRadius: 2,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: src ? "none" : GRAD[i % GRAD.length],
                  }}
                >
                  {src ? (
                    <Box component="img" src={src} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <ImageRoundedIcon sx={{ color: "rgba(255,255,255,0.7)", fontSize: 28 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Card>
        </Stack>

        {/* Sidebar */}
        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              {vendor.category} details
            </Typography>
            <Stack spacing={1.25}>
              {attrEntries.length === 0 && <Typography color="text.secondary" variant="body2">No extra details.</Typography>}
              {attrEntries.map((e) => (
                <Stack key={e.label} direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {e.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ textAlign: "right" }}>
                    {Array.isArray(e.value) ? e.value.join(", ") : String(e.value)}
                  </Typography>
                </Stack>
              ))}
              <Divider sx={{ my: 0.5 }} />
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <ScheduleRoundedIcon fontSize="small" />
                <Typography variant="body2">{vendor.hours || "—"}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <PlaceRoundedIcon fontSize="small" />
                <Typography variant="body2">{vendor.city}</Typography>
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              Contact &amp; social
            </Typography>
            <Stack spacing={1.25}>
              {vendor.ig && (
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                  <InstagramIcon fontSize="small" /> <Typography variant="body2">{vendor.ig}</Typography>
                </Stack>
              )}
              {vendor.fb && (
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                  <FacebookIcon fontSize="small" /> <Typography variant="body2">{vendor.fb}</Typography>
                </Stack>
              )}
              {vendor.web && (
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                  <LanguageRoundedIcon fontSize="small" /> <Typography variant="body2">{vendor.web}</Typography>
                </Stack>
              )}
            </Stack>
          </Card>

          <Card sx={{ p: 0, overflow: "hidden" }}>
            <Box sx={{ height: 150, bgcolor: alpha("#4f46e5", 0.08), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
              <PlaceRoundedIcon color="primary" />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                Google Maps · {vendor.city}
              </Typography>
            </Box>
          </Card>
        </Stack>
      </Box>

      <VendorFormDialog
        open={edit}
        vendor={vendor}
        onClose={() => setEdit(false)}
        onSubmit={(data) => {
          dispatch(vendorsActions.update({ ...vendor, ...data }));
          dispatch(notify("Vendor updated"));
        }}
      />
    </Box>
  );
}