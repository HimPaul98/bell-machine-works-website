// components/layout/nav.tsx
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Container } from "@/components/layout/container";

const LINKS = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/industries", label: "Industries" },
  { href: "/quality", label: "Quality & Certifications" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2";

export function Nav() {
  return (
    <header className="sticky top-4 z-50">
      <Container>
        <GlassPanel
          as="nav"
          aria-label="Primary"
          hoverLift={false}
          className="flex items-center justify-between px-6 py-4"
        >
          <Link
            href="/"
            className={`rounded-sm font-sans text-lg font-semibold text-steel-100 ${FOCUS_RING}`}
          >
            BELL Machine Works
          </Link>
          <ul className="hidden items-center gap-6 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-sm text-sm text-steel-200 transition-colors hover:text-steel-100 ${FOCUS_RING}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/quote"
            className={`rounded-full bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-90 ${FOCUS_RING}`}
          >
            Get a Quote
          </Link>
        </GlassPanel>
      </Container>
    </header>
  );
}
