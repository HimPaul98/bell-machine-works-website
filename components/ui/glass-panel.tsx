// components/ui/glass-panel.tsx
import { ElementType, ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Set false for non-interactive glass surfaces (nav, hero) so they
   *  don't jog on hover — Phase 1 final review Minor finding #4. */
  hoverLift?: boolean;
  [key: string]: unknown;
}

/**
 * Frosted glass surface per Design-Direction.md §2. Use for nav, hero
 * background, capability/industry cards, CTA panels, case-study cards,
 * and modals only — never for spec tables, the RFQ form, or cert pages.
 */
export function GlassPanel({
  children,
  className = "",
  as: Component = "div",
  hoverLift = true,
  ...rest
}: GlassPanelProps) {
  return (
    <Component
      className={`relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl transition-all duration-300 ease-out hover:border-white/20 ${
        hoverLift ? "hover:-translate-y-1" : ""
      } ${className}`}
      style={{
        boxShadow: "var(--glass-shadow)",
      }}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--glass-border-top), transparent)",
        }}
      />
      {children}
    </Component>
  );
}
