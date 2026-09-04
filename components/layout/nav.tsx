// components/layout/nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Container } from "@/components/layout/container";
import { useScrollFrame } from "@/lib/motion/scroll-engine";

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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useScrollFrame((y) => {
    setScrolled((prev) => (prev !== y > 40 ? y > 40 : prev));
  });

  return (
    <header
      className={`sticky top-4 z-50 transition-[filter] duration-300 ${
        scrolled ? "drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]" : ""
      }`}
    >
      <Container>
        <GlassPanel
          as="nav"
          aria-label="Primary"
          hoverLift={false}
          className="flex flex-col px-6 py-4"
        >
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-3">
              <Link
                href="/quote"
                className={`rounded-full bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-90 ${FOCUS_RING}`}
              >
                Get a Quote
              </Link>
              <button
                type="button"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((prev) => !prev)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-steel-100 md:hidden ${FOCUS_RING}`}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="h-6 w-6"
                >
                  {open ? (
                    <path d="M6 6l12 12M18 6L6 18" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <ul
            id="mobile-menu"
            className={`mt-4 flex-col gap-4 md:hidden ${open ? "flex" : "hidden"}`}
          >
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-sm text-sm text-steel-200 hover:text-steel-100 ${FOCUS_RING}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </Container>
    </header>
  );
}
