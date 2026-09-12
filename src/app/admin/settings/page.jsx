"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { notify } from "@/store/uiSlice";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import PageHeader from "@/components/layout/PageHeader";

const TABS = ["General", "Payments", "Notifications"];

function Row({ title, desc, control }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, py: 2 }}
    >
      <Box>
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {desc}
        </Typography>
      </Box>
      {control}
    </Stack>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();

  return (
    <Box>
      <PageHeader overline="Admin" title="Settings" subtitle="Configure your marketplace" />

      <Card sx={{ p: { xs: 2, md: 3 }, maxWidth: 820 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 1, "& .MuiTab-root": { textTransform: "none", fontWeight: 600 } }}
        >
          {TABS.map((t) => (
            <Tab key={t} label={t} />
          ))}
        </Tabs>
        <Divider sx={{ mb: 1 }} />

        {tab === 0 && (
          <Box>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                py: 2,
              }}
            >
              <TextField label="Marketplace name" size="small" defaultValue="Joota Chupai" />
              <TextField label="Support email" size="small" defaultValue="help@jootachupai.com" />
              <TextField label="Default currency" size="small" select defaultValue="PKR">
                {["PKR", "USD", "AED"].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Default language" size="small" select defaultValue="English">
                {["English", "Urdu"].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Divider />
            <Row title="Vendor auto-approval" desc="Automatically approve verified vendors" control={<Switch />} />
            <Divider />
            <Row title="Maintenance mode" desc="Temporarily disable the public marketplace" control={<Switch />} />
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Row title="Online payments" desc="Accept card & wallet payments in-app" control={<Switch defaultChecked />} />
            <Divider />
            <Row title="Manual payment (screenshot)" desc="Allow customers to upload payment proof" control={<Switch defaultChecked />} />
            <Divider />
            <Box sx={{ py: 2, maxWidth: 320 }}>
              <TextField label="Platform commission (%)" size="small" defaultValue="8" fullWidth />
            </Box>
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Row title="Email notifications" desc="Send booking updates via email" control={<Switch defaultChecked />} />
            <Divider />
            <Row title="SMS fallback" desc="Send SMS when push can't be delivered" control={<Switch defaultChecked />} />
            <Divider />
            <Row title="Weekly digest" desc="Email admins a weekly performance summary" control={<Switch />} />
          </Box>
        )}

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => dispatch(notify("Settings saved"))}>
            Save changes
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => dispatch(notify({ message: "Changes discarded", severity: "info" }))}>
            Cancel
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
