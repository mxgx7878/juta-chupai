"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { sessionActions } from "@/store";

export default function UserLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const customers = useSelector((s) => s.customers.items.filter((c) => c.status === "Active"));
  const signIn = (email) => { dispatch(sessionActions.loginCustomer(email)); router.push("/user"); };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, background: "linear-gradient(135deg,#eef2ff,#faf5ff)" }}>
      <Box sx={{ width: "100%", maxWidth: 720 }}>
        <Stack spacing={1} sx={{ alignItems: "center", mb: 4, textAlign: "center" }}>
          <Avatar variant="rounded" sx={{ bgcolor: "primary.main", width: 52, height: 52, borderRadius: 3 }}><CelebrationRoundedIcon /></Avatar>
          <Typography variant="h4" fontWeight={800}>Plan your wedding</Typography>
          <Typography color="text.secondary">Mock sign-in — choose a customer to browse the marketplace.</Typography>
        </Stack>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {customers.map((c) => (
            <Card key={c.email} sx={{ p: 2.5, cursor: "pointer", "&:hover": { boxShadow: 4, borderColor: "primary.main" } }} onClick={() => signIn(c.email)}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 46, height: 46, fontWeight: 700 }}>{c.name[0]}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>{c.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.city}</Typography>
                </Box>
              </Stack>
              <Button fullWidth variant="outlined" startIcon={<LoginRoundedIcon />} sx={{ mt: 2 }}>Browse as {c.name.split(" ")[0]}</Button>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}