# BELL Machine Works Website Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild bellmachineworks.com from a single-page Squarespace site into a multi-page Next.js site that surfaces BELL's real trust signals (named clients, spec-led copy, cert roadmap, RFQ form with file upload) per the approved content/trust strategy.

**Architecture:** Next.js 15 App Router + TypeScript, Tailwind CSS v4 for a "liquid glass" design system (frosted glass panels over a dark industrial background, used only for framing — never for spec tables, the RFQ form, or cert/quality pages). Content lives in code (TS data files), not a CMS. Deployed on Vercel.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Vercel Blob (file upload), Resend (email), deployed on Vercel.

**Spec:** [docs/superpowers/specs/2026-09-03-website-rebuild-design.md](../specs/2026-09-03-website-rebuild-design.md)

## Global Constraints

- No automated test suite (spec §5). The correctness gate is `npm run build` (runs `tsc` + Next's production build) plus manually running the dev server and checking the rendered output — not code review alone.
- Glass (`backdrop-blur` + low-opacity fill + specular top-edge border) is used only for: nav, hero background, capability/industry cards, CTA panels, case-study cards, modals (spec §2). It is **never** used on spec tables/data, the RFQ form surface, or cert/quality documentation pages — those stay solid, opaque, high-contrast.
- Content is dev-edited, in-repo TS/MDX data files — no headless CMS (spec §1).
- Accepted RFQ upload file types: STEP, IGES, Parasolid, STL, PDF, DWG, DXF (spec §4).
- Every commit message ends with the standard Co-Authored-By / Claude-Session footer already used for the spec commit in this repo.

---

## Phase 1 — Scaffold (detailed below, build now)

Next.js/TS/Tailwind init, liquid-glass design tokens, glass-panel primitive, layout shell (nav + footer + page container), placeholder home stub proving the shell renders. Everything later phases build inside.

### Task 1: Initialize the Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/` (all via `create-next-app` scaffolding)

**Interfaces:**
- Produces: a working Next.js dev server at `http://localhost:3000`, App Router convention (`app/` directory, no `src/`), Tailwind CSS v4 already wired into `app/globals.css` via `@import "tailwindcss";`

- [ ] **Step 1: Scaffold the project**

Run from the `Website/` directory (the existing spec/docs files stay in place):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

When prompted about the current directory not being empty, confirm yes (it only contains the planning docs and `.claude`/`.agents` dirs, no conflicting files).

- [ ] **Step 2: Verify the dev server boots**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | grep -o "<title>.*</title>"
kill %1
```

Expected: a `<title>` tag is present, no error output.

- [ ] **Step 3: Verify the production build succeeds**

```bash
npm run build
```

Expected: exits 0, prints a route summary including `/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Scaffold Next.js project

TypeScript, Tailwind CSS v4, App Router, ESLint, per the technical
design spec (docs/superpowers/specs/2026-09-03-website-rebuild-design.md).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 2: Liquid-glass design tokens

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: Tailwind v4's CSS-first `@theme` block (already present in the scaffolded `globals.css` from Task 1)
- Produces: CSS custom properties and Tailwind theme tokens usable as `bg-graphite-950`, `text-steel-200`, `bg-accent`, etc. in every later task; a `--glass-blur`, `--glass-fill`, `--glass-border` set of raw CSS variables for the glass utility built in Task 3.

- [ ] **Step 1: Replace the default theme block with BELL's palette**

Open `app/globals.css`. It currently has a default `@theme inline { ... }` block from the scaffold (fonts + a couple of colors). Replace its contents with:

```css
@import "tailwindcss";

@theme {
  /* Dark industrial base — graphite/steel, per Design-Direction.md §2 and §4 */
  --color-graphite-950: #0a0b0d;
  --color-graphite-900: #121316;
  --color-graphite-800: #1c1e22;
  --color-graphite-700: #2a2d33;
  --color-steel-400: #6b7280;
  --color-steel-200: #c4c9d1;
  --color-steel-100: #e4e7eb;

  /* Single sparing accent — placeholder steel-blue until Bushra confirms
     a brand color (Design-Direction.md §4); change only this token to retint. */
  --color-accent-500: #3b82f6;
  --color-accent-400: #60a5fa;

  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

:root {
  /* Raw values for the glass utility (Task 3) — not exposed as Tailwind
     theme tokens because backdrop-filter needs literal CSS, not classes. */
  --glass-blur: 16px;
  --glass-fill: rgb(255 255 255 / 0.06);
  --glass-border-top: rgb(255 255 255 / 0.25);
  --glass-border-rest: rgb(255 255 255 / 0.08);
  --glass-shadow: 0 8px 32px rgb(0 0 0 / 0.35);
}

body {
  background: var(--color-graphite-950);
  color: var(--color-steel-100);
}
```

- [ ] **Step 2: Verify the tokens compile**

```bash
npm run build
```

Expected: exits 0. (Tailwind v4 fails the build on invalid `@theme` syntax, so a clean build is sufficient proof the tokens parsed.)

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "$(cat <<'EOF'
Add liquid-glass design tokens

Graphite/steel dark palette and a placeholder accent color per
Design-Direction.md, plus raw CSS variables for the glass-panel
utility built in the next task.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 3: `GlassPanel` primitive component

**Files:**
- Create: `components/ui/glass-panel.tsx`

**Interfaces:**
- Consumes: `--glass-blur`, `--glass-fill`, `--glass-border-top`, `--glass-border-rest`, `--glass-shadow` from Task 2
- Produces: `<GlassPanel>` component — `{ children: React.ReactNode; className?: string; as?: React.ElementType }` props — used by Nav (Task 4) and every later card/CTA/modal component in Phases 2–5.

- [ ] **Step 1: Write the component**

```tsx
// components/ui/glass-panel.tsx
import { ElementType, ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
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
}: GlassPanelProps) {
  return (
    <Component
      className={`relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 ${className}`}
      style={{
        boxShadow: "var(--glass-shadow)",
      }}
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
```

- [ ] **Step 2: Smoke-test it from the home page**

Temporarily replace `app/page.tsx` contents with:

```tsx
// app/page.tsx
import { GlassPanel } from "@/components/ui/glass-panel";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-graphite-950 p-8">
      <GlassPanel className="p-8">
        <p className="text-steel-100">Glass panel smoke test</p>
      </GlassPanel>
    </main>
  );
}
```

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | grep -o "Glass panel smoke test"
kill %1
```

Expected: the text is found in the HTML output (confirms the component renders server-side without error; visual confirmation of the actual blur/border effect happens when a browser is available in a later phase).

- [ ] **Step 3: Run the build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add components/ui/glass-panel.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
Add GlassPanel primitive component

Frosted-glass surface (blur, low-opacity fill, specular top-edge
border, hover lift) per Design-Direction.md §2. Smoke-tested from
the home page; real usage begins with Nav in the next task.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 4: `Nav` and `Footer` layout components

**Files:**
- Create: `components/layout/nav.tsx`, `components/layout/footer.tsx`

**Interfaces:**
- Consumes: `GlassPanel` from Task 3
- Produces: `<Nav />` (no props), `<Footer />` (no props) — both consumed by `app/layout.tsx` in Task 5. Nav link hrefs point at the full sitemap from spec §3 even though most pages don't exist until Phases 2–5 (Next.js won't error on a missing route until it's actually clicked in-browser, and every route lands within this same plan's phases).

- [ ] **Step 1: Write the Nav component**

```tsx
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
          className="rounded-full bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-400"
        >
          Get a Quote
        </Link>
      </GlassPanel>
    </header>
  );
}
```

- [ ] **Step 2: Write the Footer component**

```tsx
// components/layout/footer.tsx
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-graphite-900 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-steel-400 md:flex-row md:items-center md:justify-between">
        <p>© {year} BELL Machine Works. Gilroy, CA.</p>
        <nav className="flex gap-6">
          <Link href="/quote" className="hover:text-steel-200">
            Get a Quote
          </Link>
          <Link href="/contact" className="hover:text-steel-200">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Run the build**

