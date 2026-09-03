// components/layout/nav.tsx
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";

const LINKS = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/industries", label: "Industries" },
  { href: "/quality", label: "Quality & Certifications" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
      <GlassPanel as="nav" className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-sans text-lg font-semibold text-steel-100">
          BELL Machine Works
        </Link>
        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-steel-200 transition-colors hover:text-steel-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/quote"
          className="rounded-full bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-90"
        >
          Get a Quote
        </Link>
      </GlassPanel>
    </header>
  );
}
