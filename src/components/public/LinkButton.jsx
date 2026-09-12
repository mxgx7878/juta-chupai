"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import { colors } from "@/theme/tokens";

/**
 * MUI Button rendered as a Next.js Link.
 *
 * Server components cannot pass a component *function* (`component={Link}`) into
 * a client component, so this thin client wrapper does it on their behalf — and
 * carries the two button looks the public pages use, in one place.
 */
export default function LinkButton({ href, variant = "contained", children, sx, ...rest }) {
  const outlinedOnLight = variant === "outlined" ? { borderColor: colors.borderStrong, color: colors.textPrimary } : null;

  return (
    <Button component={Link} href={href} variant={variant} sx={{ ...outlinedOnLight, ...sx }} {...rest}>
      {children}
    </Button>
  );
}