```bash
npm run build
```

Expected: exits 0. (Links to not-yet-created routes are fine — Next.js only errors on navigation to a missing route at request time, not at build time for `<Link>` usage.)

- [ ] **Step 4: Commit**

```bash
git add components/layout/nav.tsx components/layout/footer.tsx
git commit -m "$(cat <<'EOF'
Add Nav and Footer layout components

Sticky frosted-glass nav with the full sitemap from the design spec;
solid footer with copyright and secondary links.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 5: `PageContainer`, wire up `app/layout.tsx`, placeholder home stub

**Files:**
- Create: `components/layout/page-container.tsx`
- Modify: `app/layout.tsx`, `app/page.tsx`

**Interfaces:**
- Consumes: `Nav`, `Footer` (Task 4), `GlassPanel` (Task 3)
- Produces: `<PageContainer>` — `{ children: ReactNode; className?: string }` — a max-width/padding wrapper every page in Phases 2–5 uses for consistent horizontal rhythm. `app/layout.tsx` now renders `Nav` + `children` + `Footer` around every route automatically.

- [ ] **Step 1: Write PageContainer**

```tsx
// components/layout/page-container.tsx
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`mx-auto max-w-6xl px-4 py-16 ${className}`}>{children}</div>
  );
}
```

- [ ] **Step 2: Wire Nav/Footer into the root layout**

Replace `app/layout.tsx` contents (keep the existing `Geist`/`Geist_Mono` font setup and metadata block from the scaffold, just change the `<body>` contents):

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BELL Machine Works — Engineering-Led CNC Machining",
  description:
    "Precision CNC machining to ±0.0002\" for semiconductor, aerospace, robotics, and medical device teams. Gilroy, CA. Quotes within hours.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Replace the smoke-test home page with a real placeholder stub**

```tsx
// app/page.tsx
import { GlassPanel } from "@/components/ui/glass-panel";
import { PageContainer } from "@/components/layout/page-container";

export default function Home() {
  return (
    <main className="bg-graphite-950">
      <PageContainer>
        <GlassPanel className="p-10 md:p-16">
          <h1 className="text-3xl font-semibold text-steel-100 md:text-5xl">
            Engineering-Led CNC Machining, to ±0.0002&quot;
          </h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Homepage content lands in Phase 2 of the build. This stub proves
            the layout shell — nav, footer, page container, glass panel —
            renders correctly end to end.
          </p>
        </GlassPanel>
      </PageContainer>
    </main>
  );
}
```

- [ ] **Step 4: Verify the full shell renders**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | grep -o "BELL Machine Works"
curl -s http://localhost:3000 | grep -o "Get a Quote"
curl -s http://localhost:3000 | grep -o "Homepage content lands in Phase 2"
kill %1
```

