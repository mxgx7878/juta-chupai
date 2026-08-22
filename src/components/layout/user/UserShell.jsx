"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import GlobalSnackbar from "@/components/ui/GlobalSnackbar";
import { userNav } from "@/config/userNav";
import { sessionActions } from "@/store";
import { notify } from "@/store/uiSlice";

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function UserShell({ children }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchor, setAnchor] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const email = useSelector((s) => s.session.customerEmail);
  const customers = useSelector((s) => s.customers.items);
  const me = customers.find((c) => c.email === email);

  const switchTo = (e) => { dispatch(sessionActions.loginCustomer(e)); dispatch(notify(`Now browsing as ${customers.find((c) => c.email === e)?.name}`)); setAnchor(null); router.push("/user"); };
  const logout = () => { setAnchor(null); dispatch(sessionActions.logoutCustomer()); router.push("/user/login"); };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
        <Toolbar sx={{ gap: 2 }}>
          <IconButton edge="start" onClick={() => setDrawer(true)} sx={{ display: { md: "none" } }}><MenuRoundedIcon /></IconButton>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", cursor: "pointer" }} onClick={() => router.push("/user")}>
            <Avatar variant="rounded" sx={{ bgcolor: "primary.main", width: 36, height: 36, borderRadius: 2 }}><CelebrationRoundedIcon fontSize="small" /></Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1 }}>Joota Chupai</Typography>
              <Typography variant="caption" color="text.secondary" letterSpacing="0.14em">MARKETPLACE</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ ml: 3, display: { xs: "none", md: "flex" } }}>
            {userNav.map((item) => (
              <Button key={item.href} component={Link} href={item.href} color={isActive(pathname, item.href) ? "primary" : "inherit"} sx={{ textTransform: "none", fontWeight: 700 }}>
                {item.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Button onClick={(e) => setAnchor(e.currentTarget)} color="inherit" sx={{ textTransform: "none" }}
            startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: 13 }}>{me?.name?.[0] || "?"}</Avatar>}>
            <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1 }}>{me?.name || "Guest"}</Typography>
              <Typography variant="caption" color="text.secondary">{me?.city}</Typography>
            </Box>
          </Button>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { minWidth: 240 } } }}>
            <Typography variant="overline" sx={{ px: 2, color: "text.secondary" }}>Switch customer (mock)</Typography>
            {customers.filter((c) => c.status === "Active").map((c) => (
              <MenuItem key={c.email} selected={c.email === email} onClick={() => switchTo(c.email)}>
                <ListItemIcon>{c.email === email ? <CheckRoundedIcon fontSize="small" /> : <SwapHorizRoundedIcon fontSize="small" />}</ListItemIcon>
                {c.name}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={logout}><ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer open={drawer} onClose={() => setDrawer(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            {userNav.map((item) => (
              <ListItemButton key={item.href} component={Link} href={item.href} onClick={() => setDrawer(false)} selected={isActive(pathname, item.href)}>
                <ListItemIcon><item.icon fontSize="small" /></ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>{children}</Box>
      <GlobalSnackbar />
    </Box>
  );
}