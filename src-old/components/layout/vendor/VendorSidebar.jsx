"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { vendorNav } from "@/config/vendorNav";

export const SIDEBAR_WIDTH = 272;

function isActive(pathname, href) {
  if (href === "/vendor") return pathname === "/vendor";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function VendorSidebar({ onNavigate }) {
  const pathname = usePathname() || "/vendor";
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === vendorId));
  const newInquiries = useSelector(
    (s) => s.inquiries.items.filter((q) => q.vendorId === vendorId && q.status === "New").length,
  );

  const badgeFor = (href) => (href === "/vendor/inquiries" ? newInquiries : 0);

  const renderItem = (item) => {
    const Icon = item.icon;
    const active = isActive(pathname, item.href);
    const badge = badgeFor(item.href);
    return (
      <ListItemButton key={item.label} component={Link} href={item.href} selected={active} onClick={onNavigate} sx={{ py: 1 }}>
        <ListItemIcon sx={{ minWidth: 38, color: "text.secondary" }}><Icon fontSize="small" /></ListItemIcon>
        <ListItemText primary={item.label} slotProps={{ primary: { fontSize: 14, fontWeight: 600 } }} />
        {badge > 0 ? <Chip label={badge} size="small" color={active ? "primary" : "default"} sx={{ height: 20, fontSize: 11 }} /> : null}
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper", borderRight: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", px: 3, py: 2.5 }}>
        <Avatar variant="rounded" sx={{ bgcolor: "secondary.main", width: 40, height: 40, borderRadius: 2 }}>
          <StorefrontRoundedIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.1 }}>Joota Chupai</Typography>
          <Typography variant="caption" color="text.secondary" letterSpacing="0.14em">VENDOR PORTAL</Typography>
        </Box>
      </Stack>

      <Box sx={{ px: 2, pb: 1 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "divider" }}>
          <Typography variant="caption" color="text.secondary">Signed in as</Typography>
          <Typography variant="subtitle2" fontWeight={700} noWrap>{vendor?.name || "—"}</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
        <List disablePadding>{vendorNav.map(renderItem)}</List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ p: 2, borderRadius: 3, background: "linear-gradient(135deg,#0ea5a4 0%,#2f6fed 100%)", color: "#fff" }}>
          <Typography variant="subtitle2" fontWeight={700}>Keep your calendar current</Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, display: "block", mt: 0.5 }}>
            Add your bookings so you never double-book a date.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}