"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when an element scrolls into view. Every entrance animation on the
 * public site is driven by this, so timing and threshold are tuned in one place.
 *
 * Respects `prefers-reduced-motion`: when a visitor has asked for less motion we
 * report "in view" immediately and the component skips its transition.
 */
export default function useInView({ threshold = 0.15, rootMargin = "0px 0px -80px 0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
