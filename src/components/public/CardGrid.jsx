"use client";

import Box from "@mui/material/Box";

/**
 * Responsive grid used by every card list on the public site.
 * `min` sets the smallest comfortable card width; the browser decides columns.
 */
export default function CardGrid({ children, min = 280, gap = 3, sx }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap,
        gridTemplateColumns: { xs: "1fr", sm: `repeat(auto-fill, minmax(${min}px, 1fr))` },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
