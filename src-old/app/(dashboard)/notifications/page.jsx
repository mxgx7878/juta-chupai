"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import { notificationsActions } from "@/store";
import { notify } from "@/store/uiSlice";

const AUDIENCES = ["All users", "All customers", "Approved vendors", "Customers with drafts", "By city"];
const REACH = {
  "All users": "24,110",
  "All customers": "12,840",
  "Approved vendors": "1,284",
  "Customers with drafts": "1,204",
  "By city": "8,420",
};

export default function NotificationsPage() {
  const items = useSelector((s) => s.notifications.items);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ title: "", message: "", audience: "All users" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canSend = form.title.trim() && form.message.trim();

  const push = (status) => {
    dispatch(
      notificationsActions.add({
        title: form.title,
        audience: form.audience,
        reach: REACH[form.audience] || "—",
        sent: status === "Sent" ? "just now" : "Scheduled",
        status,
      }),
    );
    dispatch(notify(status === "Sent" ? "Notification sent" : "Notification scheduled"));
    setForm({ title: "", message: "", audience: "All users" });
  };

  return (
    <Box>
      <PageHeader overline="Engagement" title="Push Notifications" subtitle="Compose and schedule push notifications" />

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
        <Card sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            New notification
          </Typography>
          <Stack spacing={2}>
            <TextField label="Title" fullWidth size="small" value={form.title} onChange={set("title")} placeholder="e.g. New vendors in your city" />
            <TextField label="Message" fullWidth multiline minRows={3} value={form.message} onChange={set("message")} placeholder="Write your push message…" />
            <TextField label="Audience" select fullWidth size="small" value={form.audience} onChange={set("audience")}>
              {AUDIENCES.map((a) => (
                <MenuItem key={a} value={a}>
                  {a} · {REACH[a]} reach
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={1.5}>
              <Button variant="contained" startIcon={<SendRoundedIcon />} disabled={!canSend} onClick={() => push("Sent")}>
                Send now
              </Button>
              <Button variant="outlined" color="inherit" startIcon={<ScheduleRoundedIcon />} disabled={!canSend} onClick={() => push("Scheduled")}>
                Schedule
              </Button>
            </Stack>
          </Stack>
        </Card>

        <Card sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
            <CampaignRoundedIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Recent
            </Typography>
          </Stack>
          <List disablePadding>
            {items.map((n, i) => (
              <Box key={`${n.title}-${i}`}>
                <ListItem disableGutters secondaryAction={<StatusChip status={n.status} />}>
                  <ListItemAvatar>
                    <Avatar variant="rounded" sx={{ bgcolor: "grey.100", color: "primary.main", borderRadius: 2 }}>
                      <CampaignRoundedIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={n.title}
                    secondary={`${n.audience} · ${n.reach} reached · ${n.sent}`}
                    slotProps={{ primary: { fontWeight: 700, fontSize: 14 }, secondary: { fontSize: 12 } }}
                  />
                </ListItem>
                {i < items.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>
        </Card>
      </Box>
    </Box>
  );
}
