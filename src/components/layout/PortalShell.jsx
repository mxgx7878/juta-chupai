"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import GlobalSnackbar from "@/components/ui/GlobalSnackbar";
import PortalSidebar, { SIDEBAR_WIDTH } from "./PortalSidebar";
import PortalTopbar from "./PortalTopbar";

export default function PortalShell({ children, sidebar, topbar }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <PortalSidebar {...sidebar} onNavigate={() => setMobileOpen(false)} />
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <PortalSidebar {...sidebar} />
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .MuiDrawer-paper`]: {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <PortalTopbar {...topbar} onMenuClick={() => setMobileOpen(true)} />
        <Box
          component="main"
          sx={{
            width: "100%",
            maxWidth: 1440,
            mx: "auto",
            flexGrow: 1,
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {children}
        </Box>
      </Box>

      <GlobalSnackbar />
    </Box>
  );
}
