"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { alpha } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import UnpublishedRoundedIcon from "@mui/icons-material/UnpublishedRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StatusChip from "@/components/ui/StatusChip";
import CategoryIcon from "@/components/ui/CategoryIcon";
import ListingFormDialog from "@/components/listing/ListingFormDialog";
import HallAvailabilityCalendar from "@/components/booking/HallAvailabilityCalendar";
import BookingFormDialog from "@/components/booking/BookingFormDialog";
import { listingsActions, bookingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { getCategory, getSubcategory, VERTICALS } from "@/config/categoryTree";
import { pkr, paymentSummary, SLOT_LABELS, BLOCKING_STATUSES } from "@/utils/booking";
import { formatDate } from "@/utils/date";
import { todayISO } from "@/utils/calendar";
import { copyFor } from "@/utils/vertical";

export default function VendorListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [newBooking, setNewBooking] = useState(null);

  const vendorId = useSelector((s) => s.session.vendorId);
  const listing = useSelector((s) => s.listings.items.find((l) => l.id === id));
  const allBookings = useSelector((s) => s.bookings.items);

  const listingBookings = useMemo(
    () => allBookings.filter((b) => b.listingId === id).sort((a, b) => (a.eventDate || "").localeCompare(b.eventDate || "")),
    [allBookings, id],
  );

  if (!listing || listing.vendorId !== vendorId) {
    return (
      <Box>
        <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/vendor/listings")}>Back</Button>
        <Card sx={{ p: 6, mt: 2, textAlign: "center" }}>
          <Typography color="text.secondary">Listing not found.</Typography>
        </Card>
      </Box>
    );
  }

  const vertical = listing.vertical || VERTICALS.HALL;
  const isCatering = vertical === VERTICALS.CATERING;
  const copy = copyFor(vertical);
  const cat = getCategory(listing.categoryId);
  const sub = getSubcategory(listing.subcategoryId);
  const h = listing.hall || {};
  const c = listing.catering || {};
  const published = listing.status === "Published";
  const upcoming = listingBookings.filter((b) => BLOCKING_STATUSES.includes(b.status) && b.eventDate >= todayISO());

  const togglePublish = () => {
    const nextStatus = published ? "Draft" : "Published";
    dispatch(listingsActions.setStatus({ id: listing.id, status: nextStatus }));
    dispatch(notify(nextStatus === "Published" ? "Published" : "Moved to draft"));
  };

  const createBooking = (data) => {
    dispatch(bookingsActions.add({ id: `bkg-${Date.now()}`, vendorId, inquiryId: null, createdAt: todayISO(), payments: [], ...data }));
    dispatch(notify("Booking created"));
  };

  const detailRows = isCatering
    ? [
        ["Guests", c.minGuests || c.maxGuests ? `${c.minGuests}–${c.maxGuests}` : null],
        ["Service style", c.serviceStyle],
        ["From", c.perHeadFrom ? `${pkr(c.perHeadFrom)} / head` : null],
        ["Staffing", c.staffing],
        ["Notice needed", c.notice],
        ["Travels to", c.travelsTo],
      ].filter(([, v]) => v)
    : [
        ["Capacity", h.capacity ? `${h.capacity} guests` : null],
        ["Minimum guests", h.minGuests || null],
        ["Setting", h.setting],
        ["Day rate", h.dayRate ? pkr(h.dayRate) : null],
        ["Night rate", h.nightRate ? pkr(h.nightRate) : null],
        ["Parking", h.parking ? `${h.parking} spaces` : null],
        ["Catering", h.catering],
        ["Advance policy", h.advancePolicy],
      ].filter(([, v]) => v);

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/vendor/listings")}>{copy.navLabel}</Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="inherit" startIcon={<EditRoundedIcon />} onClick={() => setEdit(true)}>Edit</Button>
          <Button variant="outlined" color="inherit" startIcon={published ? <UnpublishedRoundedIcon /> : <PublishRoundedIcon />} onClick={togglePublish}>
            {published ? "Move to draft" : "Publish"}
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 140, background: `linear-gradient(135deg, ${alpha(cat?.color || "#4f46e5", 0.85)}, ${cat?.color || "#7c3aed"})` }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary", mb: 0.5 }}>
            <CategoryIcon category={cat?.name} fontSize="small" />
            <Typography variant="body2">{cat?.name}{sub ? ` · ${sub.name}` : ""}</Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="h4" fontWeight={800}>{listing.title}</Typography>
            <StatusChip status={listing.status} />
          </Stack>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 1, color: "text.secondary" }}>
            <PlaceRoundedIcon fontSize="small" />
            <Typography variant="body2">{listing.city}</Typography>
          </Stack>
          {listing.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>{listing.description}</Typography>}
        </Box>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" } }}>
        <Stack spacing={3}>
          {/* Hall: availability. Catering: deals + menus. */}
          {!isCatering ? (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Availability</Typography>
                <Typography variant="caption" color="text.secondary">Click a free slot to start a booking.</Typography>
              </Box>
              <HallAvailabilityCalendar
                bookings={allBookings}
                listingId={listing.id}
                onPickSlot={(date, slot) => setNewBooking({ listingId: listing.id, eventDate: date, slot })}
              />
            </Card>
          ) : (
            <>
              <Card sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Deals</Typography>
                <Typography variant="caption" color="text.secondary">Priced tiers a customer picks when booking.</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {(c.deals || []).map((d) => (
                    <Box key={d.id} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={800}>{d.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Minimum {d.minGuests} guests</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                          {pkr(d.perHead)}<Typography component="span" variant="caption" color="text.secondary">/head</Typography>
                        </Typography>
                      </Stack>
                      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
                        {(d.includes || []).map((x) => <Chip key={x} label={x} size="small" sx={{ bgcolor: "grey.100", fontWeight: 600 }} />)}
                      </Stack>
                    </Box>
                  ))}
                  {(c.deals || []).length === 0 && <Typography variant="body2" color="text.secondary">No deals yet.</Typography>}
                </Stack>
              </Card>

              <Card sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Menus</Typography>
                <Typography variant="caption" color="text.secondary">The actual dishes, grouped by course.</Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {(c.menus || []).map((m) => (
                    <Box key={m.id} sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50" }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight={800}>{m.name}</Typography>
                        <Chip size="small" label={`${pkr(m.perHead)}/head`} sx={{ fontWeight: 700, bgcolor: "background.paper" }} />
                      </Stack>
                      <Stack spacing={1.25}>
                        {(m.sections || []).map((sec, i) => (
                          <Box key={i}>
                            <Typography variant="overline" color="text.secondary">{sec.name}</Typography>
                            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mt: 0.25 }}>
                              {(sec.items || []).map((it) => <Chip key={it} label={it} size="small" variant="outlined" />)}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  ))}
                  {(c.menus || []).length === 0 && <Typography variant="body2" color="text.secondary">No menus yet.</Typography>}
                </Stack>
              </Card>
            </>
          )}

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Bookings ({listingBookings.length})</Typography>
            <Stack spacing={1.25}>
              {listingBookings.map((b) => {
                const sum = paymentSummary(b);
                return (
                  <Stack key={b.id} direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: { sm: "center" }, p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700}>{b.customerName}</Typography>
                        {b.slot && <Chip size="small" label={SLOT_LABELS[b.slot]} sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: b.slot === "day" ? "#fef3c7" : "#e0e7ff", color: b.slot === "day" ? "#b45309" : "#3730a3" }} />}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">{formatDate(b.eventDate)} · {b.eventType} · {b.guests} guests</Typography>
                    </Box>
                    <Typography variant="caption" color={sum.remaining > 0 ? "error.main" : "success.main"} sx={{ whiteSpace: "nowrap" }}>
                      {pkr(sum.received)} / {pkr(sum.total)}
                    </Typography>
                    <StatusChip status={b.status} />
                  </Stack>
                );
              })}
              {listingBookings.length === 0 && <Typography variant="body2" color="text.secondary">No bookings yet.</Typography>}
            </Stack>
          </Card>
        </Stack>

        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Details</Typography>
            <Table size="small">
              <TableBody>
                {detailRows.map(([label, value]) => (
                  <TableRow key={label}>
                    <TableCell sx={{ border: 0, pl: 0, color: "text.secondary" }}>{label}</TableCell>
                    <TableCell sx={{ border: 0, pr: 0, fontWeight: 600, textAlign: "right" }}>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {((isCatering ? c.cuisines : h.amenities) || []).length > 0 && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="overline" color="text.secondary">{isCatering ? "Cuisines" : "Amenities"}</Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 1 }}>
                {(isCatering ? c.cuisines : h.amenities).map((a) => <Chip key={a} label={a} size="small" sx={{ bgcolor: "grey.100", fontWeight: 600 }} />)}
              </Stack>
            </Card>
          )}

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="overline" color="text.secondary">At a glance</Typography>
            <Stack spacing={1.25} sx={{ mt: 1 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Upcoming bookings</Typography>
                <Typography variant="body2" fontWeight={700}>{upcoming.length}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Still to collect</Typography>
                <Typography variant="body2" fontWeight={700} color="error.main">
                  {pkr(listingBookings.filter((b) => b.status !== "Cancelled").reduce((a, b) => a + paymentSummary(b).remaining, 0))}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Box>

      <ListingFormDialog
        open={edit}
        listing={listing}
        vertical={vertical}
        onClose={() => setEdit(false)}
        onSubmit={(data) => { dispatch(listingsActions.update({ ...listing, ...data })); dispatch(notify("Saved")); }}
      />

      <BookingFormDialog
        open={Boolean(newBooking)}
        prefill={newBooking}
        listings={[listing]}
        vertical={vertical}
        onClose={() => setNewBooking(null)}
        onSubmit={createBooking}
      />
    </Box>
  );
}
