"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { sessionActions } from "@/store";
import { CategoryLabel } from "@/components/ui/CategoryIcon";

export default function VendorLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const vendors = useSelector((s) => s.vendors.items.filter((v) => v.status === "Approved"));

  const signIn = (id) => { dispatch(sessionActions.loginAs(id)); router.push("/vendor"); };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, background: "linear-gradient(135deg,#eef2ff,#f5f3ff)" }}>
      <Box sx={{ width: "100%", maxWidth: 760 }}>
        <Stack spacing={1} sx={{ alignItems: "center", mb: 4, textAlign: "center" }}>
          <Avatar variant="rounded" sx={{ bgcolor: "secondary.main", width: 52, height: 52, borderRadius: 3 }}>
            <StorefrontRoundedIcon />
          </Avatar>
          <Typography variant="h4" fontWeight={800}>Vendor Portal</Typography>
          <Typography color="text.secondary">Mock sign-in — pick a vendor to manage their storefront.</Typography>
        </Stack>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {vendors.map((v) => (
            <Card key={v.id} sx={{ p: 2.5, cursor: "pointer", transition: "0.15s", "&:hover": { boxShadow: 4, borderColor: "secondary.main" } }} onClick={() => signIn(v.id)}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar variant="rounded" sx={{ bgcolor: "secondary.main", width: 46, height: 46, borderRadius: 2, fontWeight: 700 }}>{v.name[0]}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>{v.name}</Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                    <CategoryLabel category={v.category} />
                    <Typography variant="caption">· {v.city}</Typography>
                  </Stack>
                </Box>
                {v.verified && <Chip size="small" label="Verified" color="primary" sx={{ fontWeight: 700 }} />}
              </Stack>
              <Button fullWidth variant="outlined" color="secondary" startIcon={<LoginRoundedIcon />} sx={{ mt: 2 }}>
                Sign in as this vendor
              </Button>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}