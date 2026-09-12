"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { bookingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { VERTICALS } from "@/config/categoryTree";
import { EVENT_TYPES } from "@/data/marketplace";
import { isSlotFree } from "@/utils/availability";
import { pkr, SLOTS } from "@/utils/booking";
import { todayISO } from "@/utils/calendar";
import { formatLongDate } from "@/utils/date";
import { bookingReference } from "@/utils/reference";
import { colors, motion, withAlpha } from "@/theme/tokens";

/* Four clicks, start to finish:
     1  "Book" on the card or listing page opens this dialog
     2  pick a date (venue) or a package (catering)  -> auto-advances
     3  "Continue" once the contact fields are filled
     4  "Confirm booking"
   Anything that can be inferred is pre-filled, so only name/phone/email are
   ever typed. The vendor still has to accept, so the booking is created as
   Pending — which is also why it does not block the availability calendar. */

const STEPS = ["Date & slot", "Your details", "Confirm"];
const STEPS_CATERING = ["Package", "Your details", "Confirm"];

/** The next `count` calendar dates, so the customer never opens a date picker. */
function upcomingDates(count = 12, offset = 0) {
  const out = [];
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  for (let i = 1 + offset; out.length < count; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      day: d.getDate(),
      month: d.toLocaleDateString("en-GB", { month: "short" }),
      weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
    });
  }
  return out;
}

