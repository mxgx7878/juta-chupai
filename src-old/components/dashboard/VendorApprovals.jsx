"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { alpha } from "@mui/material/styles";
import { vendorsActions } from "@/store";
import { notify } from "@/store/uiSlice";

const AV = ["#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed"];
const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2);

export default function VendorApprovals() {
  const pending = useSelector((s) => s.vendors.items.filter((v) => v.status === "Pending"));
  const dispatch = useDispatch();
  const router = useRouter();

  if (pending.length === 0) {
    return (
      <Stack spacing={1} sx={{ alignItems: "center", py: 5, color: "text.secondary" }}>
        <CheckCircleRoundedIcon color="success" />
        <Typography variant="body2">All caught up — no vendors awaiting approval.</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      {pending.map((v, i) => (
        <Stack
          key={v.id}
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "center", p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "grey.50" }}
        >
          <Avatar
            variant="rounded"
            onClick={() => router.push(`/vendors/${v.id}`)}
            sx={{ bgcolor: AV[i % AV.length], borderRadius: 2, cursor: "pointer" }}
          >
            {initials(v.name)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1, cursor: "pointer" }} onClick={() => router.push(`/vendors/${v.id}`)}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="subtitle2" noWrap fontWeight={700}>
                {v.name}
              </Typography>
              {v.rating > 0 && <Rating value={v.rating} precision={0.1} size="small" readOnly max={5} sx={{ fontSize: 14 }} />}
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
              <Typography variant="caption">{v.category}</Typography>
              <PlaceRoundedIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption">{v.city}</Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Approve">
              <IconButton
                size="small"
                onClick={() => { dispatch(vendorsActions.setStatus({ id: v.id, status: "Approved" })); dispatch(notify(`${v.name} approved`)); }}
                sx={(t) => ({ bgcolor: alpha(t.palette.success.main, 0.12), color: "success.main" })}
              >
                <CheckRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject">
              <IconButton
                size="small"
                onClick={() => { dispatch(vendorsActions.setStatus({ id: v.id, status: "Rejected" })); dispatch(notify({ message: `${v.name} rejected`, severity: "error" })); }}
                sx={{ bgcolor: "grey.100", color: "text.secondary", "&:hover": { bgcolor: "error.light", color: "error.main" } }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}