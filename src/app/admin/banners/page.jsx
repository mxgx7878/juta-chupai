"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import PageHeader from "@/components/layout/PageHeader";
import FormDialog from "@/components/ui/FormDialog";
import { bannersActions } from "@/store";
import { notify } from "@/store/uiSlice";

const GRADIENTS = [
  "linear-gradient(135deg,#4f46e5,#7c3aed)",
  "linear-gradient(135deg,#0ea5a4,#2f6fed)",
  "linear-gradient(135deg,#f59e0b,#ec4899)",
  "linear-gradient(135deg,#7c3aed,#ec4899)",
];

export default function BannersPage() {
  const items = useSelector((s) => s.banners.items);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <PageHeader
        overline="Engagement"
        title="Banners"
        subtitle={`${items.filter((b) => b.active).length} active placements`}
        action={
          <Button variant="contained" startIcon={<AddPhotoAlternateRoundedIcon />} onClick={() => setOpen(true)}>
            New banner
          </Button>
        }
      />

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" } }}>
        {items.map((b) => (
          <Card key={b.title} sx={{ overflow: "hidden" }}>
            <Box sx={{ height: 150, background: b.gradient, display: "flex", alignItems: "flex-end", p: 2.5 }}>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#fff" }}>
                {b.title}
              </Typography>
            </Box>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", p: 2 }}>
              <Chip label={b.placement} size="small" sx={{ bgcolor: "grey.100", fontWeight: 600 }} />
              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  {b.active ? "Active" : "Paused"}
                </Typography>
                <Switch
                  checked={b.active}
                  onChange={() => dispatch(bannersActions.toggleField({ id: b.title, field: "active" }))}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    dispatch(bannersActions.remove(b.title));
                    dispatch(notify({ message: "Banner deleted", severity: "info" }));
                  }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Box>

      <FormDialog
        open={open}
        title="New banner"
        submitLabel="Create"
        fields={[
          { name: "title", label: "Banner title", required: true, full: true },
          { name: "placement", label: "Placement", full: true, defaultValue: "Home hero" },
        ]}
        onClose={() => setOpen(false)}
        onSubmit={(v) => {
          dispatch(
            bannersActions.add({
              title: v.title,
              placement: v.placement || "Home hero",
              active: true,
              gradient: GRADIENTS[items.length % GRADIENTS.length],
            }),
          );
          dispatch(notify("Banner created"));
        }}
      />
    </Box>
  );
}
