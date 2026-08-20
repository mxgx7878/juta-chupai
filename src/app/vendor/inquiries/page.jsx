"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import PageHeader from "@/components/layout/PageHeader";
import StatusChip from "@/components/ui/StatusChip";
import { TYPE_LABELS } from "@/config/categoryTree";
import { formatDate } from "@/utils/inquiry";
import { inquiriesActions } from "@/store";
import { notify } from "@/store/uiSlice";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];
const STATUS_TABS = ["All", "New", "Confirmed", "Completed", "Rejected"];
const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};
const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

export default function VendorInquiriesPage() {
  const vendorId = useSelector((s) => s.session.vendorId);
  const allInquiries = useSelector((s) => s.inquiries.items);
  const listings = useSelector((s) => s.listings.items);
  const dispatch = useDispatch();

  const [q, setQ] = useState("");
  const [statusTab, setStatusTab] = useState(0);

  const listingById = useMemo(() => Object.fromEntries(listings.map((l) => [l.id, l])), [listings]);
  const mine = useMemo(() => allInquiries.filter((iq) => iq.vendorId === vendorId), [allInquiries, vendorId]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return mine.filter((iq) => {
      const okStatus = statusTab === 0 || iq.status === STATUS_TABS[statusTab];
      const hay = `${iq.customerName} ${listingById[iq.listingId]?.title || ""}`.toLowerCase();
      return okStatus && (!t || hay.includes(t));
    });
  }, [mine, statusTab, q, listingById]);

  const newCount = mine.filter((iq) => iq.status === "New").length;

  const setStatus = (iq, status, label) => {
    dispatch(inquiriesActions.setStatus({ id: iq.id, status }));
    dispatch(notify(label));
  };

  const actionsFor = (iq) => {
    switch (iq.status) {
      case "New":
        return (
          <>
            <Button size="small" variant="contained" color="success" startIcon={<CheckRoundedIcon />} onClick={() => setStatus(iq, "Confirmed", "Inquiry confirmed")}>Confirm</Button>
            <Button size="small" variant="outlined" color="inherit" startIcon={<CloseRoundedIcon />} onClick={() => setStatus(iq, "Rejected", "Inquiry declined")}>Decline</Button>
          </>
        );
      case "Confirmed":
        return (
          <>
            <Button size="small" variant="contained" startIcon={<DoneAllRoundedIcon />} onClick={() => setStatus(iq, "Completed", "Marked complete")}>Complete</Button>
            <Button size="small" variant="outlined" color="inherit" startIcon={<CloseRoundedIcon />} onClick={() => setStatus(iq, "Rejected", "Inquiry declined")}>Decline</Button>
          </>
        );
      case "Rejected":
        return <Button size="small" variant="outlined" color="inherit" startIcon={<ReplayRoundedIcon />} onClick={() => setStatus(iq, "New", "Inquiry reopened")}>Reopen</Button>;
      default:
        return <Typography variant="caption" color="text.secondary">—</Typography>;
    }
  };

  return (
    <Box>
      <PageHeader
        overline="Vendor"
        title="Inquiries"
        subtitle={`${mine.length} total · ${newCount} new to review`}
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" }, mb: 2 }}>
          <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
            {STATUS_TABS.map((t) => <Tab key={t} label={t} />)}
          </Tabs>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, width: { xs: "100%", md: 240 }, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase placeholder="Search inquiries…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
          </Box>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Listing</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Event date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((iq, i) => (
                <TableRow key={iq.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: AV[i % AV.length], width: 36, height: 36, fontSize: 13 }}>{initials(iq.customerName)}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>{iq.customerName}</Typography>
                        <Typography variant="caption" color="text.secondary">{iq.customerCity} · {formatDate(iq.createdAt)}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{listingById[iq.listingId]?.title || "Listing removed"}</TableCell>
                  <TableCell>
                    <Chip label={TYPE_LABELS[iq.type] || iq.type} size="small" sx={{ fontWeight: 700, bgcolor: TYPE_COLORS[iq.type]?.bg, color: TYPE_COLORS[iq.type]?.fg }} />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                      <EventRoundedIcon sx={{ fontSize: 15 }} />
                      <Typography variant="body2">{iq.eventDate ? formatDate(iq.eventDate) : "—"}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><StatusChip status={iq.status} /></TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center" }}>{actionsFor(iq)}</Stack>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    {mine.length === 0 ? "No inquiries yet." : "No inquiries match these filters."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}