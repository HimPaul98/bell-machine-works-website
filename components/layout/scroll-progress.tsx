// components/layout/scroll-progress.tsx
"use client";

import { useRef } from "react";
import { useScrollFrame } from "@/lib/motion/scroll-engine";

/** Thin glowing line along the top edge tracking scroll progress through
 *  the page. Mirrors aiautomationsociety.ai's `.progress` bar. Holds at
 *  0 width whenever the scroll engine's callback never fires
 *  (prefers-reduced-motion) — an empty bar, not a broken one. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useScrollFrame((y) => {
    const bar = barRef.current;
    if (!bar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;
    bar.style.transform = `scaleX(${progress.toFixed(4)})`;
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-accent-500 via-accent-400 to-white"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
