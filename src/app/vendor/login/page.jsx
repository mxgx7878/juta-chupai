"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { sessionActions } from "@/store";
import { CategoryLabel } from "@/components/ui/CategoryIcon";
import { vendorVertical } from "@/utils/vertical";
import { VERTICALS, VERTICAL_LABELS } from "@/config/categoryTree";

const GROUPS = [
  { id: VERTICALS.HALL, title: "Wedding venues", blurb: "Per-hall calendars, day & night slots, date-blocking bookings." },
  { id: VERTICALS.CATERING, title: "Catering", blurb: "Menus & deals, per-head pricing, no date blocking." },
  { id: VERTICALS.GENERIC, title: "Other categories", blurb: "Listings aren't enabled for these yet." },
];

const VERTICAL_COLORS = {
  hall: { bg: "#e0edff", fg: "#1d4ed8" },
  catering: { bg: "#fef3c7", fg: "#b45309" },
  generic: { bg: "#f1f5f9", fg: "#64748b" },
};

export default function VendorLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const vendors = useSelector((s) => s.vendors.items.filter((v) => v.status === "Approved"));
  const storeCategories = useSelector((s) => s.categories.items);
  const listings = useSelector((s) => s.listings.items);

  const grouped = useMemo(() => {
    const m = { hall: [], catering: [], generic: [] };
    vendors.forEach((v) => { m[vendorVertical(v, storeCategories)]?.push(v); });
    return m;
  }, [vendors, storeCategories]);

  const signIn = (id) => { dispatch(sessionActions.loginAs(id)); router.push("/vendor"); };
  const countFor = (id) => listings.filter((l) => l.vendorId === id).length;

  return (
    <Box sx={{ minHeight: "100vh", py: 6, px: 3, background: "linear-gradient(135deg,#eef2ff,#f5f3ff)" }}>
      <Box sx={{ width: "100%", maxWidth: 940, mx: "auto" }}>
        <Stack spacing={1} sx={{ alignItems: "center", mb: 4, textAlign: "center" }}>
          <Avatar variant="rounded" sx={{ bgcolor: "secondary.main", width: 52, height: 52, borderRadius: 3 }}>
            <StorefrontRoundedIcon />
          </Avatar>
          <Typography variant="h4" fontWeight={800}>Vendor Portal</Typography>
          <Typography color="text.secondary">
            Mock sign-in. Pick a vendor — the portal adapts to their category.
          </Typography>
        </Stack>

        <Stack spacing={4}>
          {GROUPS.map((g) => {
            const list = grouped[g.id] || [];
            if (list.length === 0) return null;
            const col = VERTICAL_COLORS[g.id];
            return (
              <Box key={g.id}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
                  <Typography variant="h6" fontWeight={800}>{g.title}</Typography>
                  <Chip size="small" label={VERTICAL_LABELS[g.id]} sx={{ fontWeight: 700, bgcolor: col.bg, color: col.fg }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{g.blurb}</Typography>

                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                  {list.map((v) => (
                    <Card
                      key={v.id}
                      onClick={() => signIn(v.id)}
                      sx={{ p: 2.5, cursor: "pointer", transition: "0.15s", "&:hover": { boxShadow: 4, borderColor: col.fg } }}
                    >
                      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <Avatar variant="rounded" sx={{ width: 46, height: 46, borderRadius: 2, bgcolor: col.bg, color: col.fg, fontWeight: 800 }}>
                          {v.name[0]}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                            <Typography variant="subtitle1" fontWeight={800} noWrap>{v.name}</Typography>
                            {v.verified && <VerifiedRoundedIcon sx={{ fontSize: 16, color: "primary.main" }} />}
                          </Stack>
                          <Typography variant="caption" color="text.secondary" component="div">
                            <CategoryLabel category={v.category} />
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {v.city} · {countFor(v.id)} listing{countFor(v.id) === 1 ? "" : "s"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
