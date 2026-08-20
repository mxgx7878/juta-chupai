"use client";

import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MuiLink from "@mui/material/Link";
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
import { inquiriesActions } from "@/store";
import { notify } from "@/store/uiSlice";
import { TYPE_LABELS } from "@/config/categoryTree";
import { formatDate } from "@/utils/inquiry";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed", "#ec4899", "#2f6fed"];
const STATUS_TABS = ["All", "New", "Confirmed", "Completed", "Rejected"];
const TYPE_COLORS = {
  rent: { bg: "#e0edff", fg: "#1d4ed8" },
  purchase: { bg: "#dcfce7", fg: "#15803d" },
  service: { bg: "#ede9fe", fg: "#6d28d9" },
};
const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

export default function InquiriesPage() {
  const inquiries = useSelector((s) => s.inquiries.items);
  const listings = useSelector((s) => s.listings.items);
  const vendors = useSelector((s) => s.vendors.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [statusTab, setStatusTab] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");

  const listingById = useMemo(() => Object.fromEntries(listings.map((l) => [l.id, l])), [listings]);
  const vendorById = useMemo(() => Object.fromEntries(vendors.map((v) => [v.id, v])), [vendors]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return inquiries.filter((iq) => {
      const okStatus = statusTab === 0 || iq.status === STATUS_TABS[statusTab];
      const okType = typeFilter === "all" || iq.type === typeFilter;
      const listing = listingById[iq.listingId];
      const vendor = vendorById[iq.vendorId];
      const hay = `${iq.customerName} ${listing?.title || ""} ${vendor?.name || ""}`.toLowerCase();
      const okQ = !t || hay.includes(t);
      return okStatus && okType && okQ;
    });
  }, [inquiries, statusTab, typeFilter, q, listingById, vendorById]);

  const counts = useMemo(() => {
    const c = { New: 0, Confirmed: 0 };
    inquiries.forEach((iq) => { if (c[iq.status] !== undefined) c[iq.status] += 1; });
    return c;
  }, [inquiries]);

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
            <Button size="small" variant="outlined" color="inherit" startIcon={<CloseRoundedIcon />} onClick={() => setStatus(iq, "Rejected", "Inquiry rejected")}>Reject</Button>
          </>
        );
      case "Confirmed":
        return (
          <>
            <Button size="small" variant="contained" startIcon={<DoneAllRoundedIcon />} onClick={() => setStatus(iq, "Completed", "Inquiry marked complete")}>Complete</Button>
            <Button size="small" variant="outlined" color="inherit" startIcon={<CloseRoundedIcon />} onClick={() => setStatus(iq, "Rejected", "Inquiry rejected")}>Reject</Button>
          </>
        );
      case "Rejected":
        return (
          <Button size="small" variant="outlined" color="inherit" startIcon={<ReplayRoundedIcon />} onClick={() => setStatus(iq, "New", "Inquiry reopened")}>Reopen</Button>
        );
      default:
        return <Typography variant="caption" color="text.secondary">—</Typography>;
    }
  };

  return (
    <Box>
      <PageHeader
        overline="Workspace"
        title="Inquiries"
        subtitle={`${inquiries.length} total · ${counts.New} new · ${counts.Confirmed} confirmed`}
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "center" }, mb: 2 }}>
          <Tabs value={statusTab} onChange={(_, v) => setStatusTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}>
            {STATUS_TABS.map((t) => <Tab key={t} label={t} />)}
          </Tabs>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Select size="small" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ minWidth: 140 }}>
              <MenuItem value="all">All types</MenuItem>
              <MenuItem value="rent">{TYPE_LABELS.rent}</MenuItem>
              <MenuItem value="purchase">{TYPE_LABELS.purchase}</MenuItem>
              <MenuItem value="service">{TYPE_LABELS.service}</MenuItem>
            </Select>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, height: 40, width: { xs: "100%", md: 220 }, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}>
              <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <InputBase placeholder="Search inquiries…" value={q} onChange={(e) => setQ(e.target.value)} sx={{ fontSize: 14, flex: 1 }} />
            </Box>
          </Stack>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
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
              {rows.map((iq, i) => {
                const listing = listingById[iq.listingId];
                const vendor = vendorById[iq.vendorId];
                return (
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
                    <TableCell>
                      {listing ? (
                        <MuiLink component="button" underline="hover" onClick={() => router.push(`/vendors/${iq.vendorId}`)} sx={{ fontWeight: 700, color: "text.primary", textAlign: "left" }}>
                          {listing.title}
                        </MuiLink>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Listing removed</Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {vendor?.name || "Unknown vendor"}
                      </Typography>
                    </TableCell>
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
                      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center" }}>
                        {actionsFor(iq)}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    No inquiries match these filters.
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