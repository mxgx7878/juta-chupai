"use client";

import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

export default function FormDialog({
  open,
  title,
  fields = [],
  initialValues = {},
  submitLabel = "Save",
  onClose,
  onSubmit,
}) {
  const blank = () =>
    fields.reduce((acc, f) => {
      acc[f.name] = initialValues[f.name] ?? f.defaultValue ?? "";
      return acc;
    }, {});

  const [values, setValues] = useState(blank);

  useEffect(() => {
    if (open) setValues(blank());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const canSubmit = fields
    .filter((f) => f.required)
    .every((f) => String(values[f.name] ?? "").trim().length > 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            mt: 1,
          }}
        >
          {fields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              size="small"
              select={f.type === "select"}
              type={f.type === "number" ? "number" : "text"}
              value={values[f.name]}
              onChange={set(f.name)}
              required={f.required}
              fullWidth
              sx={{ gridColumn: f.full ? "1 / -1" : "auto" }}
            >
              {f.type === "select" &&
                f.options.map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
            </TextField>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={() => {
            onSubmit(values);
            onClose();
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