export default function BookingWizard({ open, onClose, listing, vendor, prefill }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const bookings = useSelector((s) => s.bookings.items);

  const isCatering = listing?.vertical === VERTICALS.CATERING;
  const deals = useMemo(() => listing?.catering?.deals || [], [listing]);

  const blank = () => ({
    eventDate: prefill?.eventDate || "",
    slot: prefill?.slot || "night",
    dealId: prefill?.dealId || deals[0]?.id || "",
    eventType: "Barat",
    guests: isCatering ? deals[0]?.minGuests || listing?.catering?.minGuests || "" : listing?.hall?.minGuests || "",
    name: "",
    email: "",
    phone: "",
    venueAddress: "",
    note: "",
  });

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(blank);
  const [done, setDone] = useState(null);
  const [dateOffset, setDateOffset] = useState(0);

  /* Re-seed whenever the dialog is opened, so a second booking starts clean. */
  useEffect(() => {
    if (!open) return;
    setForm(blank());
    setDone(null);
    setDateOffset(0);
    /* A slot picked on the calendar is already step one — skip straight ahead. */
    setStep(prefill?.eventDate || prefill?.dealId ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, listing?.id, prefill?.eventDate, prefill?.slot, prefill?.dealId]);

  if (!listing) return null;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const labels = isCatering ? STEPS_CATERING : STEPS;
  const heading = [isCatering ? "Choose a package" : "Pick your date", "Who is booking?", "Check and confirm"][step];

  /* ---- pricing ------------------------------------------------------- */
  const activeDeal = deals.find((d) => d.id === form.dealId);
  const perHead = activeDeal?.perHead || listing.catering?.perHeadFrom || 0;
  const slotRate = form.slot === "day" ? listing.hall?.dayRate : listing.hall?.nightRate;
  const total = isCatering ? perHead * (Number(form.guests) || 0) : slotRate || 0;

  const capacity = isCatering ? listing.catering?.maxGuests : listing.hall?.capacity;
  const minGuests = isCatering ? activeDeal?.minGuests || listing.catering?.minGuests : listing.hall?.minGuests;
  const overCapacity = capacity && Number(form.guests) > capacity;
  const underMinimum = minGuests && Number(form.guests) > 0 && Number(form.guests) < minGuests;

  const slotTaken = !isCatering && form.eventDate && !isSlotFree(bookings, listing.id, form.eventDate, form.slot);

  const contactValid =
    form.name.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(form.email.trim()) &&
    form.phone.replace(/\D/g, "").length >= 10 &&
    Number(form.guests) > 0 &&
    !overCapacity;

  const stepOneDone = isCatering ? Boolean(form.dealId) : Boolean(form.eventDate) && !slotTaken;

  /* ---- submit -------------------------------------------------------- */
  const confirm = () => {
    const reference = bookingReference();
    const id = `bkg-${Date.now()}`;

    dispatch(
      bookingsActions.add({
        id,
        reference,
        listingId: listing.id,
        vendorId: listing.vendorId,
        inquiryId: null,
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        eventDate: form.eventDate,
        slot: isCatering ? null : form.slot,
        eventType: form.eventType,
        guests: Number(form.guests),
        ...(isCatering ? { dealId: form.dealId, perHead, venueAddress: form.venueAddress.trim() } : {}),
        totalAmount: total,
        status: "Pending",
        createdAt: todayISO(),
        source: "Website",
        note: form.note.trim(),
        payments: [],
      }),
    );

    dispatch(notify(`Booking ${reference} sent to ${vendor?.name || "the vendor"}`));
    setDone({ reference, id });
  };

  /* ---- views --------------------------------------------------------- */
  const dates = upcomingDates(12, dateOffset);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="body">
      <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between", p: 2.5, pb: 1.5 }}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            {done ? "Booking placed" : `Booking · ${listing.title}`}
          </Typography>
          <Typography variant="h6">{done ? "You're all set" : heading}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close"><CloseRoundedIcon /></IconButton>
      </Stack>

      {!done && (
        <Box sx={{ px: 2.5, pb: 1 }}>
          <Stepper activeStep={step} alternativeLabel>
            {labels.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        </Box>
      )}

      <DialogContent dividers sx={{ borderColor: "divider" }}>
        {/* ---------------------------------------------------- success -- */}
        {done ? (
          <Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center", py: 2 }}>
            <Box
              sx={{
                width: 76, height: 76, borderRadius: "50%", display: "grid", placeItems: "center",
                bgcolor: colors.successSoft, color: colors.success,
                animation: `jc-pop ${motion.slow} ${motion.easeOut}`,
                "@keyframes jc-pop": { from: { transform: "scale(0.6)", opacity: 0 }, to: { transform: "scale(1)", opacity: 1 } },
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 44 }} />
            </Box>
            <Box>
              <Typography variant="h5">Booking request confirmed</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {vendor?.name || "The vendor"} has been notified and will confirm shortly.
                We&apos;ve emailed the details to {form.email}.
              </Typography>
            </Box>
            <Box sx={{ px: 3, py: 1.5, borderRadius: 2, bgcolor: colors.primarySoft }}>
              <Typography variant="caption" color="text.secondary">Your reference</Typography>
              <Typography variant="h5" sx={{ color: colors.primaryDark, letterSpacing: "0.06em" }}>{done.reference}</Typography>
            </Box>
            <SummaryRows
              rows={summaryRows({ listing, isCatering, form, activeDeal, perHead, total })}
            />
          </Stack>
        ) : (
          <>
            {/* ------------------------------------------ step 1: what -- */}
            {step === 0 && !isCatering && (
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1}>
                  {SLOTS.map((s) => (
                    <Chip
                      key={s.id}
                      icon={s.id === "day" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                      label={`${s.label} · ${pkr(s.id === "day" ? listing.hall?.dayRate : listing.hall?.nightRate)}`}
                      onClick={() => set("slot", s.id)}
                      variant={form.slot === s.id ? "filled" : "outlined"}
                      color={form.slot === s.id ? "primary" : "default"}
                      sx={{ fontWeight: 700, px: 0.5 }}
                    />
                  ))}
                </Stack>

                <Box>
                  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle2">Available dates</Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Button size="small" color="inherit" disabled={dateOffset === 0} onClick={() => setDateOffset(Math.max(0, dateOffset - 12))}>Earlier</Button>
                      <Button size="small" color="inherit" onClick={() => setDateOffset(dateOffset + 12)}>Later</Button>
                    </Stack>
                  </Stack>

                  <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(4, 1fr)" } }}>
                    {dates.map((d) => {
                      const free = isSlotFree(bookings, listing.id, d.iso, form.slot);
                      const selected = form.eventDate === d.iso;
                      return (
                        <Box
                          key={d.iso}
                          role="button"
                          tabIndex={free ? 0 : -1}
                          aria-disabled={!free}
                          onClick={() => { if (!free) return; set("eventDate", d.iso); setStep(1); }}
                          onKeyDown={(e) => { if (free && (e.key === "Enter" || e.key === " ")) { set("eventDate", d.iso); setStep(1); } }}
                          sx={{
                            p: 1.25, borderRadius: 2, textAlign: "center", cursor: free ? "pointer" : "not-allowed",
                            border: "1px solid",
                            borderColor: selected ? colors.primary : free ? colors.border : "transparent",
                            bgcolor: selected ? colors.primarySoft : free ? colors.surface : colors.errorSoft,
                            color: free ? "text.primary" : colors.error,
                            opacity: free ? 1 : 0.75,
                            transition: `all ${motion.fast} ${motion.ease}`,
                            "&:hover": free ? { borderColor: colors.primary, transform: "translateY(-2px)" } : {},
                          }}
                        >
                          <Typography variant="caption" color={free ? "text.secondary" : "inherit"}>{d.weekday}</Typography>
                          <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>{d.day}</Typography>
                          <Typography variant="caption" color={free ? "text.secondary" : "inherit"}>{free ? d.month : "Booked"}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <TextField
                  label="Or type an exact date"
                  type="date"
                  size="small"
                  value={form.eventDate}
                  onChange={(e) => set("eventDate", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayISO() } }}
                />
                {slotTaken && <Alert severity="warning">That slot is already booked. Pick another date or the other slot.</Alert>}
              </Stack>
            )}

            {step === 0 && isCatering && (
              <Stack spacing={1.5}>
                {deals.map((d) => {
                  const selected = form.dealId === d.id;
                  return (
                    <Box
                      key={d.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => { set("dealId", d.id); set("guests", d.minGuests); setStep(1); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { set("dealId", d.id); setStep(1); } }}
                      sx={{
                        p: 2, borderRadius: 2, cursor: "pointer", border: "1px solid",
                        borderColor: selected ? colors.primary : colors.border,
                        bgcolor: selected ? colors.primarySoft : colors.surface,
                        transition: `all ${motion.fast} ${motion.ease}`,
                        "&:hover": { borderColor: colors.primary, transform: "translateY(-2px)" },
                      }}
                    >
                      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{d.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Minimum {d.minGuests} guests</Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="h6" sx={{ color: colors.primary }}>{pkr(d.perHead)}</Typography>
                          <Typography variant="caption" color="text.secondary">per head</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mt: 1.25 }}>
                        {(d.includes || []).map((x) => (
                          <Chip key={x} size="small" label={x} sx={{ bgcolor: withAlpha(colors.primary, 0.08), color: colors.primaryDark }} />
                        ))}
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            )}

            {/* ---------------------------------------- step 2: who -- */}
            {step === 1 && (
              <Stack spacing={2}>
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                  <TextField label="Full name" size="small" required value={form.name} onChange={(e) => set("name", e.target.value)} autoFocus />
                  <TextField label="Mobile number" size="small" required placeholder="03xx-xxxxxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  <TextField label="Email" size="small" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  <TextField
                    label="Guests"
                    size="small"
                    required
                    type="number"
                    value={form.guests}
                    onChange={(e) => set("guests", e.target.value)}
                    error={Boolean(overCapacity)}
                    helperText={
                      overCapacity ? `This ${isCatering ? "caterer serves" : "venue seats"} up to ${capacity}` :
                      underMinimum ? `Minimum is ${minGuests} guests` : " "
                    }
                  />
                  <TextField label="Event type" size="small" select value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
                    {EVENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                  {isCatering && (
                    <TextField label="Venue address" size="small" value={form.venueAddress} onChange={(e) => set("venueAddress", e.target.value)} />
                  )}
                </Box>
                <TextField label="Anything the vendor should know (optional)" size="small" multiline minRows={2} value={form.note} onChange={(e) => set("note", e.target.value)} />
              </Stack>
            )}

            {/* ------------------------------------- step 3: confirm -- */}
            {step === 2 && (
              <Stack spacing={2}>
                <SummaryRows rows={summaryRows({ listing, isCatering, form, activeDeal, perHead, total })} />
                <Divider />
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="subtitle2">Estimated total</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isCatering ? `${pkr(perHead)} × ${form.guests} guests` : `${form.slot === "day" ? "Day" : "Night"} slot`}
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ color: colors.primary }}>{pkr(total)}</Typography>
                </Stack>
                <Alert severity="info" sx={{ alignItems: "center" }}>
                  Nothing is charged now. Once {vendor?.name || "the vendor"} accepts, the advance is paid
                  directly to them{listing.hall?.advancePolicy ? ` — ${listing.hall.advancePolicy.toLowerCase()}` : ""}.
                </Alert>
              </Stack>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        {done ? (
          <>
            <Button color="inherit" onClick={onClose}>Keep browsing</Button>
            <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => router.push(`/booking/${done.reference}`)}>
              View booking
            </Button>
          </>
        ) : (
          <>
            {step > 0 && (
              <Button color="inherit" startIcon={<ArrowBackRoundedIcon />} onClick={() => setStep(step - 1)}>Back</Button>
            )}
            <Box sx={{ flex: 1 }} />
            {step < 2 ? (
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                disabled={step === 0 ? !stepOneDone : !contactValid}
                onClick={() => setStep(step + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button variant="contained" size="large" startIcon={<CheckCircleRoundedIcon />} onClick={confirm}>
                Confirm booking
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

/* Same rows on the confirm step and the success screen — built once. */
function summaryRows({ listing, isCatering, form, activeDeal, perHead, total }) {
  const rows = [
    [isCatering ? "Caterer" : "Venue", listing.title],
    ["City", listing.city],
    ["Date", form.eventDate ? formatLongDate(form.eventDate) : "To be agreed"],
  ];
  if (!isCatering) rows.push(["Slot", form.slot === "day" ? "Day" : "Night"]);
  if (isCatering && activeDeal) rows.push(["Package", `${activeDeal.name} · ${pkr(perHead)}/head`]);
  rows.push(["Event", form.eventType], ["Guests", form.guests || "—"]);
  if (form.name) rows.push(["Booked by", form.name]);
  if (isCatering && form.venueAddress) rows.push(["Serving at", form.venueAddress]);
  rows.push(["Estimated total", pkr(total)]);
  return rows;
}

function SummaryRows({ rows }) {
  return (
    <Stack spacing={1} sx={{ width: "100%", p: 2, borderRadius: 2, bgcolor: colors.surfaceSubtle, border: "1px solid", borderColor: colors.border }}>
      {rows.map(([label, value]) => (
        <Stack key={label} direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>{value}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}
