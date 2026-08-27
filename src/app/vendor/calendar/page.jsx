"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import { monthMatrix, monthLabel, WEEKDAYS, todayISO } from "@/utils/calendar";
import { BLOCKING_STATUSES, SLOT_LABELS, pkr, paymentSummary } from "@/utils/booking";
import { formatDate } from "@/utils/date";
import { vendorVertical, copyFor } from "@/utils/vertical";
import { VERTICALS } from "@/config/categoryTree";

/* Each hall gets a stable colour so a month view reads at a glance. */
const HALL_COLORS = ["#4f46e5", "#0ea5a4", "#f59e0b", "#ec4899", "#7c3aed", "#2f6fed", "#22a06b", "#d99400"];

export default function VendorCalendarPage() {
  const router = useRouter();
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === vendorId));
  const storeCategories = useSelector((s) => s.categories.items);
  const allListings = useSelector((s) => s.listings.items);
  const allBookings = useSelector((s) => s.bookings.items);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [activeListing, setActiveListing] = useState("all");
  const [dayDialog, setDayDialog] = useState(null);

  const vertical = vendorVertical(vendor, storeCategories);
  const copy = copyFor(vertical);
  const isCatering = vertical === VERTICALS.CATERING;
  const myListings = useMemo(() => allListings.filter((l) => l.vendorId === vendorId), [allListings, vendorId]);

  const colorOf = useMemo(() => {
    const m = {};
    myListings.forEach((l, i) => { m[l.id] = HALL_COLORS[i % HALL_COLORS.length]; });
    return m;
  }, [myListings]);

  const listingById = useMemo(() => Object.fromEntries(myListings.map((l) => [l.id, l])), [myListings]);

  /* Only bookings that actually hold a date land on the calendar. */
  const visible = useMemo(() => {
    const ids = new Set(myListings.map((l) => l.id));
    return allBookings.filter(
      (b) =>
        ids.has(b.listingId) &&
        BLOCKING_STATUSES.includes(b.status) &&
        (activeListing === "all" || b.listingId === activeListing),
    );
  }, [allBookings, myListings, activeListing]);

  const byDate = useMemo(() => {
    const m = {};
    visible.forEach((b) => { (m[b.eventDate] = m[b.eventDate] || []).push(b); });
    Object.values(m).forEach((arr) => arr.sort((a, x) => (a.slot === "day" ? -1 : 1) - (x.slot === "day" ? -1 : 1)));
    return m;
  }, [visible]);

  const weeks = useMemo(() => monthMatrix(year, month), [year, month]);
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthBookings = visible.filter((b) => (b.eventDate || "").startsWith(monthPrefix));
  const monthValue = monthBookings.reduce((a, b) => a + (Number(b.totalAmount) || 0), 0);

  const prev = () => { const m = month - 1; if (m < 0) { setMonth(11); setYear(year - 1); } else setMonth(m); };
  const next = () => { const m = month + 1; if (m > 11) { setMonth(0); setYear(year + 1); } else setMonth(m); };
  const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

  if (myListings.length === 0) {
    return (
      <Box>
        <PageHeader overline="Vendor" title="Calendar" subtitle="Bookings across all your listings." />
        <Card sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>Add a {copy.listingNoun.toLowerCase()} first — the calendar fills from its bookings.</Typography>
          <Button variant="contained" onClick={() => router.push("/vendor/listings")}>Go to {copy.navLabel}</Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        overline="Vendor"
        title="Calendar"
        subtitle={`${monthBookings.length} booking${monthBookings.length === 1 ? "" : "s"} in ${monthLabel(year, month)} \u00b7 ${pkr(monthValue)}`}
        action={<Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => router.push("/vendor/bookings")}>New booking</Button>}
      />

      {/* Hall filter */}
      <Card sx={{ p: { xs: 1.5, md: 2 }, mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={`All ${copy.listingNounPlural.toLowerCase()} (${myListings.length})`}
            onClick={() => setActiveListing("all")}
            variant={activeListing === "all" ? "filled" : "outlined"}
            color={activeListing === "all" ? "primary" : "default"}
            sx={{ fontWeight: 700 }}
          />
          {myListings.map((l) => (
            <Chip
              key={l.id}
              label={l.title}
              onClick={() => setActiveListing(l.id)}
              variant={activeListing === l.id ? "filled" : "outlined"}
              sx={{
                fontWeight: 700,
                ...(activeListing === l.id
                  ? { bgcolor: colorOf[l.id], color: "#fff" }
                  : { borderColor: colorOf[l.id], color: colorOf[l.id] }),
              }}
              icon={<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: activeListing === l.id ? "#fff" : colorOf[l.id], ml: 1 }} />}
            />
          ))}
        </Stack>
      </Card>

      <Card sx={{ p: { xs: 1.5, md: 2.5 } }}>
        {/* Month nav */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <IconButton onClick={prev} size="small"><ChevronLeftRoundedIcon /></IconButton>
            <Typography variant="h6" fontWeight={800} sx={{ minWidth: 170, textAlign: "center" }}>{monthLabel(year, month)}</Typography>
            <IconButton onClick={next} size="small"><ChevronRightRoundedIcon /></IconButton>
            <Button size="small" color="inherit" onClick={goToday}>Today</Button>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {isCatering
              ? "Catering never blocks a date — several events on one day is fine."
              : "Day and night are separate slots — a hall can hold two bookings on one date."}
          </Typography>
        </Stack>

        {/* Weekday header */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, mb: 1 }}>
          {WEEKDAYS.map((d) => (
            <Typography key={d} variant="caption" color="text.secondary" sx={{ textAlign: "center", fontWeight: 700 }}>{d}</Typography>
          ))}
        </Box>

        {/* Weeks */}
        <Stack spacing={1}>
          {weeks.map((week, wi) => (
            <Box key={wi} sx={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1 }}>
              {week.map((cell) => {
                const entries = byDate[cell.iso] || [];
                return (
                  <Box
                    key={cell.iso + (cell.inMonth ? "" : "-o")}
                    onClick={() => cell.inMonth && entries.length > 0 && setDayDialog(cell.iso)}
                    sx={{
                      minHeight: { xs: 88, md: 110 },
                      p: 0.75,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: cell.isToday ? "primary.main" : "divider",
                      bgcolor: cell.inMonth ? "background.paper" : "grey.50",
                      opacity: cell.inMonth ? 1 : 0.5,
                      cursor: cell.inMonth && entries.length ? "pointer" : "default",
                      transition: "0.12s",
                      "&:hover": cell.inMonth && entries.length ? { boxShadow: 2 } : {},
                    }}
                  >
                    <Typography variant="caption" fontWeight={cell.isToday ? 800 : 600} sx={{ display: "block", textAlign: "right", color: cell.isToday ? "primary.main" : "text.secondary" }}>
                      {cell.day}
                    </Typography>

                    <Stack spacing={0.4} sx={{ mt: 0.4 }}>
                      {entries.slice(0, 3).map((b) => {
                        const col = colorOf[b.listingId] || "#64748b";
                        return (
                          <Tooltip key={b.id} title={`${listingById[b.listingId]?.title} \u00b7 ${SLOT_LABELS[b.slot]} \u00b7 ${b.customerName}`}>
                            <Box
                              sx={{
                                px: 0.6, py: 0.2, borderRadius: 0.75,
                                bgcolor: `${col}1f`, borderLeft: "3px solid", borderColor: col,
                                overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                              }}
                            >
                              <Typography sx={{ fontSize: 10, fontWeight: 800, color: col, lineHeight: 1.3 }} noWrap>
                                {b.slot ? `${SLOT_LABELS[b.slot][0]} · ` : ""}{b.customerName}
                              </Typography>
                            </Box>
                          </Tooltip>
                        );
                      })}
                      {entries.length > 3 && (
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.secondary", pl: 0.6 }}>
                          +{entries.length - 3} more
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Day detail */}
      <Dialog open={Boolean(dayDialog)} onClose={() => setDayDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dayDialog ? formatDate(dayDialog) : ""}
          <Typography variant="body2" color="text.secondary">
            {(byDate[dayDialog] || []).length} booking{(byDate[dayDialog] || []).length === 1 ? "" : "s"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {(byDate[dayDialog] || []).map((b) => {
              const col = colorOf[b.listingId] || "#64748b";
              const sum = paymentSummary(b);
              return (
                <Box key={b.id} sx={{ p: 1.75, borderRadius: 2, border: "1px solid", borderColor: "divider", borderLeft: "4px solid", borderLeftColor: col }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={800} noWrap>{b.customerName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {listingById[b.listingId]?.title}{b.slot ? ` · ${SLOT_LABELS[b.slot]}` : ""} · {b.eventType} · {b.guests} guests
                      </Typography>
                    </Box>
                    <StatusChip status={b.status} />
                  </Stack>
                  <Divider sx={{ my: 1.25 }} />
                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption" color="text.secondary">Total <b>{pkr(sum.total)}</b></Typography>
                    <Typography variant="caption" color="success.main">Received <b>{pkr(sum.received)}</b></Typography>
                    <Typography variant="caption" color={sum.remaining > 0 ? "error.main" : "success.main"}>Left <b>{pkr(sum.remaining)}</b></Typography>
                  </Stack>
                  <Button size="small" sx={{ mt: 1 }} onClick={() => { setDayDialog(null); router.push("/vendor/bookings"); }}>
                    Open in bookings
                  </Button>
                </Box>
              );
            })}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
