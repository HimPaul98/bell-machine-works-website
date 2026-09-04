// components/motion/tab-stage.tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/scroll-engine";

interface TabStageProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderSlide: (item: T) => ReactNode;
  autoAdvanceMs?: number;
  className?: string;
}

/** Pill tab bar + crossfading stage, auto-advancing on an interval and
 *  advanceable by click; clicking resets the auto-advance timer. Mirrors
 *  aiautomationsociety.ai's `[data-tab]`/`[data-slide]` feature switcher.
 *  Auto-advance is disabled under prefers-reduced-motion — tabs still
 *  switch on click. */
export function TabStage<T>({
  items,
  getKey,
  getLabel,
  renderSlide,
  autoAdvanceMs = 4500,
  className = "",
}: TabStageProps<T>) {
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (reducedMotion) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, autoAdvanceMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reducedMotion, items.length, autoAdvanceMs]);

  function selectTab(index: number) {
    setActive(index);
    if (timerRef.current) clearInterval(timerRef.current);
    if (!reducedMotion) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, autoAdvanceMs);
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        className="grid gap-1 rounded-full border border-white/10 bg-graphite-900 p-1.5"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item, index) => (
          <button
            key={getKey(item)}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => selectTab(index)}
            className={`h-11 rounded-full text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2 ${
              index === active
                ? "bg-graphite-700 text-steel-100"
                : "text-steel-200 hover:text-steel-100"
            }`}
          >
            {getLabel(item)}
          </button>
        ))}
      </div>
      <div className="relative mt-3 min-h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-graphite-900">
        {items.map((item, index) => (
          <div
            key={getKey(item)}
            role="tabpanel"
            aria-hidden={index !== active}
            className={`p-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-12 ${
              index === active
                ? "relative opacity-100"
                : "absolute inset-0 -z-10 translate-y-3 scale-[0.98] opacity-0"
            }`}
          >
            {renderSlide(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
