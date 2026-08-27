"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import VendorSidebar, { SIDEBAR_WIDTH } from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";
import GlobalSnackbar from "@/components/ui/GlobalSnackbar";

export default function VendorShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, width: SIDEBAR_WIDTH, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: SIDEBAR_WIDTH, boxSizing: "border-box", border: "none" } }}>
        <VendorSidebar />
      </Drawer>
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" }, [`& .MuiDrawer-paper`]: { width: SIDEBAR_WIDTH, boxSizing: "border-box", border: "none" } }}>
        <VendorSidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>
      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <VendorTopbar onMenuClick={() => setMobileOpen(true)} />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
      <GlobalSnackbar />
    </Box>
  );
}