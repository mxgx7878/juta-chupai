"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import BookingWizard from "./BookingWizard";
import Reveal from "./Reveal";
import TestimonialCard from "./TestimonialCard";
import HallAvailabilityCalendar from "@/components/booking/HallAvailabilityCalendar";
import { getCategory, getSubcategory, VERTICALS } from "@/config/categoryTree";
import { getCategoryIcon } from "@/config/categoryIcons";
import { testimonials } from "@/data/publicSite";
import { pkr } from "@/utils/booking";
import { priceLabel } from "@/utils/listing";
import { colors, gradients, motion, withAlpha } from "@/theme/tokens";

/* Public listing page. Everything a customer needs to decide is on the page, and
   the booking wizard is never more than one click away — from the sidebar, from
   the sticky mobile bar, or by tapping a free slot on the calendar. */
function DetailInner({ listing, vendor }) {
  const params = useSearchParams();
  const bookings = useSelector((s) => s.bookings.items);

  /* ?book=1 arrives from listing cards and the home page, so "Book" on a card is
     a single click that lands with the wizard already open. */
  const [wizard, setWizard] = useState(params.get("book") ? {} : null);

  const isCatering = listing.vertical === VERTICALS.CATERING;
  const category = getCategory(listing.categoryId);
  const subcategory = getSubcategory(listing.subcategoryId);
  const Icon = getCategoryIcon(category?.iconKey);
  const accent = category?.color || colors.primary;
  const hall = listing.hall || {};
  const catering = listing.catering || {};
  const price = priceLabel(listing);

  const detailRows = isCatering
    ? [
        ["Guests", catering.minGuests && catering.maxGuests ? `${catering.minGuests}–${catering.maxGuests}` : null],
        ["Service style", catering.serviceStyle],
        ["Starting price", catering.perHeadFrom ? `${pkr(catering.perHeadFrom)} / head` : null],
        ["Staffing", catering.staffing],
        ["Notice needed", catering.notice],
        ["Travels to", catering.travelsTo],
      ]
    : [
        ["Capacity", hall.capacity ? `${hall.capacity} guests` : null],
        ["Minimum guests", hall.minGuests || null],
        ["Setting", hall.setting],
        ["Day rate", hall.dayRate ? pkr(hall.dayRate) : null],
        ["Night rate", hall.nightRate ? pkr(hall.nightRate) : null],
        ["Parking", hall.parking ? `${hall.parking} spaces` : null],
        ["Catering", hall.catering],
        ["Advance policy", hall.advancePolicy],
      ];

  const reviews = testimonials.filter((t) => t.city === listing.city).slice(0, 2);

  return (
    <Box sx={{ pb: { xs: 11, lg: 0 } }}>
      {/* ---------------------------------------------------------- hero -- */}
      <Box sx={{ position: "relative", background: `linear-gradient(135deg, ${withAlpha(accent, 0.92)}, ${accent})`, color: colors.textOnInverse, pt: { xs: 4, md: 6 }, pb: { xs: 6, md: 9 } }}>
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.3, backgroundImage: `radial-gradient(${withAlpha(colors.surface, 0.5)} 1px, transparent 1px)`, backgroundSize: "18px 18px" }} />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Breadcrumbs
            separator={<NavigateNextRoundedIcon fontSize="small" />}
            sx={{ mb: 2.5, "& .MuiBreadcrumbs-separator": { color: withAlpha(colors.surface, 0.6) } }}
          >
            <Typography component={Link} href="/" variant="body2" sx={{ color: withAlpha(colors.surface, 0.85), textDecoration: "none" }}>Home</Typography>
            <Typography component={Link} href="/listings" variant="body2" sx={{ color: withAlpha(colors.surface, 0.85), textDecoration: "none" }}>Listings</Typography>
            <Typography variant="body2" sx={{ color: colors.surface, fontWeight: 600 }}>{listing.title}</Typography>
          </Breadcrumbs>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ alignItems: { md: "flex-end" }, justifyContent: "space-between" }}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
                <Chip
                  icon={<Icon sx={{ fontSize: 16, color: `${colors.surface} !important` }} />}
                  label={`${category?.name}${subcategory ? ` · ${subcategory.name}` : ""}`}
                  size="small"
                  sx={{ bgcolor: withAlpha(colors.surface, 0.18), color: colors.surface, fontWeight: 600 }}
                />
                {listing.featured && (
                  <Chip size="small" label="Featured" sx={{ bgcolor: colors.secondary, color: colors.secondaryContrast, fontWeight: 700 }} />
                )}
                {vendor?.verified && (
                  <Chip size="small" icon={<VerifiedRoundedIcon sx={{ color: `${colors.surface} !important` }} />} label="Verified vendor" sx={{ bgcolor: withAlpha(colors.surface, 0.18), color: colors.surface, fontWeight: 600 }} />
                )}
              </Stack>

              <Typography variant="h1" sx={{ fontSize: { xs: 32, sm: 42, md: 52 } }}>{listing.title}</Typography>

              <Stack direction="row" spacing={2.5} sx={{ mt: 1.5, flexWrap: "wrap", rowGap: 1 }}>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                  <PlaceRoundedIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{listing.city}</Typography>
                </Stack>
                {!isCatering && hall.capacity && (
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                    <GroupsRoundedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">Up to {hall.capacity} guests</Typography>
                  </Stack>
                )}
                {vendor?.rating && (
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                    <Rating value={vendor.rating} precision={0.1} readOnly size="small" sx={{ color: colors.secondaryLight }} />
                    <Typography variant="body2">{vendor.rating} · {vendor.reviews} reviews</Typography>
                  </Stack>
                )}
              </Stack>
            </Box>

            <Button
              size="large"
              onClick={() => setWizard({})}
              startIcon={<BoltRoundedIcon />}
              sx={{ bgcolor: colors.surface, color: accent, fontWeight: 700, display: { xs: "none", md: "inline-flex" }, "&:hover": { bgcolor: colors.surface, transform: "translateY(-2px)" } }}
            >
              Book in four clicks
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* -------------------------------------------------------- body -- */}
      <Container maxWidth="lg" sx={{ mt: { xs: -3, md: -5 }, position: "relative", zIndex: 2, pb: { xs: 6, md: 10 } }}>
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 2fr) minmax(320px, 1fr)" } }}>
          {/* ------------------------------------------------- main col -- */}
          <Stack spacing={3} sx={{ minWidth: 0 }}>
            <Reveal>
              <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography variant="h5" sx={{ mb: 1.5 }}>About this {isCatering ? "service" : "venue"}</Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>{listing.description}</Typography>

                {((isCatering ? catering.cuisines : hall.amenities) || []).length > 0 && (
                  <>
                    <Divider sx={{ my: 2.5 }} />
                    <Typography variant="overline" color="text.secondary">{isCatering ? "Cuisines" : "What's included"}</Typography>
                    <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mt: 1.25 }}>
                      {(isCatering ? catering.cuisines : hall.amenities).map((item) => (
                        <Stack key={item} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <CheckRoundedIcon sx={{ fontSize: 17, color: colors.success }} />
                          <Typography variant="body2">{item}</Typography>
                        </Stack>
                      ))}
                    </Box>
                  </>
                )}
              </Card>
            </Reveal>

            {!isCatering ? (
              <Reveal>
                <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
                    <EventAvailableRoundedIcon sx={{ color: colors.primary }} />
                    <Typography variant="h5">Live availability</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Driven by confirmed bookings. Tap any free day or night slot to start — it takes you straight to the last step.
                  </Typography>
                  <Box sx={{ mt: 2.5 }}>
                    <HallAvailabilityCalendar
                      bookings={bookings}
                      listingId={listing.id}
                      onPickSlot={(eventDate, slot) => setWizard({ eventDate, slot })}
                    />
                  </Box>
                </Card>
              </Reveal>
            ) : (
              <>
                <Reveal>
                  <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Packages</Typography>
                    <Stack spacing={1.5}>
                      {(catering.deals || []).map((deal) => (
                        <Box
                          key={deal.id}
                          sx={{
                            p: 2.25, borderRadius: 2, border: "1px solid", borderColor: "divider",
                            transition: `all ${motion.base} ${motion.ease}`,
                            "&:hover": { borderColor: colors.primary, transform: "translateY(-2px)" },
                          }}
                        >
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{deal.name}</Typography>
                              <Typography variant="caption" color="text.secondary">Minimum {deal.minGuests} guests</Typography>
                            </Box>
                            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                              <Box sx={{ textAlign: { sm: "right" } }}>
                                <Typography variant="h6" sx={{ color: colors.primary }}>{pkr(deal.perHead)}</Typography>
                                <Typography variant="caption" color="text.secondary">per head</Typography>
                              </Box>
                              <Button variant="outlined" size="small" onClick={() => setWizard({ dealId: deal.id })}>Select</Button>
                            </Stack>
                          </Stack>
                          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
                            {(deal.includes || []).map((x) => (
                              <Chip key={x} size="small" label={x} sx={{ bgcolor: withAlpha(accent, 0.1), color: accent }} />
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Card>
                </Reveal>

                <Reveal>
                  <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Menus</Typography>
                    <Stack spacing={2}>
                      {(catering.menus || []).map((menu) => (
                        <Box key={menu.id} sx={{ p: 2.25, borderRadius: 2, bgcolor: colors.surfaceSubtle, border: "1px solid", borderColor: colors.border }}>
                          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{menu.name}</Typography>
                            <Chip size="small" label={`${pkr(menu.perHead)}/head`} sx={{ bgcolor: colors.surface }} />
                          </Stack>
                          <Stack spacing={1.5}>
                            {(menu.sections || []).map((section) => (
                              <Box key={section.name}>
                                <Typography variant="overline" color="text.secondary">{section.name}</Typography>
                                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mt: 0.25 }}>
                                  {(section.items || []).map((item) => <Chip key={item} size="small" variant="outlined" label={item} />)}
                                </Stack>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Card>
                </Reveal>
              </>
            )}

            <Reveal>
              <Card sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography variant="h5" sx={{ mb: 1.5 }}>Specification</Typography>
                <Table size="small">
                  <TableBody>
                    {detailRows.filter(([, value]) => value).map(([label, value]) => (
                      <TableRow key={label}>
                        <TableCell sx={{ border: 0, pl: 0, color: "text.secondary", width: "45%" }}>{label}</TableCell>
                        <TableCell sx={{ border: 0, pr: 0, fontWeight: 600, textAlign: "right" }}>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Reveal>

            {reviews.length > 0 && (
              <Reveal>
                <Typography variant="h5" sx={{ mb: 2 }}>What customers in {listing.city} say</Typography>
                <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                  {reviews.map((t) => <TestimonialCard key={t.id} testimonial={t} compact />)}
                </Box>
              </Reveal>
            )}
          </Stack>

          {/* ------------------------------------------------ side col -- */}
          <Stack spacing={3} sx={{ minWidth: 0 }}>
            <Card sx={{ p: { xs: 2.5, md: 3 }, position: { lg: "sticky" }, top: 96 }}>
              <Typography variant="overline" color="text.secondary">Starting from</Typography>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: "baseline" }}>
                <Typography variant="h3" sx={{ color: colors.primary, fontSize: 36 }}>{price.value}</Typography>
                <Typography variant="body2" color="text.secondary">{price.unit}</Typography>
              </Stack>

              <Button
                fullWidth
                size="large"
                variant="contained"
                startIcon={<BoltRoundedIcon />}
                sx={{ mt: 2.5 }}
                onClick={() => setWizard({})}
              >
                Book this {isCatering ? "caterer" : "venue"}
              </Button>

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.25, textAlign: "center" }}>
                Four clicks. No booking fee. Nothing charged today.
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Stack spacing={1.5}>
                {[
                  { icon: ShieldRoundedIcon, text: vendor?.verified ? "Vendor verified by our team" : "Vendor under verification review" },
                  { icon: EventAvailableRoundedIcon, text: isCatering ? `${catering.notice || "Short"} notice needed` : "Availability updated in real time" },
                  { icon: CheckRoundedIcon, text: isCatering ? "Menu confirmed before payment" : hall.advancePolicy || "Advance paid directly to the vendor" },
                ].map((row) => (
                  <Stack key={row.text} direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                    <row.icon sx={{ fontSize: 18, color: colors.primary }} />
                    <Typography variant="body2" color="text.secondary">{row.text}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>

            {vendor && (
              <Card sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography variant="overline" color="text.secondary">Offered by</Typography>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 1.25 }}>
                  <Avatar variant="rounded" sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: withAlpha(accent, 0.14), color: accent, fontWeight: 800 }}>
                    {vendor.name[0]}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>{vendor.name}</Typography>
                      {vendor.verified && <VerifiedRoundedIcon sx={{ fontSize: 16, color: colors.primary }} />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {vendor.experience} in business · {vendor.city}
                    </Typography>
                  </Box>
                </Stack>
                {(vendor.services || []).length > 0 && (
                  <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 2 }}>
                    {vendor.services.slice(0, 4).map((s) => <Chip key={s} size="small" label={s} sx={{ bgcolor: colors.surfaceMuted }} />)}
                  </Stack>
                )}
                {vendor.hours && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                    Open {vendor.hours}
                  </Typography>
                )}
              </Card>
            )}

            <Card sx={{ p: { xs: 2.5, md: 3 }, background: gradients.brandSoft, border: "none" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Comparing a few options?</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2 }}>
                Shortlist other {isCatering ? "caterers" : "venues"} in {listing.city} and book the one that fits.
              </Typography>
              <Button component={Link} href={`/listings?city=${encodeURIComponent(listing.city)}&type=${listing.vertical}`} variant="outlined">
                See more in {listing.city}
              </Button>
            </Card>
          </Stack>
        </Box>
      </Container>

      {/* --------------------------------------- sticky mobile book bar -- */}
      <Box
        sx={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1200,
          display: { xs: "flex", lg: "none" }, alignItems: "center", justifyContent: "space-between", gap: 2,
          px: 2, py: 1.5, bgcolor: withAlpha(colors.surface, 0.96), backdropFilter: "blur(10px)",
          borderTop: "1px solid", borderColor: colors.border,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1 }}>From</Typography>
          <Typography sx={{ fontWeight: 800, color: colors.primary }}>{price.value}<Box component="span" sx={{ fontSize: 12, color: "text.secondary", fontWeight: 500 }}>{price.unit}</Box></Typography>
        </Box>
        <Button variant="contained" startIcon={<BoltRoundedIcon />} onClick={() => setWizard({})}>Book now</Button>
      </Box>

      <BookingWizard
        open={Boolean(wizard)}
        prefill={wizard || {}}
        listing={listing}
        vendor={vendor}
        onClose={() => setWizard(null)}
      />
    </Box>
  );
}

export default function ListingDetailView(props) {
  return (
    <Suspense fallback={null}>
      <DetailInner {...props} />
    </Suspense>
  );
}
