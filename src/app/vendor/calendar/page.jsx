"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PageHeader from "@/components/layout/PageHeader";
import CalendarEntryDialog from "@/components/vendor/CalendarEntryDialog";
import { calendarActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { monthMatrix, monthLabel, WEEKDAYS, KIND_COLORS, CALENDAR_KINDS, todayISO } from "@/utils/calendar";
import { uniqueSlug } from "@/utils/slug";

export default function VendorCalendarPage() {
  const vendorId = useSelector((s) => s.session.vendorId);
  const allEntries = useSelector((s) => s.calendar.items);
  const dispatch = useDispatch();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [dialog, setDialog] = useState({ open: false, entry: null, date: "" });

  const myEntries = useMemo(() => allEntries.filter((e) => e.vendorId === vendorId), [allEntries, vendorId]);
  const byDate = useMemo(() => {
    const m = {};
    myEntries.forEach((e) => { (m[e.date] = m[e.date] || []).push(e); });
    Object.values(m).forEach((arr) => arr.sort((a, b) => (a.time || "").localeCompare(b.time || "")));
    return m;
  }, [myEntries]);

  const weeks = useMemo(() => monthMatrix(year, month), [year, month]);
  const monthCount = myEntries.filter((e) => e.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length;

  const prev = () => { const m = month - 1; if (m < 0) { setMonth(11); setYear(year - 1); } else setMonth(m); };
  const next = () => { const m = month + 1; if (m > 11) { setMonth(0); setYear(year + 1); } else setMonth(m); };
  const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

  const openAdd = (date) => setDialog({ open: true, entry: null, date: date || todayISO() });
  const openEdit = (entry) => setDialog({ open: true, entry, date: entry.date });
  const close = () => setDialog({ open: false, entry: null, date: "" });

  const submit = (data) => {
    if (dialog.entry) {
      dispatch(calendarActions.update({ ...dialog.entry, ...data }));
      dispatch(notify("Entry updated"));
    } else {
      const id = `cal-${uniqueSlug(data.title, allEntries.map((e) => e.id.replace(/^cal-/, "")))}`;
      dispatch(calendarActions.add({ id, vendorId, ...data }));
      dispatch(notify("Added to calendar"));
    }
  };
  const remove = (entry) => { dispatch(calendarActions.remove(entry.id)); dispatch(notify({ message: "Entry removed", severity: "info" })); };

  return (
    <Box>
      <PageHeader
        overline="Vendor"
        title="Calendar"
        subtitle={`${monthCount} entr${monthCount === 1 ? "y" : "ies"} in ${monthLabel(year, month)} · your bookings, holds and notes`}
        action={<Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => openAdd(todayISO())}>Add entry</Button>}
      />

      <Card sx={{ p: { xs: 1.5, md: 2.5 } }}>
        {/* Month nav + legend */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <IconButton onClick={prev} size="small"><ChevronLeftRoundedIcon /></IconButton>
            <Typography variant="h6" fontWeight={800} sx={{ minWidth: 170, textAlign: "center" }}>{monthLabel(year, month)}</Typography>
            <IconButton onClick={next} size="small"><ChevronRightRoundedIcon /></IconButton>
            <Button size="small" color="inherit" onClick={goToday}>Today</Button>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            {CALENDAR_KINDS.map((k) => (
              <Stack key={k.id} direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: KIND_COLORS[k.id].dot }} />
                <Typography variant="caption" color="text.secondary">{k.label}</Typography>
              </Stack>
            ))}
          </Stack>
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
                    onClick={() => cell.inMonth && openAdd(cell.iso)}
                    sx={{
                      minHeight: { xs: 84, md: 104 },
                      p: 0.75,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: cell.isToday ? "primary.main" : "divider",
                      bgcolor: cell.inMonth ? "background.paper" : "grey.50",
                      opacity: cell.inMonth ? 1 : 0.55,
                      cursor: cell.inMonth ? "pointer" : "default",
                      transition: "0.12s",
                      "&:hover": cell.inMonth ? { borderColor: "primary.light", boxShadow: 1 } : {},
                      display: "flex", flexDirection: "column",
                    }}
                  >
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" fontWeight={cell.isToday ? 800 : 600} color={cell.isToday ? "primary.main" : "text.primary"}>
                        {cell.day}
                      </Typography>
                      {entries.length > 0 && <Typography variant="caption" color="text.secondary">{entries.length}</Typography>}
                    </Stack>
                    <Stack spacing={0.5} sx={{ mt: 0.5, overflow: "hidden" }}>
                      {entries.slice(0, 3).map((e) => {
                        const c = KIND_COLORS[e.kind] || KIND_COLORS.note;
                        return (
                          <Box
                            key={e.id}
                            onClick={(ev) => { ev.stopPropagation(); openEdit(e); }}
                            sx={{ px: 0.75, py: 0.25, borderRadius: 1, bgcolor: c.bg, color: c.fg, display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, "&:hover": { filter: "brightness(0.97)" } }}
                          >
                            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: c.dot, flexShrink: 0 }} />
                            <Typography variant="caption" noWrap sx={{ fontWeight: 600, fontSize: 11 }}>
                              {e.time ? `${e.time} · ` : ""}{e.title}
                            </Typography>
                          </Box>
                        );
                      })}
                      {entries.length > 3 && (
                        <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>+{entries.length - 3} more</Typography>
                      )}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Stack>
      </Card>

      <CalendarEntryDialog
        open={dialog.open}
        entry={dialog.entry}
        date={dialog.date}
        vendorId={vendorId}
        onClose={close}
        onSubmit={submit}
        onDelete={remove}
      />
    </Box>
  );
}