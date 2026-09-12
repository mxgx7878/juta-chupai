"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import IconBadge from "./IconBadge";
import Reveal from "./Reveal";
import { getPublicIcon } from "@/config/publicIcons";
import { site } from "@/config/site";
import { BOOKING_STATUS_COLORS, pkr, SLOT_LABELS } from "@/utils/booking";
import { formatLongDate } from "@/utils/date";
import { colors, motion } from "@/theme/tokens";

const NEXT_STEPS = [
  { icon: "support", title: "The vendor reviews your request", detail: "Usually within the hour during business hours. You'll get a call or an email on the number you gave." },
  { icon: "calendar", title: "The date is held once they accept", detail: "The slot then disappears from the public calendar, so nobody else can take it." },
  { icon: "wallet", title: "You pay the advance directly", detail: "Under the advance policy published on the listing. Joota Chupai never takes your money." },
];

/**
 * Post-booking screen. Bookings live in the in-memory store for this demo, so a
 * reference from a previous session cannot be resolved — that case is handled
 * explicitly rather than showing an empty page.
 */
export default function BookingConfirmation({ reference }) {
  const booking = useSelector((s) => s.bookings.items.find((b) => b.reference === reference));
  const listing = useSelector((s) => s.listings.items.find((l) => l.id === booking?.listingId));
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === booking?.vendorId));

  if (!booking) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 10, md: 16 }, textAlign: "center" }}>
        <IconBadge icon={HelpOutlineRoundedIcon} size={64} sx={{ mx: "auto", mb: 3 }} />
        <Typography variant="h4">We can&apos;t find {reference}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
          Booking references are confirmed by email. If you have just made this booking in another
          tab or on another device, open the link from that email — or contact us at {site.contact.support} and
          we will pull it up for you.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "center" }}>
          <Button component={Link} href="/listings" variant="contained">Browse listings</Button>
          <Button component={Link} href="/contact" variant="outlined" sx={{ borderColor: colors.borderStrong, color: "text.primary" }}>Contact support</Button>
        </Stack>
      </Container>
    );
  }

  const statusStyle = BOOKING_STATUS_COLORS[booking.status] || BOOKING_STATUS_COLORS.Pending;
  const rows = [
    [listing?.vertical === "catering" ? "Caterer" : "Venue", listing?.title],
    ["City", listing?.city],
    ["Vendor", vendor?.name],
    ["Date", formatLongDate(booking.eventDate)],
    booking.slot ? ["Slot", SLOT_LABELS[booking.slot]] : null,
    ["Event", booking.eventType],
    ["Guests", booking.guests],
    booking.venueAddress ? ["Serving at", booking.venueAddress] : null,
    ["Booked by", booking.customerName],
    ["Contact", `${booking.customerPhone} · ${booking.customerEmail}`],
  ].filter(Boolean);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Reveal>
        <Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center", mb: 5 }}>
          <Box
            sx={{
              width: 84, height: 84, borderRadius: "50%", display: "grid", placeItems: "center",
              bgcolor: colors.successSoft, color: colors.success,
              animation: `jc-pop ${motion.slow} ${motion.easeOut}`,
              "@keyframes jc-pop": { from: { transform: "scale(0.6)", opacity: 0 }, to: { transform: "scale(1)", opacity: 1 } },
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 } }}>Booking {booking.reference} is in</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
            {vendor?.name || "The vendor"} has your request for {formatLongDate(booking.eventDate)}. Keep this reference —
            it identifies your booking in every conversation with us or the vendor.
          </Typography>
          <Chip
            label={`Status: ${booking.status}`}
            sx={{ bgcolor: statusStyle.bg, color: statusStyle.fg, fontWeight: 700 }}
          />
        </Stack>
      </Reveal>

      <Reveal delay={90}>
        <Card sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Booking summary</Typography>
          <Stack spacing={1.25}>
            {rows.map(([label, value]) => (
              <Stack key={label} direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>{value}</Typography>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Estimated total</Typography>
            <Typography variant="h5" sx={{ color: colors.primary }}>{pkr(booking.totalAmount)}</Typography>
          </Stack>
          {listing?.hall?.advancePolicy && (
            <Typography variant="caption" color="text.secondary">Advance policy: {listing.hall.advancePolicy}</Typography>
          )}
        </Card>
      </Reveal>

      <Reveal delay={160}>
        <Typography variant="h6" sx={{ mt: 5, mb: 2.5 }}>What happens next</Typography>
        <Stack spacing={2}>
          {NEXT_STEPS.map((step, i) => (
            <Card key={step.title} sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2}>
                <IconBadge icon={getPublicIcon(step.icon)} tone={i === 0 ? "primary" : "secondary"} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{step.detail}</Typography>
                </Box>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Reveal>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 5 }}>
        <Button component={Link} href="/listings" variant="contained">Book another service</Button>
        <Button component={Link} href="/contact" variant="outlined" sx={{ borderColor: colors.borderStrong, color: "text.primary" }}>
          Something wrong? Contact us
        </Button>
      </Stack>
    </Container>
  );
}
