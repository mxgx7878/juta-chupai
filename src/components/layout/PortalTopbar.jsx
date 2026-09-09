"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

export default function PortalTopbar({
  onMenuClick,
  title,
  search,
  notificationPath,
  account,
  renderAccountMenu,
}) {
  const router = useRouter();
  const [anchor, setAnchor] = useState(null);
  const [query, setQuery] = useState("");

  const submitSearch = (event) => {
    if (event.key !== "Enter" || !query.trim() || !search?.onSubmit) return;
    search.onSubmit(query.trim());
    setQuery("");
  };

  const closeMenu = () => setAnchor(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(246,247,251,0.88)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: 72 }}>
        <IconButton onClick={onMenuClick} aria-label="Open navigation" sx={{ display: { md: "none" }, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <MenuRoundedIcon />
        </IconButton>

        {search ? (
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1, px: 1.5, height: 42, width: 320, borderRadius: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <InputBase
              aria-label={search.ariaLabel || search.placeholder}
              placeholder={search.placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={submitSearch}
              sx={{ fontSize: 14, flex: 1 }}
            />
          </Box>
        ) : (
          <Typography variant="subtitle1" fontWeight={800}>{title}</Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {notificationPath && (
          <IconButton aria-label="Open notifications" onClick={() => router.push(notificationPath)} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Badge color="error" variant="dot"><NotificationsNoneRoundedIcon /></Badge>
          </IconButton>
        )}

        <Button
          onClick={(event) => setAnchor(event.currentTarget)}
          color="inherit"
          aria-label="Open account menu"
          sx={{ textTransform: "none", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", px: 1, "&:hover": { borderColor: "primary.main", bgcolor: "background.paper" } }}
          startIcon={<Avatar sx={{ width: 30, height: 30, bgcolor: account.color || "primary.main", fontSize: 13 }}>{account.initials}</Avatar>}
        >
          <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.1 }}>{account.name}</Typography>
            <Typography variant="caption" color="text.secondary">{account.subtitle}</Typography>
          </Box>
        </Button>

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu} slotProps={{ paper: { sx: { minWidth: 240 } } }}>
          {renderAccountMenu?.(closeMenu)}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
