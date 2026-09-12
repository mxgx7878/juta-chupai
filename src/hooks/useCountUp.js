"use client";

import { useEffect, useState } from "react";

/**
 * Animates a number from 0 to `target` once `active` turns true — used by the
 * stat tiles so figures "count up" as they scroll into view.
 *
 * requestAnimationFrame with an ease-out curve, so it decelerates instead of
 * ticking linearly. Reduced-motion visitors get the final value immediately.
 */
export default function useCountUp(target, { duration = 1400, active = true, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return undefined;
    }

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3; // ease-out cubic
      const next = target * eased;
      setValue(decimals ? Number(next.toFixed(decimals)) : Math.round(next));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, active, decimals]);

  return value;
}
