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
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Alert from "@mui/material/Alert";
import { alpha } from "@mui/material/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CategoryIcon from "@/components/ui/CategoryIcon";
import HallAvailabilityCalendar from "@/components/booking/HallAvailabilityCalendar";
import CustomerInquiryDialog from "@/components/user/CustomerInquiryDialog";
import { inquiriesActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { getCategory, getSubcategory, VERTICALS } from "@/config/categoryTree";
import { pkr } from "@/utils/booking";
import { todayISO } from "@/utils/calendar";

export default function CustomerListingPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [ask, setAsk] = useState(null);

  const listing = useSelector((s) => s.listings.items.find((l) => l.id === id));
  const allBookings = useSelector((s) => s.bookings.items);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === listing?.vendorId));
  const myEmail = useSelector((s) => s.session.customerEmail);
  const myInquiries = useSelector((s) => s.inquiries.items.filter((q) => q.customerEmail === myEmail && q.listingId === id));

  if (!listing || listing.status !== "Published") {
    return (
      <Box>
        <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" onClick={() => router.push("/user/browse")}>Browse</Button>
        <Card sx={{ p: 6, mt: 2, textAlign: "center" }}>
          <Typography color="text.secondary">This listing isn&apos;t available.</Typography>
        </Card>
      </Box>
    );
  }

  const isCatering = listing.vertical === VERTICALS.CATERING;
  const cat = getCategory(listing.categoryId);
  const sub = getSubcategory(listing.subcategoryId);
  const h = listing.hall || {};
  const c = listing.catering || {};
  const color = cat?.color || "#4f46e5";

  const send = (data) => {
    dispatch(inquiriesActions.add({
      id: `inq-${Date.now()}`,
      status: "New",
      createdAt: todayISO(),
      bookingId: null,
      ...data,
    }));
    dispatch(notify("Inquiry sent — the vendor will get back to you"));
  };

  const detailRows = isCatering
    ? [["Guests", `${c.minGuests}–${c.maxGuests}`], ["Service style", c.serviceStyle],
       ["Starting price", `${pkr(c.perHeadFrom)} / head`], ["Staffing", c.staffing],
       ["Notice needed", c.notice], ["Travels to", c.travelsTo]].filter(([, v]) => v && v !== "–")
    : [["Capacity", h.capacity ? `${h.capacity} guests` : null], ["Minimum guests", h.minGuests || null],
       ["Setting", h.setting], ["Day rate", h.dayRate ? pkr(h.dayRate) : null],
       ["Night rate", h.nightRate ? pkr(h.nightRate) : null],
       ["Parking", h.parking ? `${h.parking} spaces` : null],
       ["Catering", h.catering], ["Advance policy", h.advancePolicy]].filter(([, v]) => v);

  return (
    <Box>
      <Button startIcon={<ArrowBackRoundedIcon />} color="inherit" sx={{ mb: 2 }} onClick={() => router.push("/user/browse")}>Browse</Button>

      <Card sx={{ overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 180, background: `linear-gradient(135deg, ${alpha(color, 0.85)}, ${color})` }} />
        <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary", mb: 0.5 }}>
            <CategoryIcon category={cat?.name} fontSize="small" />
            <Typography variant="body2">{cat?.name}{sub ? ` · ${sub.name}` : ""}</Typography>
            <Chip size="small" label={isCatering ? "Catering" : "Venue"} sx={{ ml: 1, fontWeight: 700, bgcolor: alpha(color, 0.12), color }} />
          </Stack>
          <Typography variant="h3" fontWeight={800}>{listing.title}</Typography>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 1, color: "text.secondary" }}>
            <PlaceRoundedIcon fontSize="small" />
            <Typography variant="body2">{listing.city}</Typography>
          </Stack>
          {listing.description && <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 720 }}>{listing.description}</Typography>}
        </Box>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" } }}>
        <Stack spacing={3}>
          {!isCatering ? (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight={700}>Availability</Typography>
              <Typography variant="caption" color="text.secondary">
                Red means already booked. Click a free slot to start your inquiry.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <HallAvailabilityCalendar
                  bookings={allBookings}
                  listingId={listing.id}
                  onPickSlot={(date, slot) => setAsk({ eventDate: date, slot })}
                />
              </Box>
            </Card>
          ) : (
            <>
              <Card sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Deals</Typography>
                <Stack spacing={1.5}>
                  {(c.deals || []).map((d) => (
                    <Box key={d.id} sx={{ p: 2.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={800}>{d.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Minimum {d.minGuests} guests</Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="h6" fontWeight={800} color="primary.main">{pkr(d.perHead)}</Typography>
                          <Typography variant="caption" color="text.secondary">per head</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
                        {(d.includes || []).map((x) => <Chip key={x} label={x} size="small" sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 600 }} />)}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Card>

              <Card sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Menus</Typography>
                <Stack spacing={2}>
                  {(c.menus || []).map((m) => (
                    <Box key={m.id} sx={{ p: 2.25, borderRadius: 2, bgcolor: "grey.50" }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight={800}>{m.name}</Typography>
                        <Chip size="small" label={`${pkr(m.perHead)}/head`} sx={{ fontWeight: 700, bgcolor: "background.paper" }} />
                      </Stack>
                      <Stack spacing={1.5}>
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
                </Stack>
              </Card>
            </>
          )}
        </Stack>

        <Stack spacing={3}>
          {/* Enquire */}
          <Card sx={{ p: { xs: 2, md: 3 }, position: { lg: "sticky" }, top: 24 }}>
            {myInquiries.length > 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You&apos;ve already sent {myInquiries.length} inquiry here.
              </Alert>
            )}
            <Typography variant="overline" color="text.secondary">From</Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "baseline" }}>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {isCatering ? pkr(c.perHeadFrom) : pkr(Math.min(...[h.dayRate, h.nightRate].filter(Boolean)))}
              </Typography>
              <Typography variant="body2" color="text.secondary">{isCatering ? "/head" : "/event"}</Typography>
            </Stack>
            <Button fullWidth size="large" variant="contained" startIcon={<SendRoundedIcon />} sx={{ mt: 2 }} onClick={() => setAsk({})}>
              Send inquiry
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, textAlign: "center" }}>
              Free to ask. Nothing is booked until the vendor confirms.
            </Typography>
          </Card>

          {/* Vendor */}
          {vendor && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="overline" color="text.secondary">Offered by</Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 1 }}>
                <Avatar variant="rounded" sx={{ width: 46, height: 46, borderRadius: 2, bgcolor: alpha(color, 0.14), color, fontWeight: 800 }}>{vendor.name[0]}</Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                    <Typography variant="subtitle1" fontWeight={800} noWrap>{vendor.name}</Typography>
                    {vendor.verified && <VerifiedRoundedIcon sx={{ fontSize: 16, color: "primary.main" }} />}
                  </Stack>
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                    <Rating value={vendor.rating || 0} precision={0.1} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">{vendor.reviews} reviews</Typography>
                  </Stack>
                </Box>
              </Stack>
              {vendor.experience && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
                  {vendor.experience} in business · {vendor.city}
                </Typography>
              )}
            </Card>
          )}

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Details</Typography>
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
        </Stack>
      </Box>

      <CustomerInquiryDialog
        open={Boolean(ask)}
        listing={listing}
        prefill={ask}
        onClose={() => setAsk(null)}
        onSubmit={send}
      />
    </Box>
  );
}
