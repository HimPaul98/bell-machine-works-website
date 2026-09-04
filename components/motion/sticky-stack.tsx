// components/motion/sticky-stack.tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useScrollFrame } from "@/lib/motion/scroll-engine";

interface StickyStackProps<T> {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Sticky-positioned card stack: as the next card climbs over the previous
 *  one, the card underneath scales down and dims proportionally to how
 *  much they overlap. Mirrors aiautomationsociety.ai's `[data-deck]`
 *  treatment. The scale/dim math only runs while useScrollFrame's
 *  callback fires, which the scroll engine skips entirely under
 *  prefers-reduced-motion — cards then simply hold their default,
 *  undimmed scale. Sticky positioning itself (not the scale/dim
 *  animation) is desktop-only via the `md:` breakpoint; narrow
 *  viewports get a plain stacked list. */
export function StickyStack<T>({ items, getKey, renderItem, className = "" }: StickyStackProps<T>) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollFrame(() => {
    if (window.innerWidth < 768) return;
    const rects = cardRefs.current.map((el) => el?.getBoundingClientRect() ?? null);

    for (let i = 0; i < cardRefs.current.length - 1; i++) {
      const el = cardRefs.current[i];
      const rect = rects[i];
      const nextRect = rects[i + 1];
      if (!el || !rect || !nextRect) continue;

      const progress = clamp((rect.bottom - nextRect.top) / rect.height, 0, 1);
      el.style.transform = `scale(${(1 - progress * 0.05).toFixed(4)})`;
      el.style.filter = `brightness(${(1 - progress * 0.45).toFixed(3)})`;
    }

    const last = cardRefs.current[cardRefs.current.length - 1];
    if (last) {
      last.style.transform = "";
      last.style.filter = "";
    }
  });

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          key={getKey(item)}
          ref={(el) => {
            cardRefs.current[index] = el;
          }}
          className="relative mb-8 will-change-transform md:sticky md:top-28"
          style={{ zIndex: index + 1 }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
