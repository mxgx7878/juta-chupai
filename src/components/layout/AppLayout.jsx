"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PortalShell from "./PortalShell";
import { navigationGroups, secondaryNavigation } from "@/config/navigation";
import { notify } from "@/store/uiSlice";

export default function AppLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const messagesBadge = useSelector((state) =>
    state.messages.conversations.reduce((total, conversation) => total + (conversation.unread || 0), 0),
  );
  const vendorsBadge = useSelector((state) =>
    state.vendors.items.filter((vendor) => vendor.status === "Pending").length,
  );

  const badgeFor = (href) => ({ "/messages": messagesBadge, "/vendors": vendorsBadge })[href] || 0;

  return (
    <PortalShell
      sidebar={{
        navGroups: navigationGroups,
        secondaryItems: secondaryNavigation,
        badgeFor,
        BrandIcon: CelebrationRoundedIcon,
        brandLabel: "ADMIN SUITE",
        promo: {
          title: "Season peak is live",
          description: "Wedding-season traffic is up 34%. Review featured slots.",
          background: "linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)",
        },
      }}
      topbar={{
        search: {
          placeholder: "Search vendors… (press Enter)",
          ariaLabel: "Search vendors",
          onSubmit: (query) => router.push(`/vendors?q=${encodeURIComponent(query)}`),
        },
        notificationPath: "/notifications",
        account: { name: "Ayesha Yusuf", subtitle: "Platform admin", initials: "AY" },
        renderAccountMenu: (close) => [
          <MenuItem key="profile" onClick={() => { close(); dispatch(notify("Opening profile…")); }}>
            <ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>,
          <MenuItem key="settings" onClick={() => { close(); router.push("/settings"); }}>
            <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>
            Settings
          </MenuItem>,
          <Divider key="divider" />,
          <MenuItem key="sign-out" onClick={() => { close(); dispatch(notify({ message: "Signed out", severity: "info" })); }} sx={{ color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
            Sign out
          </MenuItem>,
        ],
      }}
    >
      {children}
    </PortalShell>
  );
}
