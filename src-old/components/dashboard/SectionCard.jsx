"use client";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function SectionCard({ title, subtitle, action, children, sx }) {
  return (
    <Card sx={{ p: { xs: 2, md: 3 }, height: "100%", ...sx }}>
      {(title || action) && (
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}
        >
          <Box>
            {title && (
              <Typography variant="h6" fontWeight={700}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
      )}
      {children}
    </Card>
  );
}
