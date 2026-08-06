"use client";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { activityFeed } from "@/data/dashboard";

export default function ActivityFeed() {
  return (
    <Stack spacing={2.5} sx={{ position: "relative", pl: 0.5 }}>
      <Box
        sx={{
          position: "absolute",
          left: 6,
          top: 6,
          bottom: 6,
          width: "1px",
          bgcolor: "divider",
        }}
      />
      {activityFeed.map((a) => (
        <Stack key={a.title} direction="row" spacing={2} sx={{ position: "relative" }}>
          <Box
            sx={{
              mt: "5px",
              width: 12,
              height: 12,
              borderRadius: "50%",
              flexShrink: 0,
              bgcolor: `${a.color}.main`,
              border: "3px solid",
              borderColor: "background.paper",
              boxShadow: "0 0 0 1px rgba(145,158,171,0.2)",
              zIndex: 1,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
              <Typography variant="subtitle2" fontWeight={700}>
                {a.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                {a.time}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {a.detail}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
