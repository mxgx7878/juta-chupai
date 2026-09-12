"use client";

import Box from "@mui/material/Box";
import useInView from "@/hooks/useInView";
import { motion } from "@/theme/tokens";

/**
 * The site's one entrance animation: content lifts and fades in as it enters the
 * viewport. Everything scroll-animated on the public site wraps in this, so the
 * whole page shares a single easing curve and duration (from tokens.js).
 *
 * `delay` staggers siblings — pass index * 70 in a grid for a gentle cascade.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  scale = 1,
  sx,
  ...rest
}) {
  const [ref, inView] = useInView();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transition: `opacity ${motion.reveal} ${motion.easeOut} ${delay}ms, transform ${motion.reveal} ${motion.easeOut} ${delay}ms`,
        willChange: "opacity, transform",
        "@media (prefers-reduced-motion: reduce)": { transition: "none", transform: "none", opacity: 1 },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
