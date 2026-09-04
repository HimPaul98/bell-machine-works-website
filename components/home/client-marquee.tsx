// components/home/client-marquee.tsx
"use client";

import { usePrefersReducedMotion } from "@/lib/motion/scroll-engine";

/** Looping horizontal ribbon of client names, replacing what was previously
 *  a full grid of case-study cards duplicating the /work page one section
 *  up. A continuous decorative loop (not scroll-linked), so it degrades to
 *  a static wrapped row under prefers-reduced-motion rather than a paused
 *  animation — "no exceptions" per this phase's motion constraints. */
export function ClientMarquee({ names }: { names: string[] }) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
        {names.map((name) => (
          <span
            key={name}
            className="text-sm font-medium tracking-wide text-steel-200 uppercase md:text-base"
          >
            {name}
          </span>
        ))}
      </div>
    );
  }

  const looped = [...names, ...names];

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="group flex w-max">
        <div className="flex animate-marquee items-center gap-12 py-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {looped.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="flex shrink-0 items-center gap-12 text-sm font-medium tracking-wide text-steel-200 uppercase md:text-base"
            >
              {name}
              <span aria-hidden className="size-1 rounded-full bg-accent-400/60" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
