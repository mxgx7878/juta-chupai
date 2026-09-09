"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export const SIDEBAR_WIDTH = 272;

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  if (href === "/admin" || href === "/user" || href === "/vendor") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PortalSidebar({
  navGroups = [],
  secondaryItems = [],
  badgeFor = () => 0,
  brandLabel = "PORTAL",
  BrandIcon = CelebrationRoundedIcon,
  brandColor = "primary.main",
  context,
  promo,
  onNavigate,
}) {
  const pathname = usePathname() || "/";

  const renderItem = (item) => {
    const Icon = item.icon;
    const active = isActive(pathname, item.href);
    const badge = badgeFor(item.href);

    return (
      <ListItemButton
        key={item.href}
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
        {badge > 0 && (
          <Chip
            label={badge}
            size="small"
            color={active ? "primary" : "default"}
            sx={{ height: 20, fontSize: 11 }}
          />
        )}
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper", borderRight: "1px solid", borderColor: "divider" }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", px: 3, py: 2.5 }}>
        <Avatar variant="rounded" sx={{ bgcolor: brandColor, width: 40, height: 40, borderRadius: 2 }}>
          <BrandIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.1 }}>Joota Chupai</Typography>
          <Typography variant="caption" color="text.secondary" letterSpacing="0.14em">{brandLabel}</Typography>
        </Box>
      </Stack>

      {context && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "grey.50", border: "1px solid", borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary">{context.label}</Typography>
            <Typography variant="subtitle2" fontWeight={700} noWrap>{context.value}</Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
        {navGroups.map((group) => (
          <Box key={group.label} sx={{ mb: 2 }}>
            {group.label && (
              <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, display: "block", fontSize: 11 }}>
                {group.label}
              </Typography>
            )}
            <List disablePadding>{group.items.map(renderItem)}</List>
          </Box>
        ))}
      </Box>

      {secondaryItems.length > 0 && (
        <Box sx={{ px: 2, pb: 1 }}>
          <List disablePadding>{secondaryItems.map(renderItem)}</List>
        </Box>
      )}

      {promo && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ p: 2, borderRadius: 3, background: promo.background, color: "#fff" }}>
            <Typography variant="subtitle2" fontWeight={700}>{promo.title}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.88, display: "block", mt: 0.5 }}>{promo.description}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
