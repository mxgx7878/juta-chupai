"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

const navItems = [
  { label: "Home", href: "/", icon: HomeRoundedIcon },
  { label: "All listings", href: "/listings", icon: SearchRoundedIcon },
  { label: "Venues", href: "/listings?type=hall", icon: AccountBalanceRoundedIcon },
  { label: "Catering", href: "/listings?type=catering", icon: RestaurantRoundedIcon },
];

function activePath(pathname, href) {
  const path = href.split("?")[0];
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

export default function PublicShell({ children }) {
  const pathname = usePathname() || "/";
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} color="inherit" sx={{ bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar sx={{ width: "100%", maxWidth: 1440, mx: "auto", minHeight: { xs: 68, md: 76 }, px: { xs: 2, md: 3 } }}>
          <Stack component={Link} href="/" direction="row" spacing={1.25} sx={{ alignItems: "center", color: "inherit", textDecoration: "none" }}>
            <Avatar variant="rounded" sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: "primary.main" }}>
              <CelebrationRoundedIcon />
            </Avatar>
            <Box>
              <Typography fontWeight={900} sx={{ lineHeight: 1.05, letterSpacing: "-0.02em" }}>Joota Chupai</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: "0.14em" }}>WEDDING MARKETPLACE</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ ml: 5, display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => (
              <Button key={item.href} component={Link} href={item.href} color={activePath(pathname, item.href) ? "primary" : "inherit"} sx={{ px: 1.5 }}>
                {item.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ flex: 1 }} />
          <Button component={Link} href="/vendor/login" color="inherit" startIcon={<StorefrontRoundedIcon />} sx={{ display: { xs: "none", sm: "inline-flex" } }}>Vendor portal</Button>
          <Button component={Link} href="/user/login" variant="contained" startIcon={<LoginRoundedIcon />} sx={{ ml: 1, display: { xs: "none", sm: "inline-flex" } }}>Sign in</Button>
          <IconButton aria-label="Open menu" onClick={() => setDrawerOpen(true)} sx={{ display: { md: "none" }, ml: 1 }}>
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 290, p: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", px: 1, py: 1.5 }}>
            <Avatar variant="rounded" sx={{ bgcolor: "primary.main" }}><CelebrationRoundedIcon /></Avatar>
            <Typography fontWeight={800}>Joota Chupai</Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.href} component={Link} href={item.href} selected={activePath(pathname, item.href)} onClick={() => setDrawerOpen(false)}>
                <ListItemIcon><item.icon fontSize="small" /></ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Button component={Link} href="/user/login" variant="contained" fullWidth>Customer sign in</Button>
            <Button component={Link} href="/vendor/login" variant="outlined" color="inherit" fullWidth>Vendor portal</Button>
            <Button component={Link} href="/admin" variant="text" color="inherit" fullWidth>Admin portal</Button>
          </Stack>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flex: 1 }}>{children}</Box>

      <Box component="footer" sx={{ bgcolor: "#17152b", color: "#fff", mt: 8 }}>
        <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 3 }, py: { xs: 5, md: 7 } }}>
          <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "1.5fr 1fr 1fr" } }}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <CelebrationRoundedIcon color="secondary" />
                <Typography variant="h6" fontWeight={900}>Joota Chupai</Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 1.5, maxWidth: 360 }}>A simple way to discover trusted venues, caterers and wedding services across Pakistan.</Typography>
            </Box>
            <Box>
              <Typography fontWeight={800} sx={{ mb: 1.5 }}>Explore</Typography>
              <Stack spacing={1}>{navItems.slice(1).map((item) => <Typography key={item.href} component={Link} href={item.href} variant="body2" sx={{ color: "inherit", opacity: 0.72, textDecoration: "none" }}>{item.label}</Typography>)}</Stack>
            </Box>
            <Box>
              <Typography fontWeight={800} sx={{ mb: 1.5 }}>Portals</Typography>
              <Stack spacing={1}>
                <Typography component={Link} href="/user/login" variant="body2" sx={{ color: "inherit", opacity: 0.72, textDecoration: "none" }}>Customer portal</Typography>
                <Typography component={Link} href="/vendor/login" variant="body2" sx={{ color: "inherit", opacity: 0.72, textDecoration: "none" }}>Vendor portal</Typography>
                <Typography component={Link} href="/admin" variant="body2" sx={{ color: "inherit", opacity: 0.72, textDecoration: "none" }}>Admin portal</Typography>
              </Stack>
            </Box>
          </Box>
          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.12)" }} />
          <Typography variant="caption" sx={{ opacity: 0.55 }}>© 2026 Joota Chupai. All rights reserved.</Typography>
        </Box>
      </Box>
    </Box>
  );
}
