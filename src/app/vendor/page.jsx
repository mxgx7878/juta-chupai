"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StatusChip from "@/components/ui/StatusChip";
import { BLOCKING_STATUSES, SLOT_LABELS, paymentSummary, pkr } from "@/utils/booking";
import { formatDate } from "@/utils/date";
import { todayISO } from "@/utils/calendar";
import { vendorVertical, copyFor } from "@/utils/vertical";

function Metric({ icon: Icon, label, value, color }) {
  return (
    <Card sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Avatar variant="rounded" sx={{ bgcolor: `${color}.light`, color: `${color}.main`, borderRadius: 2 }}><Icon /></Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" fontWeight={800} noWrap>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export default function VendorDashboardPage() {
  const router = useRouter();
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === vendorId));
  const allListings = useSelector((s) => s.listings.items);
  const allBookings = useSelector((s) => s.bookings.items);
  const allInquiries = useSelector((s) => s.inquiries.items);
  const storeCategories = useSelector((s) => s.categories.items);

  const copy = copyFor(vendorVertical(vendor, storeCategories));
  const myListings = useMemo(() => allListings.filter((l) => l.vendorId === vendorId), [allListings, vendorId]);
  const listingById = useMemo(() => Object.fromEntries(myListings.map((l) => [l.id, l])), [myListings]);

  const myBookings = useMemo(() => {
    const ids = new Set(myListings.map((l) => l.id));
    return allBookings.filter((b) => ids.has(b.listingId));
  }, [allBookings, myListings]);

  const newInq = allInquiries.filter((q) => q.vendorId === vendorId && q.status === "New").length;
  const today = todayISO();
  const upcoming = myBookings
    .filter((b) => BLOCKING_STATUSES.includes(b.status) && b.eventDate >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  const outstanding = myBookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((a, b) => a + paymentSummary(b).remaining, 0);

  if (!vendor) return null;

  return (
    <Stack spacing={3}>
      <Card sx={{ p: { xs: 3, md: 4 }, color: "#fff", border: "none", background: "linear-gradient(120deg,#0e7490 0%,#2f6fed 60%,#4f46e5 100%)" }}>
        <Typography variant="overline" sx={{ opacity: 0.85 }}>Vendor dashboard</Typography>
        <Typography variant="h4" fontWeight={800}>Welcome back, {vendor.owner?.split(" ")[0] || vendor.name}</Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          {vendor.name} · {vendor.city} — {myListings.length} {copy.listingNounPlural.toLowerCase()},
          {" "}{upcoming.length} upcoming booking{upcoming.length === 1 ? "" : "s"} and {newInq} new inquir{newInq === 1 ? "y" : "ies"}.
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
          <Button variant="contained" startIcon={<EventAvailableRoundedIcon />} onClick={() => router.push("/vendor/calendar")} sx={{ bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#eef" } }}>Open calendar</Button>
          <Button variant="outlined" endIcon={<ArrowForwardRoundedIcon />} onClick={() => router.push("/vendor/inquiries")} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>View inquiries</Button>
        </Stack>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" } }}>
        <Metric icon={Inventory2RoundedIcon} label={copy.listingNounPlural} value={`${myListings.filter((l) => l.status === "Published").length}/${myListings.length}`} color="primary" />
        <Metric icon={QuestionAnswerRoundedIcon} label="New inquiries" value={newInq} color="secondary" />
        <Metric icon={EventAvailableRoundedIcon} label="Upcoming bookings" value={upcoming.length} color="success" />
        <Metric icon={PaymentsRoundedIcon} label="Still to collect" value={pkr(outstanding)} color="warning" />
      </Box>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
        <Card sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography variant="h6" fontWeight={700}>Next up</Typography>
            <Button size="small" color="inherit" onClick={() => router.push("/vendor/bookings")}>All bookings</Button>
          </Stack>
          <Stack spacing={1.25}>
            {upcoming.slice(0, 5).map((b) => {
              const sum = paymentSummary(b);
              return (
                <Stack key={b.id} direction="row" spacing={1.5} sx={{ alignItems: "center", p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap>{b.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                      {formatDate(b.eventDate)} · {listingById[b.listingId]?.title}{b.slot ? ` · ${SLOT_LABELS[b.slot]}` : ""}
                    </Typography>
                  </Box>
                  <Typography variant="caption" fontWeight={700} color={sum.remaining > 0 ? "error.main" : "success.main"} sx={{ whiteSpace: "nowrap" }}>
                    {sum.remaining > 0 ? `${pkr(sum.remaining)} left` : "Settled"}
                  </Typography>
                  <StatusChip status={b.status} />
                </Stack>
              );
            })}
            {upcoming.length === 0 && <Typography variant="body2" color="text.secondary">Nothing booked ahead.</Typography>}
          </Stack>
        </Card>

        <Card sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography variant="h6" fontWeight={700}>{copy.navLabel}</Typography>
            <Button size="small" color="inherit" onClick={() => router.push("/vendor/listings")}>Manage</Button>
          </Stack>
          <Stack spacing={1.25}>
            {myListings.slice(0, 5).map((l) => (
              <Stack key={l.id} direction="row" spacing={1.5} sx={{ alignItems: "center", p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider", cursor: "pointer" }} onClick={() => router.push(`/vendor/listings/${l.id}`)}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>{l.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{l.hall?.capacity ? `${l.hall.capacity} guests` : `${l.catering?.minGuests}–${l.catering?.maxGuests} guests`} · {l.city}</Typography>
                </Box>
                <Chip size="small" label={`${myBookings.filter((b) => b.listingId === l.id && b.status !== "Cancelled").length} bookings`} sx={{ bgcolor: "grey.100", fontWeight: 600 }} />
                <StatusChip status={l.status} />
              </Stack>
            ))}
            {myListings.length === 0 && <Typography variant="body2" color="text.secondary">{copy.emptyLabel}</Typography>}
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
}
