// components/motion/reveal.tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/scroll-engine";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the fade-up starts, once the element has entered
   *  the viewport. For staggering a sequence of Reveals. */
  delay?: number;
}

/** Fades a block up into place the first time it enters the viewport, then
 *  stops watching it. Mirrors aiautomationsociety.ai's `.reveal`/`.is-in`
 *  pattern. Renders immediately visible, with no animation, under
 *  prefers-reduced-motion. */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isIn, setIsIn] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setIsIn(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        timer = setTimeout(() => setIsIn(true), delay);
        observer.unobserve(node);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [reducedMotion, delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        isIn ? "translate-y-0 opacity-100" : "translate-y-[18px] opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
