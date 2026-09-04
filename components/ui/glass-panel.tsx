// components/ui/glass-panel.tsx
import { ElementType, ReactNode, CSSProperties } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Set false for non-interactive glass surfaces (nav, hero) so they
   *  don't jog on hover — Phase 1 final review Minor finding #4. */
  hoverLift?: boolean;
  /** Brighter border + deeper ambient shadow for standalone showcase
   *  surfaces (e.g. the Work-page case-study cards) that need to visibly
   *  lift off the page rather than just outline it. */
  elevated?: boolean;
  /** RGB triplet ("R G B", 0-255) tinting the elevated glow to match an
   *  embedded photo's tone. Ignored unless `elevated` is set. */
  glowColor?: string;
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
  elevated = false,
  glowColor,
  ...rest
}: GlassPanelProps) {
  return (
    <Component
      className={`relative rounded-2xl border bg-white/[0.06] backdrop-blur-xl transition-all duration-300 ease-out ${
        elevated
          ? "border-white/15 hover:border-white/30"
          : "border-white/10 hover:border-white/20"
      } ${hoverLift ? "hover:-translate-y-1" : ""} ${className}`}
      {...rest}
      style={{
        ...(rest.style as CSSProperties | undefined),
        boxShadow: elevated
          ? glowColor
            ? `0 32px 80px rgb(${glowColor} / 0.2), var(--glass-shadow-elevated)`
            : "var(--glass-shadow-elevated)"
          : "var(--glass-shadow)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${
            elevated ? "var(--glass-border-top-elevated)" : "var(--glass-border-top)"
          }, transparent)`,
        }}
      />
      {children}
    </Component>
  );
}
