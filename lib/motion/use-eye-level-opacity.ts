// lib/motion/use-eye-level-opacity.ts
"use client";

import { useRef, useState } from "react";
import { useScrollFrame } from "@/lib/motion/scroll-engine";

/** Attach the returned ref to a text block. Its opacity reads 1 when the
 *  block's vertical center sits at the viewport's vertical center, dimming
 *  to a floor of 0.52 as it moves away — mirrors aiautomationsociety.ai's
 *  `[data-intro]` paragraph treatment. Desktop-only (viewport >= 768px);
 *  holds at full opacity on narrow viewports and whenever the scroll
 *  engine's callback never fires (prefers-reduced-motion). */
export function useEyeLevelOpacity<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [opacity, setOpacity] = useState(1);

  useScrollFrame(() => {
    const node = ref.current;
    if (!node || window.innerWidth < 768) {
      setOpacity(1);
      return;
    }
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < -200 || rect.top > vh + 200) return;

    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - vh * 0.5) / (vh * 0.42);
    const next = Math.max(0.52, 1 - Math.max(0, distance - 0.1) * 1.3);
    setOpacity((prev) => (Math.abs(prev - next) > 0.01 ? next : prev));
  });

  return { ref, opacity };
}