Expected: all three greps find a match — confirms Nav, the CTA link, and the page body all render together through the root layout.

- [ ] **Step 5: Run the production build**

```bash
npm run build
```

Expected: exits 0, route summary shows `/`.

- [ ] **Step 6: Commit**

```bash
git add components/layout/page-container.tsx app/layout.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
Wire up layout shell and add placeholder home stub

app/layout.tsx now renders Nav + PageContainer-wrapped content +
Footer around every route. Home page is a minimal glass-panel stub
proving the shell end to end; real homepage content is Phase 2.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

**Phase 1 exit criteria:** `npm run build` passes; dev server serves a home page with a working sticky glass nav (linking to routes built in later phases), a glass-panel hero stub, and a footer; `git log` shows one commit per task. Next phase starts fresh after a `/compact`.

---

## Phase 2 — Home + Capabilities hub (detailed below, build now)

Real homepage content replacing the Phase 1 stub (spec-first hero, cert-roadmap snippet, named-client teaser per Rebuild-Build-Plan.md §2.3–2.4), plus the Capabilities hub page (tolerance table, machine list, links to process/material pages). Uses `GlassPanel` for hero/CTA framing and plain solid tables for spec data, per the Global Constraints glass rule.

This phase also picks up three findings parked in the Phase 1 SDD ledger
(`.superpowers/sdd/2026-09-03-website-rebuild/progress.md`) since Phase 2 is
the first natural point that touches their area: the mobile nav is currently
unreachable below 768px (no phase owned building one — Task 2 here does);
the glass panels have no background layer behind them to actually blur
(Design-Direction.md §2 calls this out as core to the "glass" read — Task 3
here); and cheap accessibility gaps (unlabeled nav landmarks, no skip link,
no focus-visible styling) — Task 1 here. Two Minor findings stay parked,
not picked up this phase: the dead/mismatched `--glass-*` token values in
`app/globals.css` (cosmetic, no behavior impact — defer to the Phase 6
polish pass) and the `mx-auto max-w-6xl px-4` duplication across
`page-container.tsx`/`nav.tsx`/`footer.tsx` — Task 1 below fixes this one
too, since it's a one-line-per-file change while already touching those
exact files for the a11y work, so it's not worth re-parking.

**Design note carried into Task 5:** Rebuild-Build-Plan.md's page-content
table lists "cert roadmap snippet" as home-page content, and Design-
Direction.md's glass usage list doesn't explicitly exclude home-page
snippets the way it excludes the standalone Certification/Quality pages.
Ruling: the cert-roadmap snippet stays on a **solid** background anyway,
not glass — it states dated compliance claims (AS9100D/ITAR status), which
is exactly the kind of content the glass-exclusion rule's own rationale
("needs to read as serious and unambiguous, not decorative") is protecting,
even in snippet form. Cost if wrong: low — swapping a `<section>`'s
background from solid to `GlassPanel` later is a one-line change with no
data-shape impact.

**Content honesty note (Task 7):** Rebuild-Build-Plan.md §6 and the
CNC-Website-Rubric research both confirm **no equipment/machine list exists
anywhere yet** — "confirm exactly which processes BELL runs in-house" is
still an open item blocking Bushra's sign-off. Task 7 ships the tolerance
and material facts that already have real sourcing (from the current site's
own copy and the Closed Won case-study data) and states plainly, in real
page copy, that the full equipment list and additional in-house processes
are still being confirmed — this is honest, shippable content per the
build plan's own "honest about what's not there yet" voice principle
(§2.1.4), not a code placeholder.

**Client-naming note (Task 6):** the four case studies used for the home
page teaser (ASML, Stoke Space, Corning, UCSF) are drawn from
Case-Studies-Draft.md's Tier-A draft set — the same "default nameable for
planning/drafting purposes, not final legal clearance" status Himadri
already established for that whole document (2026-09-03 decision, recorded
in Rebuild-Build-Plan.md §1.2 Pillar 1). Shipping them in this build carries
that same pending-sign-off status forward; it doesn't change or resolve it.

### Task 1: Shared `Container` primitive + Nav/Footer accessibility + GlassPanel pass-through props

**Files:**
- Create: `components/layout/container.tsx`
- Modify: `components/layout/page-container.tsx`, `components/layout/nav.tsx`, `components/layout/footer.tsx`, `components/ui/glass-panel.tsx`, `app/layout.tsx`

**Interfaces:**
- Consumes: existing `GlassPanel` (Phase 1 Task 3), `Nav`/`Footer` (Phase 1 Task 4), `PageContainer` (Phase 1 Task 5)
- Produces: `<Container>` — `{ children: ReactNode; className?: string }`, the shared `mx-auto max-w-6xl px-4` row wrapper that `PageContainer`, `Nav`, and `Footer` all build on. `GlassPanel` gains two additions every later task in this phase relies on: a `hoverLift?: boolean` prop (default `true`, preserves current behavior) and pass-through of arbitrary extra props (e.g. `aria-label`) onto the rendered element.

- [ ] **Step 1: Create the shared `Container` primitive**

```tsx
// components/layout/container.tsx
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-6xl px-4 ${className}`}>{children}</div>
  );
}
```

- [ ] **Step 2: Rebuild `PageContainer` on top of `Container`**

Replace `components/layout/page-container.tsx` entirely with:

