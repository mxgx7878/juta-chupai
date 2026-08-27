"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { notify } from "@/store/uiSlice";

export default function Topbar({ onMenuClick }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchor, setAnchor] = useState(null);
  const [query, setQuery] = useState("");

  const submitSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/vendors?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(246,247,251,0.8)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: 72 }}>
        <IconButton
          onClick={onMenuClick}
          aria-label="Open menu"
          sx={{ display: { md: "none" }, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 1,
            px: 1.5,
            height: 42,
            width: 320,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase
            placeholder="Search vendors… (press Enter)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={submitSearch}
            sx={{ fontSize: 14, flex: 1 }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        <IconButton
          onClick={() => router.push("/notifications")}
          sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <Badge color="error" variant="dot">
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>

        <Stack
          direction="row"
          spacing={1.5}
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{
            alignItems: "center",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            pl: 0.75,
            pr: 1.5,
            py: 0.75,
            cursor: "pointer",
            "&:hover": { borderColor: "primary.main" },
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 13 }}>AY</Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1.1 }}>
            <Typography variant="body2" fontWeight={700}>
              Ayesha Yusuf
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Platform admin
            </Typography>
          </Box>
        </Stack>

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem onClick={() => { setAnchor(null); dispatch(notify("Opening profile…")); }}>
            <ListItemIcon><PersonRoundedIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchor(null); router.push("/settings"); }}>
            <ListItemIcon><SettingsRoundedIcon fontSize="small" /></ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchor(null); dispatch(notify({ message: "Signed out", severity: "info" })); }} sx={{ color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
