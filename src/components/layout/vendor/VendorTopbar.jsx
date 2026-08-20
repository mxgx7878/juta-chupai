"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { sessionActions } from "@/store";
import { notify } from "@/store/uiSlice";

export default function VendorTopbar({ onMenuClick }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchor, setAnchor] = useState(null);
  const vendorId = useSelector((s) => s.session.vendorId);
  const vendors = useSelector((s) => s.vendors.items);
  const vendor = vendors.find((v) => v.id === vendorId);

  const switchTo = (id) => {
    dispatch(sessionActions.loginAs(id));
    dispatch(notify(`Now acting as ${vendors.find((v) => v.id === id)?.name}`));
    setAnchor(null);
    router.push("/vendor");
  };

  const logout = () => { setAnchor(null); dispatch(sessionActions.logout()); router.push("/vendor/login"); };

  return (
    <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
      <Toolbar sx={{ gap: 2 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: "none" } }}><MenuRoundedIcon /></IconButton>
        <Typography variant="subtitle1" fontWeight={800} sx={{ flexGrow: 1 }}>Vendor Portal</Typography>

        <Button onClick={(e) => setAnchor(e.currentTarget)} color="inherit" sx={{ textTransform: "none" }}
          startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: "secondary.main", fontSize: 13 }}>{vendor?.name?.[0] || "?"}</Avatar>}>
          <Box sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1 }}>{vendor?.name || "Select vendor"}</Typography>
            <Typography variant="caption" color="text.secondary">{vendor?.city}</Typography>
          </Box>
        </Button>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { minWidth: 240 } } }}>
          <Typography variant="overline" sx={{ px: 2, color: "text.secondary" }}>Switch vendor (mock)</Typography>
          {vendors.filter((v) => v.status === "Approved").map((v) => (
            <MenuItem key={v.id} selected={v.id === vendorId} onClick={() => switchTo(v.id)}>
              <ListItemIcon>{v.id === vendorId ? <CheckRoundedIcon fontSize="small" /> : <SwapHorizRoundedIcon fontSize="small" />}</ListItemIcon>
              {v.name}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={logout}><ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}