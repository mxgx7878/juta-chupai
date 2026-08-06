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
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import { navigationGroups, secondaryNavigation } from "@/config/navigation";

export const SIDEBAR_WIDTH = 272;

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname() || "/";

  const bookingsBadge = useSelector((s) => s.bookings.items.filter((b) => b.status === "Pending").length);
  const messagesBadge = useSelector((s) => s.messages.conversations.reduce((a, c) => a + (c.unread || 0), 0));
  const vendorsBadge = useSelector((s) => s.vendors.items.filter((v) => v.status === "Pending").length);
  const badgeFor = (href) =>
    ({ "/bookings": bookingsBadge, "/messages": messagesBadge, "/vendors": vendorsBadge }[href]) || 0;

  const renderItem = (item) => {
    const Icon = item.icon;
    const active = isActive(pathname, item.href);
    const badge = badgeFor(item.href);
    return (
      <ListItemButton
        key={item.label}
        component={Link}
        href={item.href}
        selected={active}
        onClick={onNavigate}
        sx={{ py: 1 }}
      >
        <ListItemIcon sx={{ minWidth: 38, color: "text.secondary" }}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          slotProps={{ primary: { fontSize: 14, fontWeight: 600 } }}
        />
        {badge > 0 ? (
          <Chip
            label={badge}
            size="small"
            color={active ? "primary" : "default"}
            sx={{ height: 20, fontSize: 11 }}
          />
        ) : null}
      </ListItemButton>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", px: 3, py: 2.5 }}>
        <Avatar
          variant="rounded"
          sx={{ bgcolor: "primary.main", width: 40, height: 40, borderRadius: 2 }}
        >
          <CelebrationRoundedIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.1 }}>
            Joota Chupai
          </Typography>
          <Typography variant="caption" color="text.secondary" letterSpacing="0.14em">
            ADMIN SUITE
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
        {navigationGroups.map((group) => (
          <Box key={group.label} sx={{ mb: 2 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ px: 1.5, display: "block", fontSize: 11 }}
            >
              {group.label}
            </Typography>
            <List disablePadding>{group.items.map(renderItem)}</List>
          </Box>
        ))}
      </Box>

      <Box sx={{ px: 2, pb: 1 }}>
        <List disablePadding>{secondaryNavigation.map(renderItem)}</List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)",
            color: "#fff",
          }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            Season peak is live
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85, display: "block", mt: 0.5 }}>
            Wedding-season traffic is up 34%. Review featured slots.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