```tsx
// components/layout/page-container.tsx
import { ReactNode } from "react";
import { Container } from "@/components/layout/container";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <Container className={`py-16 ${className}`}>{children}</Container>;
}
```

- [ ] **Step 3: Add `hoverLift` and pass-through props to `GlassPanel`**

Replace `components/ui/glass-panel.tsx` entirely with:

```tsx
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
```

- [ ] **Step 4: Wrap Nav in `Container`, add `aria-label` and focus-visible styling**

Replace `components/layout/nav.tsx` entirely with:

```tsx
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
```

(Task 2 below adds the mobile menu on top of this — it's a separate,
independently reviewable change since it introduces client-side state.)

- [ ] **Step 5: Wrap Footer in `Container`, add `aria-label` and focus-visible styling**

Replace `components/layout/footer.tsx` entirely with:

```tsx
// components/layout/footer.tsx
import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-graphite-900 py-10">
      <Container className="flex flex-col gap-4 text-sm text-steel-200 md:flex-row md:items-center md:justify-between">
        <p>© {year} BELL Machine Works. Gilroy, CA.</p>
        <nav aria-label="Footer" className="flex gap-6">
          <Link
            href="/quote"
            className="rounded-sm hover:text-steel-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            Get a Quote
          </Link>
          <Link
            href="/contact"
            className="rounded-sm hover:text-steel-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            Contact
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 6: Add a skip link and `id="main-content"` in the root layout**

In `app/layout.tsx`, the `<body>` currently renders `<Nav />`, then
`<main className="flex-1">{children}</main>`, then `<Footer />`. Change the
`<body>` contents to:

```tsx
      <body className="flex min-h-screen flex-col bg-graphite-950 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-graphite-900 focus:px-4 focus:py-2 focus:text-steel-100 focus:outline focus:outline-2 focus:outline-accent-400"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
```

Leave every other line of `app/layout.tsx` (imports, font setup, metadata,
the `<html>` tag) exactly as it is.

- [ ] **Step 7: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0, route summary shows `/`.

- [ ] **Step 8: Verify the rendered output**

The port-3000 dev server may already be running and cannot be reused for a
second `next dev` in this directory (known project constraint). Use a
built production server on a different port instead:

```bash
./node_modules/.bin/next start -p 3101 &
sleep 2
curl -s http://localhost:3101 | grep -o 'aria-label="Primary"'
curl -s http://localhost:3101 | grep -o 'id="main-content"'
curl -s http://localhost:3101 | grep -o 'Skip to content'
kill %1
```

Expected: all three greps find a match.

- [ ] **Step 9: Commit**

```bash
git add components/layout/container.tsx components/layout/page-container.tsx components/layout/nav.tsx components/layout/footer.tsx components/ui/glass-panel.tsx app/layout.tsx
git commit -m "$(cat <<'EOF'
Extract shared Container primitive; fix nav/footer accessibility gaps

- New Container primitive replaces the mx-auto max-w-6xl px-4 pattern
  duplicated across PageContainer, Nav, and Footer (Phase 1 final-review
  Minor finding).
- GlassPanel gains a hoverLift prop (default true) so non-interactive
  glass surfaces like the nav can opt out of the hover-lift jog, plus
  pass-through of extra props (aria-label, etc.) onto the rendered element.
- Nav and Footer nav landmarks now have aria-label; root layout adds a
  skip-to-content link and id="main-content" on <main>; every nav/footer
  link gets a focus-visible outline (Phase 1 final-review Minor finding).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 2: Mobile navigation menu

**Files:**
- Modify: `components/layout/nav.tsx`

**Interfaces:**
- Consumes: `Container`, `GlassPanel` with `hoverLift` (Task 1)
- Produces: no new exports — `Nav` keeps its existing no-props signature; it becomes a Client Component internally

- [ ] **Step 1: Replace `components/layout/nav.tsx` with a client component that adds a mobile menu**

```tsx
// components/layout/nav.tsx
"use client";

import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50">
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
          {open && (
            <ul id="mobile-menu" className="mt-4 flex flex-col gap-4 md:hidden">
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
          )}
        </GlassPanel>
      </Container>
    </header>
  );
}
```

Why: the hamburger button is `md:hidden` (mobile/tablet only) and toggles
`open`, which conditionally renders the stacked `LINKS` list below the top
row (also `md:hidden`, so it never doubles up with the desktop `<ul>`).
Each mobile link closes the menu on click via `setOpen(false)` before
navigating. `aria-expanded`/`aria-controls`/`aria-label` on the button and
`id="mobile-menu"` on the panel keep it screen-reader-usable.

- [ ] **Step 2: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0. (This also confirms the `"use client"` boundary compiles
cleanly — Nav is now a Client Component.)

- [ ] **Step 3: Verify the closed-state markup renders**

```bash
./node_modules/.bin/next start -p 3101 &
sleep 2
curl -s http://localhost:3101 | grep -o 'aria-controls="mobile-menu"'
curl -s http://localhost:3101 | grep -o 'Open menu'
kill %1
```

Expected: both greps find a match. (The menu's open/closed toggle itself is
client-side interactivity — confirm it by clicking the hamburger at a
mobile viewport width in an actual browser at the next check-in.)

- [ ] **Step 4: Commit**

