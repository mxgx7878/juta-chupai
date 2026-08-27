"use client";

import { useState } from "react";
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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import PageHeader from "@/components/layout/PageHeader";
import CategoryIcon from "@/components/ui/CategoryIcon";
import StatusChip from "@/components/ui/StatusChip";
import VendorProfileEditDialog from "@/components/vendor/VendorProfileEditDialog";
import { vendorsActions } from "@/store";
import { notify } from "@/store/uiSlice";

function Stat({ label, value }) {
  return (
    <Box sx={{ textAlign: "center", flex: 1, py: 1.5, borderRadius: 2, bgcolor: "grey.50" }}>
      <Typography variant="h6" fontWeight={800}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}

export default function VendorProfilePage() {
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === vendorId));
  const myListings = useSelector((s) => s.listings.items.filter((l) => l.vendorId === vendorId));
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);

  if (!vendor) return null;

  return (
    <Box>
      <PageHeader
        overline="Vendor"
        title="My Profile"
        subtitle="How your storefront appears on the marketplace."
        action={<Button variant="contained" startIcon={<EditRoundedIcon />} onClick={() => setEdit(true)}>Edit profile</Button>}
      />

      {/* Hero */}
      <Card sx={{ overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 96, background: "linear-gradient(135deg,#0e7490,#4f46e5)" }} />
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "flex-end" }, mt: -4 }}>
            <Avatar variant="rounded" sx={{ width: 84, height: 84, borderRadius: 3, fontSize: 30, fontWeight: 700, bgcolor: "secondary.main", border: "4px solid", borderColor: "background.paper" }}>
              {vendor.name[0]}
            </Avatar>
            <Box sx={{ flex: 1, pb: 0.5 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Typography variant="h5" fontWeight={800}>{vendor.name}</Typography>
                {vendor.verified && <Chip size="small" icon={<VerifiedRoundedIcon />} label="Verified" color="primary" sx={{ fontWeight: 700 }} />}
                {vendor.premium && <Chip size="small" icon={<WorkspacePremiumRoundedIcon />} label="Premium" color="secondary" sx={{ fontWeight: 700 }} />}
              </Stack>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5, color: "text.secondary" }}>
                <CategoryIcon category={vendor.category} fontSize="small" />
                <Typography variant="body2" color="text.secondary">{vendor.category} · {vendor.city} · by {vendor.owner}</Typography>
              </Stack>
            </Box>
            <StatusChip status={vendor.status} />
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
            <Stat label="Rating" value={vendor.rating || "—"} />
            <Stat label="Reviews" value={vendor.reviews ?? 0} />
            <Stat label="Listings" value={myListings.length} />
            <Stat label="Experience" value={vendor.experience || "—"} />
          </Stack>
        </Box>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" } }}>
        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>What you offer</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
              {(vendor.services || []).map((s) => <Chip key={s} label={s} sx={{ bgcolor: "grey.100", fontWeight: 600 }} />)}
              {(!vendor.services || vendor.services.length === 0) && <Typography color="text.secondary">No services listed yet.</Typography>}
            </Stack>
          </Card>

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Rating &amp; reviews</Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Typography variant="h3" fontWeight={800}>{vendor.rating || "—"}</Typography>
              <Box>
                <Rating value={vendor.rating || 0} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">{vendor.reviews ?? 0} reviews</Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>

        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Storefront details</Typography>
            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <ScheduleRoundedIcon fontSize="small" /><Typography variant="body2">{vendor.hours || "—"}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <PlaceRoundedIcon fontSize="small" /><Typography variant="body2">{vendor.city}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <WorkHistoryRoundedIcon fontSize="small" /><Typography variant="body2">{vendor.experience || "—"} experience</Typography>
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Contact &amp; social</Typography>
            <Stack spacing={1.25}>
              {vendor.ig && <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}><InstagramIcon fontSize="small" /><Typography variant="body2">{vendor.ig}</Typography></Stack>}
              {vendor.fb && <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}><FacebookIcon fontSize="small" /><Typography variant="body2">{vendor.fb}</Typography></Stack>}
              {vendor.web && <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}><LanguageRoundedIcon fontSize="small" /><Typography variant="body2">{vendor.web}</Typography></Stack>}
              {!vendor.ig && !vendor.fb && !vendor.web && <Typography variant="body2" color="text.secondary">No contact links yet.</Typography>}
            </Stack>
          </Card>

          <Card sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography variant="caption" color="text.secondary">
              Approval status is managed by the marketplace team. Contact support to change verification or premium status.
            </Typography>
          </Card>
        </Stack>
      </Box>

      <VendorProfileEditDialog
        open={edit}
        vendor={vendor}
        onClose={() => setEdit(false)}
        onSubmit={(data) => { dispatch(vendorsActions.update({ ...vendor, ...data })); dispatch(notify("Profile updated")); setEdit(false); }}
      />
    </Box>
  );
}