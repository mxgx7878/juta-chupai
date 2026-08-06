"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import InputBase from "@mui/material/InputBase";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import RowMenu from "@/components/ui/RowMenu";
import { bookingsActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { exportCsv } from "@/utils/exportCsv";

function DetailRow({ icon: Icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", py: 1 }}>
      <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main" }}>
        <Icon fontSize="small" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={700}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

const TABS = ["All", "Confirmed", "Pending", "Quote sent", "Declined"];

export default function BookingsPage() {
  const items = useSelector((s) => s.bookings.items);
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const [view, setView] = useState(null);

  const setStatus = (id, status, msg, severity) => {
    dispatch(bookingsActions.setStatus({ id, status }));
    dispatch(notify(severity ? { message: msg, severity } : msg));
    setView((v) => (v && v.id === id ? { ...v, status } : v));
  };

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((b) => {
      const okTab = tab === 0 || b.status === TABS[tab];
      const okQ = !t || b.event.toLowerCase().includes(t) || b.customer.toLowerCase().includes(t) || b.vendor.toLowerCase().includes(t) || b.id.toLowerCase().includes(t);
      return okTab && okQ;
    });
  }, [items, tab, q]);

  return (
    <Box>
      <PageHeader
        overline="Workspace"
        title="Bookings"
        subtitle={`${items.length} bookings across the marketplace`}
        action={
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={() => exportCsv("bookings.csv", rows.map(({ id, event, customer, vendor, city, date, amount, status }) => ({ id, event, customer, vendor, city, date, amount, status })))}
          >
            Export
          </Button>
        }
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" }, mb: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}
          >
            {TABS.map((t) => (
              <Tab key={t} label={t} />
            ))}
          </Tabs>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              height: 40,
              width: { xs: "100%", md: 280 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
            }}
          >
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search bookings…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow>
                <TableCell>Booking</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      onClick={() => setView(b)}
                      sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
                    >
                      {b.event}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      #{b.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{b.customer}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{b.vendor}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{b.city}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{b.date}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700}>
                      {b.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={b.status} />
                  </TableCell>
                  <TableCell align="right">
                    <RowMenu
                      actions={[
                        { label: "View details", icon: <VisibilityRoundedIcon fontSize="small" />, onClick: () => setView(b) },
                        { label: "Mark confirmed", icon: <CheckRoundedIcon fontSize="small" />, onClick: () => setStatus(b.id, "Confirmed", `#${b.id} confirmed`) },
                        { label: "Decline", icon: <CloseRoundedIcon fontSize="small" />, danger: true, onClick: () => setStatus(b.id, "Declined", `#${b.id} declined`, "error") },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    No bookings here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={!!view} onClose={() => setView(null)} fullWidth maxWidth="sm">
        {view && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  {view.event}
                  <Typography variant="body2" color="text.secondary">
                    Booking #{view.id}
                  </Typography>
                </Box>
                <StatusChip status={view.status} />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, columnGap: 2 }}>
                <DetailRow icon={CelebrationRoundedIcon} label="Event" value={view.event} />
                <DetailRow icon={CalendarMonthRoundedIcon} label="Date" value={view.date} />
                <DetailRow icon={PersonRoundedIcon} label="Customer" value={view.customer} />
                <DetailRow icon={StorefrontRoundedIcon} label="Vendor" value={view.vendor} />
                <DetailRow icon={PlaceRoundedIcon} label="City" value={view.city} />
                <DetailRow icon={PaymentsRoundedIcon} label="Amount" value={view.amount} />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Update this booking:
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button color="inherit" onClick={() => setView(null)}>
                Close
              </Button>
              <Button variant="outlined" color="error" startIcon={<CloseRoundedIcon />} onClick={() => setStatus(view.id, "Declined", `#${view.id} declined`, "error")}>
                Decline
              </Button>
              <Button variant="contained" color="success" startIcon={<CheckRoundedIcon />} onClick={() => setStatus(view.id, "Confirmed", `#${view.id} confirmed`)}>
                Confirm
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