```bash
git add components/layout/nav.tsx
git commit -m "$(cat <<'EOF'
Add mobile navigation menu

Nav becomes a Client Component with a hamburger toggle below 768px,
revealing the same route list stacked vertically. Closes the parked
Phase 1 finding that the nav was fully unreachable on mobile — no phase
owned this until now.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 3: Background depth layer behind the glass

**Files:**
- Create: `components/ui/background-depth.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `--color-accent-500`, `--color-steel-400` theme tokens (Phase 1 Task 2)
- Produces: `<BackgroundDepth />` — no props, renders `null`-equivalent decorative markup only (`aria-hidden`, `pointer-events-none`)

- [ ] **Step 1: Create the background depth component**

```tsx
// components/ui/background-depth.tsx
export function BackgroundDepth() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -left-1/4 -top-1/4 h-[60vh] w-[60vh] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-500) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[70vh] w-[70vh] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-steel-400) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
```

Why: Design-Direction.md §2 calls a background depth layer "core to the
glass read" and explicitly offers "a soft dark gradient mesh in
steel/graphite/blue tones" as the option that doesn't depend on real
photography (which doesn't exist yet — Pillar 5 is unscheduled). This is
CSS-only: two large, heavily blurred radial gradients in the existing
accent/steel tokens, fixed to the viewport, `-z-10` so they sit behind all
normal-flow content, `pointer-events-none` and `aria-hidden` so they never
intercept clicks or screen-reader focus.

- [ ] **Step 2: Render it in the root layout**

In `app/layout.tsx`, add the import and render `<BackgroundDepth />` as the
first child of `<body>`, before the skip link:

```tsx
import { BackgroundDepth } from "@/components/ui/background-depth";
```

```tsx
      <body className="flex min-h-screen flex-col bg-graphite-950 antialiased">
        <BackgroundDepth />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-graphite-900 focus:px-4 focus:py-2 focus:text-steel-100 focus:outline focus:outline-2 focus:outline-accent-400"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
```

- [ ] **Step 3: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 4: Verify it renders**

```bash
./node_modules/.bin/next start -p 3101 &
sleep 2
curl -s http://localhost:3101 | grep -o 'radial-gradient'
kill %1
```

Expected: at least one match. Note in your report that the actual visible
blur-through-glass effect needs an eyeball check in a browser (this is
decorative CSS, not something curl output proves) — flag it for the next
check-in rather than claiming it visually verified.

- [ ] **Step 5: Commit**

```bash
git add components/ui/background-depth.tsx app/layout.tsx
git commit -m "$(cat <<'EOF'
Add background depth layer behind glass panels

Design-Direction.md §2 calls out a blurred background layer as core to
the "glass" read — without it, backdrop-blur has nothing to blur. Uses a
CSS-only soft gradient mesh in the existing accent/steel tokens (no
photography exists yet, so this is the documented fallback option, not a
placeholder).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 4: Real homepage hero, replacing the Phase 1 stub

**Files:**
- Create: `lib/content/home.ts`, `components/home/hero-section.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `GlassPanel` with `hoverLift` (Task 1), `PageContainer` (Phase 1 Task 5)
- Produces: `heroContent` export from `lib/content/home.ts` (`{ headline, subhead, ctaLabel, ctaHref }`, all `string`) — Tasks 5 and 6 add more exports to this same file; `<HeroSection>` — no props

- [ ] **Step 1: Create the home content data file with the hero copy**

```ts
// lib/content/home.ts
export const heroContent = {
  headline: 'Engineering-Led CNC Machining, to ±0.0002"',
  subhead:
    "Simultaneous 5-axis milling of titanium, Inconel, and precision plastics for semiconductor, aerospace, and robotics teams who can't afford a bad tolerance. Bay Area–based. Quotes within hours.",
  ctaLabel: "Get a Quote",
  ctaHref: "/quote",
};
```

This is the revised, answer-first hero from Rebuild-Build-Plan.md §2.3 —
keeps BELL's existing "Engineering-Led" brand line but leads the first
sentence with a checkable fact.

- [ ] **Step 2: Create the HeroSection component**

```tsx
// components/home/hero-section.tsx
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { heroContent } from "@/lib/content/home";

export function HeroSection() {
  return (
    <GlassPanel hoverLift={false} className="p-10 md:p-16">
      <h1 className="text-3xl font-semibold text-steel-100 md:text-5xl">
        {heroContent.headline}
      </h1>
      <p className="mt-4 max-w-2xl text-steel-200">{heroContent.subhead}</p>
      <Link
        href={heroContent.ctaHref}
        className="mt-8 inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
      >
        {heroContent.ctaLabel}
      </Link>
    </GlassPanel>
  );
}
```

`hoverLift={false}` because this is a static hero panel, not an
interactive card (Phase 1 final-review Minor finding #4).

- [ ] **Step 3: Replace `app/page.tsx`**

```tsx
// app/page.tsx
import { PageContainer } from "@/components/layout/page-container";
import { HeroSection } from "@/components/home/hero-section";

export default function Home() {
  return (
    <PageContainer>
      <HeroSection />
    </PageContainer>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 5: Verify the rendered output**

```bash
./node_modules/.bin/next start -p 3101 &
sleep 2
curl -s http://localhost:3101 | grep -o 'Engineering-Led CNC Machining, to'
kill %1
```

Expected: a match.

- [ ] **Step 6: Commit**

```bash
git add lib/content/home.ts components/home/hero-section.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
Replace Phase 1 home stub with real spec-first hero

Real hero copy per Rebuild-Build-Plan.md §2.3: leads with a checkable
tolerance fact (±0.0002") ahead of the brand line, closing with the
existing "quotes within hours" claim. Home page content now lives in
lib/content/home.ts — Tasks 5-6 extend this same file.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 5: Certification roadmap snippet on the home page

**Files:**
- Modify: `lib/content/home.ts`, `app/page.tsx`
- Create: `components/home/cert-roadmap-section.tsx`

**Interfaces:**
- Consumes: `heroContent` export shape precedent (Task 4)
- Produces: `certRoadmapContent` export added to `lib/content/home.ts` (`{ heading, status, proofPoints: string[], ctaLabel, ctaHref }`); `<CertRoadmapSection>` — no props

- [ ] **Step 1: Add cert roadmap content to `lib/content/home.ts`**

Append to the existing file (keep `heroContent` as-is):

```ts

export const certRoadmapContent = {
  heading: "Certification roadmap",
  status: "AS9100D and ITAR registration are actively in progress.",
  proofPoints: [
    "Full material traceability with mill test reports (MTRs) on every job",
    "First-article inspection per AS9102",
    "Digital GD&T verification",
    "Complete process and setup documentation",
  ],
  ctaLabel: "See our quality process",
  ctaHref: "/quality",
};
```

Per Rebuild-Build-Plan.md §1.2 Pillar 2: pairs the honest "not certified
yet" status with the substitute credibility BELL already has today, in the
same breath. Exact target dates are an open item blocking Bushra's
sign-off (§6 item 2) — this copy states the roadmap status without
inventing a date.

- [ ] **Step 2: Create the CertRoadmapSection component**

```tsx
// components/home/cert-roadmap-section.tsx
import Link from "next/link";
import { certRoadmapContent } from "@/lib/content/home";

export function CertRoadmapSection() {
  return (
    <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
      <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
        {certRoadmapContent.heading}
      </h2>
      <p className="mt-3 max-w-2xl text-steel-200">{certRoadmapContent.status}</p>
      <ul className="mt-6 grid gap-3 text-sm text-steel-200 md:grid-cols-2">
        {certRoadmapContent.proofPoints.map((point) => (
          <li key={point} className="flex gap-2">
            <span aria-hidden className="text-accent-400">
              &middot;
            </span>
            {point}
          </li>
        ))}
      </ul>
      <Link
        href={certRoadmapContent.ctaHref}
        className="mt-6 inline-block text-sm font-medium text-accent-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
      >
        {certRoadmapContent.ctaLabel} →
      </Link>
    </section>
  );
}
```

Solid `bg-graphite-900`, not `GlassPanel` — see the phase-level design note
above on why cert content stays off glass even on the home page.

- [ ] **Step 3: Render it on the home page**

Replace `app/page.tsx` entirely with:

```tsx
// app/page.tsx
import { PageContainer } from "@/components/layout/page-container";
import { HeroSection } from "@/components/home/hero-section";
import { CertRoadmapSection } from "@/components/home/cert-roadmap-section";

export default function Home() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <HeroSection />
      <CertRoadmapSection />
    </PageContainer>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 5: Verify the rendered output**

```bash
./node_modules/.bin/next start -p 3101 &
sleep 2
curl -s http://localhost:3101 | grep -o 'Certification roadmap'
kill %1
```

Expected: a match.

- [ ] **Step 6: Commit**

```bash
git add lib/content/home.ts components/home/cert-roadmap-section.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
Add certification roadmap snippet to home page

Pillar 2 framing (Rebuild-Build-Plan.md §1.2): pairs the honest AS9100D/
ITAR in-progress status with the quality rigor BELL already practices
today (MTRs, FAI, GD&T verification, process documentation), in the same
breath. Solid background, not glass — see phase-level design note in the
plan doc.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 6: Named-client teaser section on the home page

**Files:**
- Create: `lib/content/case-studies.ts`, `components/home/client-teaser-section.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `GlassPanel` (Task 1)
- Produces: `CaseStudySummary` interface and `caseStudies: CaseStudySummary[]` export from `lib/content/case-studies.ts` — Phase 3's individual case-study pages extend this same file with full case-study content, keyed by the same `slug`; `<ClientTeaserSection>` — no props

- [ ] **Step 1: Create the case-studies data file**

```ts
// lib/content/case-studies.ts
export interface CaseStudySummary {
  slug: string;
  client: string;
  sector: string;
  material: string;
  summary: string;
  tier: "A" | "B" | "C";
}

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "asml",
    client: "ASML",
    sector: "Semiconductor Equipment",
    material: "Aluminum 6061-T6",
    summary:
      "Alignment brackets and vacuum-sealing components for lithography systems, holding tight tolerances across six sealing locations.",
    tier: "A",
  },
  {
    slug: "stoke-space",
    client: "Stoke Space",
    sector: "Aerospace",
    material: "Delrin & PTFE",
    summary:
      "Tube raceway brackets and cryo-compatible clamp families for a reusable launch vehicle's propulsion system.",
    tier: "A",
  },
  {
    slug: "corning",
    client: "Corning Incorporated",
    sector: "Photonics & Optical Systems",
    material: "Aluminum 6061-T6",
    summary:
      "Optical transition adapter and backing block finished to 32 μin Ra for optical-grade contact surfaces.",
    tier: "A",
  },
  {
    slug: "ucsf",
    client: "UCSF Biomedical Engineering",
    sector: "Medical Device R&D",
    material: "Polycarbonate",
    summary:
      "Microfluidic manifold halves for organ-on-chip research, holding a 0.4mm micro-channel width.",
    tier: "A",
  },
];
```

Sourced directly from Case-Studies-Draft.md — these four are the ones its
own "Notes for Bushra's Review" section flags as the strongest to lead
with. All four are Tier A (fully named) under Himadri's 2026-09-03 default
— see the phase-level client-naming note above.

- [ ] **Step 2: Create the ClientTeaserSection component**

```tsx
// components/home/client-teaser-section.tsx
import { GlassPanel } from "@/components/ui/glass-panel";
import { caseStudies } from "@/lib/content/case-studies";

export function ClientTeaserSection() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
        Trusted by engineering teams at
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {caseStudies.map((study) => (
          <GlassPanel key={study.slug} className="p-6">
            <p className="text-sm text-accent-400">{study.sector}</p>
            <h3 className="mt-1 text-lg font-semibold text-steel-100">
              {study.client}
            </h3>
            <p className="mt-2 text-sm text-steel-200">{study.summary}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
```

`hoverLift` is left at its default `true` here — these read as cards
(Design-Direction.md §2 lists "case-study cards" as an explicit glass use
case), unlike the nav/hero.

- [ ] **Step 3: Render it on the home page**

Replace `app/page.tsx` entirely with:

```tsx
// app/page.tsx
import { PageContainer } from "@/components/layout/page-container";
import { HeroSection } from "@/components/home/hero-section";
import { CertRoadmapSection } from "@/components/home/cert-roadmap-section";
import { ClientTeaserSection } from "@/components/home/client-teaser-section";

export default function Home() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <HeroSection />
      <CertRoadmapSection />
      <ClientTeaserSection />
    </PageContainer>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 5: Verify the rendered output**

```bash
./node_modules/.bin/next start -p 3101 &
sleep 2
curl -s http://localhost:3101 | grep -o 'ASML'
curl -s http://localhost:3101 | grep -o 'Stoke Space'
kill %1
```

Expected: both greps find a match.

- [ ] **Step 6: Commit**

```bash
git add lib/content/case-studies.ts components/home/client-teaser-section.tsx app/page.tsx
git commit -m "$(cat <<'EOF'
Add named-client teaser section to home page

Four strongest Tier-A case studies per Case-Studies-Draft.md's own
"Notes for Bushra's Review": ASML, Stoke Space, Corning, UCSF. Data
lives in lib/content/case-studies.ts, keyed by slug, so Phase 3's full
case-study pages can extend the same records instead of duplicating them.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 7: Capabilities hub page

**Files:**
- Create: `lib/content/capabilities.ts`, `app/capabilities/page.tsx`

**Interfaces:**
- Consumes: `PageContainer` (Phase 1 Task 5), `GlassPanel` (Task 1)
- Produces: nothing later tasks in this plan depend on (Phase 3+ process/material detail pages are unscoped — see note below)

- [ ] **Step 1: Create the capabilities content data file**

```ts
// lib/content/capabilities.ts
export const capabilityHighlights = [
  { label: "Tolerance", value: '±0.0002" on critical features' },
  { label: "Micro-features", value: 'Down to < Ø0.01"' },
  { label: "Surface finish", value: "To 32 μin Ra on optical-grade contact surfaces" },
  { label: "Work envelope", value: '8" × 6" × 3" per setup' },
];

export const processes = [
  {
    name: "5-Axis CNC Milling",
    status: "In-house, confirmed",
    href: "/capabilities/5-axis-milling",
  },
];

export interface MaterialFamily {
  name: string;
  examples: string;
  href: string;
}

export const materialFamilies: MaterialFamily[] = [
  {
    name: "Titanium & Aerospace Alloys",
    examples: "Titanium Grade 5, Inconel 625, Inconel 718",
    href: "/capabilities/materials/titanium-aerospace-alloys",
  },
  {
    name: "Stainless Steels",
    examples: "Including 303, as used in production tooling and fixtures",
    href: "/capabilities/materials/stainless-steels",
  },
  {
    name: "Non-Ferrous",
    examples: "Aluminum 6061-T6, 7075, Copper C110, and other alloys by request",
    href: "/capabilities/materials/non-ferrous",
  },
  {
    name: "Engineering Plastics",
    examples: "PEEK, Delrin, PTFE, UHMW PE, and other engineering plastics by request",
    href: "/capabilities/materials/engineering-plastics",
  },
];
```

Every figure here is sourced: the tolerance/finish/micro-feature/envelope
numbers are BELL's own current-site specs (quoted in Rebuild-Build-Plan.md
§2.1); every material example is a grade BELL has actually machined per
Case-Studies-Draft.md (Ti Grade 5/Inconel 625/718, Copper C110, Delrin,
PTFE, UHMW PE, Stainless 303) or the current homepage's confirmed list
(PEEK, per the CNC-Website-Rubric research). Nothing here is invented —
where the sitemap's own material-family list (Ultem, Torlon, Vespel) isn't
backed by a real job in the source docs, it's left out rather than implied.

- [ ] **Step 2: Create the Capabilities hub page**

```tsx
// app/capabilities/page.tsx
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
  capabilityHighlights,
  materialFamilies,
  processes,
} from "@/lib/content/capabilities";

const LINK_STYLE =
  "text-steel-100 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2";

export default function CapabilitiesPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">
          Capabilities
        </h1>
        <p className="mt-4 max-w-2xl text-steel-200">
          Precision CNC machining built around real tolerance and finish
          requirements — not generic shop capability claims.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          Machining capability
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {capabilityHighlights.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-steel-400">{item.label}</dt>
              <dd className="mt-1 text-lg text-steel-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          Processes
        </h2>
        <table className="mt-6 w-full text-left text-sm text-steel-200">
          <thead>
            <tr className="border-b border-white/10 text-steel-400">
              <th className="py-2 pr-4 font-medium">Process</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.name} className="border-b border-white/5">
                <td className="py-3 pr-4">
                  <Link href={process.href} className={LINK_STYLE}>
                    {process.name}
                  </Link>
                </td>
                <td className="py-3">{process.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-steel-400">
          Additional in-house processes and a full equipment list are being
          confirmed and will be added here — ask about a specific process on
          your RFQ.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          Materials
        </h2>
        <table className="mt-6 w-full text-left text-sm text-steel-200">
          <thead>
            <tr className="border-b border-white/10 text-steel-400">
              <th className="py-2 pr-4 font-medium">Family</th>
              <th className="py-2 font-medium">Examples</th>
            </tr>
          </thead>
          <tbody>
            {materialFamilies.map((family) => (
              <tr key={family.name} className="border-b border-white/5">
                <td className="py-3 pr-4">
                  <Link href={family.href} className={LINK_STYLE}>
                    {family.name}
                  </Link>
                </td>
                <td className="py-3">{family.examples}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <h2 className="text-xl font-semibold text-steel-100">
            Have a print or model ready?
          </h2>
          <p className="mt-2 text-steel-200">Most quotes go out within hours.</p>
        </div>
        <Link
          href="/quote"
          className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
        >
          Get a Quote
        </Link>
      </GlassPanel>
    </PageContainer>
  );
}
```

Tables stay on solid `bg-graphite-900` per the Global Constraints glass
rule (spec tables/data are never glass); only the closing CTA panel uses
`GlassPanel`, matching the rule's own carve-out for CTA panels. The
process/material `<Link>` targets don't exist as pages yet — same accepted
pattern as Phase 1's Nav links to `/industries`, `/quality`, etc.
(confirmed non-blocking: Next.js doesn't error on a `<Link>` to a route
that doesn't exist yet at build time). These detail pages aren't assigned
to a phase in this plan yet — flag it explicitly when Phase 3 is planned in
detail.

- [ ] **Step 3: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0, route summary includes `/capabilities`.

- [ ] **Step 4: Verify the rendered output**

```bash
./node_modules/.bin/next start -p 3101 &
sleep 2
curl -s http://localhost:3101/capabilities | grep -o 'Machining capability'
curl -s http://localhost:3101/capabilities | grep -o '5-Axis CNC Milling'
kill %1
```

Expected: both greps find a match.

- [ ] **Step 5: Commit**

```bash
git add lib/content/capabilities.ts app/capabilities/page.tsx
git commit -m "$(cat <<'EOF'
Add Capabilities hub page

Tolerance/finish/envelope highlights, a process table (5-axis milling
confirmed; other in-house processes still being confirmed with Bushra —
stated honestly, not invented), and a materials-by-family table, all
sourced from real specs and real Closed Won job materials. Tables stay
solid per the glass-exclusion rule; only the closing CTA panel is glass.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

**Phase 2 exit criteria:** `next build` passes; dev server serves a real
home page (spec-first hero, cert-roadmap snippet, four named-client teaser
cards) and a Capabilities hub page (tolerance/process/materials tables,
CTA panel); nav is usable at both desktop and mobile widths; `git log`
shows one commit per task. Next phase starts fresh after a `/compact`.

---

## Phase 3 — Industries (6 pages) + Case Studies (plan in detail at phase start)

One page per industry vertical (Semiconductor Equipment, Robotics & Automation, Photonics & Optical Systems, Aerospace Components, Medical Device R&D, Specialty Applications) sourcing copy from Rebuild-Build-Plan.md §2.4, plus individual case-study pages sourced directly from Case-Studies-Draft.md's Tier-A content. Case-study cards use glass; the tolerance/material facts within them stay on solid backgrounds.

## Phase 4 — RFQ form + file upload backend (plan in detail at phase start)

Structured form (material, quantity, timeline, cert requirement, file input) per spec §4, a Next.js server action streaming the upload to Vercel Blob, a Resend email to Bushra with submission details and a file link, accepted-type validation (STEP/IGES/Parasolid/STL/PDF/DWG/DXF), and a visible turnaround-SLA statement at the point of submission. Form surface stays solid per the glass exclusion list.

## Phase 5 — About/Team + Quality & Certifications + Contact (plan in detail at phase start)

About/Team page with Bushra's story and any additional named staff (placeholder content where bios/photos aren't yet supplied — flagged, not faked). Quality & Certifications page implementing the Pillar 2 roadmap framing (dated cert status paired with existing quality rigor) and a Sample Quality Documentation section. Contact page. All spec/cert content on solid backgrounds per the glass exclusion list.

## Phase 6 — Polish pass (plan in detail at phase start)

Motion/animation review against the `animate`/`review-animations`/`improve-animations` skills, responsive QA across breakpoints, SEO/schema markup (Person schema for team, capability schema for pages), removal of any stray Squarespace-era references, and a final full click-through of every route in-browser.
