"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { monthMatrix, monthLabel, WEEKDAYS } from "@/utils/calendar";
import { availabilityMap } from "@/utils/availability";

const SLOT_STYLE = {
  free: { bg: "#f1f5f9", fg: "#94a3b8" },
  taken: { bg: "#fee2e2", fg: "#b91c1c" },
};

/**
 * Read-only day/night availability grid for a single hall.
 * Shows taken vs free only — no customer names, no amounts.
 */
export default function HallAvailabilityCalendar({ bookings, listingId, onPickSlot }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const map = useMemo(() => availabilityMap(bookings, listingId), [bookings, listingId]);
  const weeks = useMemo(() => monthMatrix(year, month), [year, month]);

  const prev = () => { const m = month - 1; if (m < 0) { setMonth(11); setYear(year - 1); } else setMonth(m); };
  const next = () => { const m = month + 1; if (m > 11) { setMonth(0); setYear(year + 1); } else setMonth(m); };
  const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

  const takenCount = Object.values(map).reduce((a, t) => a + (t.day ? 1 : 0) + (t.night ? 1 : 0), 0);

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <IconButton onClick={prev} size="small"><ChevronLeftRoundedIcon /></IconButton>
          <Typography variant="subtitle1" fontWeight={800} sx={{ minWidth: 150, textAlign: "center" }}>{monthLabel(year, month)}</Typography>
          <IconButton onClick={next} size="small"><ChevronRightRoundedIcon /></IconButton>
          <Button size="small" color="inherit" onClick={goToday}>Today</Button>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: SLOT_STYLE.free.bg, border: "1px solid", borderColor: "divider" }} />
            <Typography variant="caption" color="text.secondary">Available</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: SLOT_STYLE.taken.bg }} />
            <Typography variant="caption" color="text.secondary">Booked</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 0.75, mb: 0.75 }}>
        {WEEKDAYS.map((d) => (
          <Typography key={d} variant="caption" color="text.secondary" sx={{ textAlign: "center", fontWeight: 700 }}>{d}</Typography>
        ))}
      </Box>

      <Stack spacing={0.75}>
        {weeks.map((week, wi) => (
          <Box key={wi} sx={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 0.75 }}>
            {week.map((cell) => {
              const taken = map[cell.iso] || {};
              return (
                <Box
                  key={cell.iso + (cell.inMonth ? "" : "-o")}
                  sx={{
                    minHeight: 64, p: 0.5, borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: cell.isToday ? "primary.main" : "divider",
                    bgcolor: cell.inMonth ? "background.paper" : "grey.50",
                    opacity: cell.inMonth ? 1 : 0.45,
                  }}
                >
                  <Typography variant="caption" fontWeight={cell.isToday ? 800 : 600} sx={{ display: "block", textAlign: "right", pr: 0.25 }}>
                    {cell.day}
                  </Typography>
                  {cell.inMonth && (
                    <Stack spacing={0.25} sx={{ mt: 0.25 }}>
                      {["day", "night"].map((slot) => {
                        const isTaken = Boolean(taken[slot]);
                        const st = isTaken ? SLOT_STYLE.taken : SLOT_STYLE.free;
                        return (
                          <Tooltip key={slot} title={`${slot === "day" ? "Day" : "Night"} \u2014 ${isTaken ? "booked" : "available"}`}>
                            <Box
                              onClick={() => !isTaken && onPickSlot?.(cell.iso, slot)}
                              sx={{
                                px: 0.5, py: 0.15, borderRadius: 0.75,
                                bgcolor: st.bg, color: st.fg,
                                fontSize: 9.5, fontWeight: 700, textAlign: "center",
                                cursor: !isTaken && onPickSlot ? "pointer" : "default",
                                "&:hover": !isTaken && onPickSlot ? { filter: "brightness(0.94)" } : {},
                              }}
                            >
                              {slot === "day" ? "DAY" : "NIGHT"}
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
        {takenCount} slot{takenCount === 1 ? "" : "s"} booked overall.
      </Typography>
    </Box>
  );
}
