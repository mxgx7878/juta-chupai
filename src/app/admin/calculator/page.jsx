"use client";

import { useState, useMemo } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import InputAdornment from "@mui/material/InputAdornment";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import PageHeader from "@/components/layout/PageHeader";

const CATS = [
  { key: "Venue", color: "#4f46e5", pct: 0.3 },
  { key: "Catering", color: "#0ea5a4", pct: 0.28 },
  { key: "Photography", color: "#f59e0b", pct: 0.12 },
  { key: "Decor", color: "#7c3aed", pct: 0.12 },
  { key: "Makeup", color: "#ec4899", pct: 0.05 },
  { key: "Entertainment", color: "#2f6fed", pct: 0.08 },
  { key: "Misc", color: "#22a06b", pct: 0.05 },
];

const EVENT_TYPES = ["Wedding", "Mehndi", "Engagement", "Birthday", "Corporate"];
const pk = (n) => "PKR " + Math.round(n).toLocaleString("en-PK");

function splitFor(budget) {
  return CATS.reduce((acc, c) => {
    acc[c.key] = Math.round(budget * c.pct);
    return acc;
  }, {});
}

export default function CalculatorPage() {
  const [budget, setBudget] = useState(1500000);
  const [guests, setGuests] = useState(350);
  const [type, setType] = useState("Wedding");
  const [alloc, setAlloc] = useState(() => splitFor(1500000));

  const allocated = useMemo(() => Object.values(alloc).reduce((a, b) => a + (Number(b) || 0), 0), [alloc]);
  const remaining = budget - allocated;
  const over = remaining < 0;
  const perGuest = guests > 0 ? allocated / guests : 0;

  const setCat = (key, val) => setAlloc((a) => ({ ...a, [key]: Math.max(0, Number(val) || 0) }));
  const autoSplit = () => setAlloc(splitFor(budget));
  const reset = () => setAlloc(CATS.reduce((acc, c) => ({ ...acc, [c.key]: 0 }), {}));

  return (
    <Box>
      <PageHeader
        overline="Planning"
        title="Budget calculator"
        subtitle="Set a budget and allocate it across categories — see what's left in real time."
      />

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1.6fr" } }}>
        {/* Inputs + summary */}
        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Event details
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Total budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
                slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }}
                fullWidth
                size="small"
              />
              <Stack direction="row" spacing={2}>
                <TextField label="Guests" type="number" value={guests} onChange={(e) => setGuests(Math.max(0, Number(e.target.value) || 0))} fullWidth size="small" />
                <TextField label="Event type" select value={type} onChange={(e) => setType(e.target.value)} fullWidth size="small">
                  {EVENT_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" startIcon={<AutoAwesomeRoundedIcon />} onClick={autoSplit}>
                  Auto-split
                </Button>
                <Button variant="outlined" color="inherit" startIcon={<RestartAltRoundedIcon />} onClick={reset}>
                  Clear
                </Button>
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "1fr 1fr" }}>
              <Summary label="Budget" value={pk(budget)} />
              <Summary label="Allocated" value={pk(allocated)} />
              <Summary label="Remaining" value={pk(remaining)} tone={over ? "error" : remaining === 0 ? "success" : "default"} />
              <Summary label="Per guest" value={pk(perGuest)} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ height: 10, borderRadius: 999, bgcolor: "grey.100", overflow: "hidden", display: "flex" }}>
                {CATS.map((c) => {
                  const w = budget > 0 ? Math.min(100, ((Number(alloc[c.key]) || 0) / budget) * 100) : 0;
                  return <Box key={c.key} sx={{ width: `${w}%`, bgcolor: c.color }} />;
                })}
              </Box>
              <Typography variant="caption" color={over ? "error.main" : "text.secondary"} sx={{ mt: 1, display: "block" }}>
                {over ? `Over budget by ${pk(-remaining)}` : `${budget > 0 ? Math.round((allocated / budget) * 100) : 0}% of budget allocated`}
              </Typography>
            </Box>
          </Card>
        </Stack>

        {/* Allocations */}
        <Card sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            Category allocation
          </Typography>
          <Stack spacing={2.5} sx={{ mt: 2 }}>
            {CATS.map((c) => {
              const val = Number(alloc[c.key]) || 0;
              const pct = budget > 0 ? Math.round((val / budget) * 100) : 0;
              return (
                <Box key={c.key}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c.color }} />
                      <Typography variant="subtitle2" fontWeight={700}>
                        {c.key}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pct}%
                      </Typography>
                    </Stack>
                    <TextField
                      value={val}
                      onChange={(e) => setCat(c.key, e.target.value)}
                      type="number"
                      size="small"
                      sx={{ width: 150 }}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start">PKR</InputAdornment> } }}
                    />
                  </Stack>
                  <Slider
                    value={val}
                    min={0}
                    max={Math.max(budget, val)}
                    step={5000}
                    onChange={(_, v) => setCat(c.key, v)}
                    sx={{ color: c.color }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}

function Summary({ label, value, tone = "default" }) {
  const color = tone === "error" ? "error.main" : tone === "success" ? "success.main" : "text.primary";
  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50" }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={800} sx={{ color }}>
        {value}
      </Typography>
    </Box>
  );
}
