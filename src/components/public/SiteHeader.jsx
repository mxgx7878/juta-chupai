"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import BrandMark from "./BrandMark";
import { publicNav } from "@/config/publicNav";
import { colors, motion, withAlpha } from "@/theme/tokens";

/**
 * Public header. The bar is always frosted — several pages open on a dark hero
 * that the header sits over — and it firms up (more opaque, hairline border)
 * once the visitor scrolls past ~12px, so it separates from the page without a
 * hard edge at the very top.
 */
export default function SiteHeader() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* "/listings" should stay active on "/listings/royal-hall" too. */
  const isActive = (href) => {
    const path = href.split("#")[0];
    if (path === "/" || path === "") return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: withAlpha(colors.surface, scrolled ? 0.96 : 0.9),
          backdropFilter: "saturate(180%) blur(14px)",
          borderBottom: "1px solid",
          borderColor: scrolled ? colors.border : "transparent",
          color: "text.primary",
          transition: `background-color ${motion.base} ${motion.ease}, border-color ${motion.base} ${motion.ease}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 76 }, gap: 2 }}>
            <BrandMark />

            <Stack direction="row" spacing={0.25} sx={{ ml: 2, display: { xs: "none", lg: "flex" } }}>
              {publicNav.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    px: 1.5,
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    color: isActive(item.href) ? colors.primary : "text.secondary",
                    "&:hover": { color: colors.primary, bgcolor: colors.primarySoft },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", display: { xs: "none", md: "flex" } }}>
              <Button
                component={Link}
                href="/vendor/login"
                sx={{ color: "text.secondary", fontWeight: 600, whiteSpace: "nowrap", display: { md: "none", xl: "inline-flex" } }}
              >
                List your business
              </Button>
              <Button component={Link} href="/user/login" variant="outlined" sx={{ borderColor: colors.borderStrong, color: "text.primary", whiteSpace: "nowrap" }}>
                Sign in
              </Button>
              <Button component={Link} href="/listings" variant="contained" sx={{ whiteSpace: "nowrap" }}>
                Browse listings
              </Button>
            </Stack>

            <IconButton onClick={() => setOpen(true)} sx={{ display: { xs: "inline-flex", md: "none" } }} aria-label="Open menu">
              <MenuRoundedIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { width: 300 } } }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", p: 2 }}>
          <BrandMark href={null} />
          <IconButton onClick={() => setOpen(false)} aria-label="Close menu"><CloseRoundedIcon /></IconButton>
        </Stack>
        <Divider />
        <List sx={{ px: 1, py: 1.5 }}>
          {publicNav.map((item) => (
            <ListItemButton key={item.href} component={Link} href={item.href} selected={isActive(item.href)} onClick={() => setOpen(false)}>
              <ListItemText primaryTypographyProps={{ fontWeight: 600 }} primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <Stack spacing={1.25} sx={{ p: 2 }}>
          <Button component={Link} href="/listings" variant="contained" onClick={() => setOpen(false)}>Browse listings</Button>
          <Button component={Link} href="/user/login" variant="outlined" color="inherit" onClick={() => setOpen(false)}>Sign in</Button>
          <Button component={Link} href="/vendor/login" color="inherit" onClick={() => setOpen(false)}>List your business</Button>
        </Stack>
      </Drawer>
    </>
  );
}
