"use client";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { alpha } from "@mui/material/styles";

export default function MetricCard({ metric }) {
  const Icon = metric.icon;
  const up = metric.up;
  return (
    <Card sx={{ p: 2.5, height: "100%" }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Avatar
          variant="rounded"
          sx={(t) => ({
            width: 48,
            height: 48,
            borderRadius: 2.5,
            bgcolor: alpha(t.palette[metric.color].main, 0.12),
            color: `${metric.color}.main`,
          })}
        >
          <Icon />
        </Avatar>
        <Stack
          direction="row"
          spacing={0.25}
          sx={(t) => ({
            alignItems: "center",
            px: 1,
            py: 0.25,
            borderRadius: 2,
            bgcolor: alpha(t.palette[up ? "success" : "error"].main, 0.12),
            color: up ? "success.main" : "error.main",
          })}
        >
          {up ? (
            <ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} />
          ) : (
            <ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} />
          )}
          <Typography variant="caption" fontWeight={700}>
            {metric.change}
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {metric.label}
      </Typography>
      <Typography variant="h4" fontWeight={800} sx={{ mt: 0.25 }}>
        {metric.value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {metric.note}
      </Typography>
    </Card>
  );
}
