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
- Stock/placeholder photography in `public/images/stock/` (manifest at `public/images/stock/MANIFEST.md`) is atmospheric and generic only — used for hero backgrounds, section texture, and unlabeled accents. It is never captioned or presented as depicting a specific named client's actual part; only real client-supplied photography may be attributed to a named client. Swap stock for real shop photography page-by-page as Bushra supplies it, not all at once.
- Every new page (static or dynamic route) ships with page-specific `metadata` — a static `export const metadata: Metadata` for fixed routes, `generateMetadata` for dynamic `[slug]` routes. No route inherits the root layout's home-page title/description silently (Phase 2 final-review finding, now a standing rule).
- All scroll-driven and entrance motion (Phase 4 onward) must degrade to a fully static, final-state render under `prefers-reduced-motion: reduce` — no exceptions.
- Continuous scroll-linked effects (eye-level opacity dimming, sticky-stack scale/brightness) are never applied to spec tables/data or the RFQ form surface — same intent as the glass-usage exclusion list above. A one-time reveal-on-enter (fade + rise, settling at fully opaque/static) is fine on those sections; a continuous scroll-tied transform is not.
- Continuous scroll-linked effects are desktop-only (viewport ≥ 768px); on narrower viewports they no-op and content renders in its default static layout, matching the reference site's own mobile gating.

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

## Phase 3 — Industries + Case Studies + first photography pass

Six industry vertical pages, a Work/Case Studies hub with one flagship named case study per vertical, and the phase's own photography integration task (sourcing generic, honestly-used stock photography into `public/images/stock/` and wiring it into the home hero, Capabilities, and the new hub pages). `/capabilities/5-axis-milling` and the four `/capabilities/materials/*` detail-page routes that Task 7 of Phase 2 already links to remain explicitly unassigned — out of scope here, to be picked up when Phase 4 is planned, not folded into this phase.

Scope decision on case studies: Case-Studies-Draft.md drafts 15 Tier-A client stories across the six verticals, but its own "Notes for Bushra's Review" section names four as strongest to lead with (ASML, Stoke Space, Corning, UCSF) — already shipped as home-page teasers in Phase 2. This phase gives every one of the six industries exactly one flagship named case study: the four already-teased ones, plus Amazon Robotics for Robotics & Automation and nVent Data Solutions for Specialty Applications (the strongest remaining candidates per the same source doc). The other 9 drafted case studies stay unshipped, available for a later phase once Bushra's naming review is complete — this is a scope ruling, not a data loss; nothing here forecloses adding them later.

**Files:**
- Modify: `lib/content/case-studies.ts`
- Create: `lib/content/industries.ts`, `components/industries/industry-card.tsx`, `app/industries/page.tsx`, `app/industries/[slug]/page.tsx`, `components/work/case-study-card.tsx`, `app/work/page.tsx`, `app/work/[slug]/page.tsx`
- Modify: `components/home/hero-section.tsx`, `app/capabilities/page.tsx`

### Task 1: Extend case-studies data with full detail content

**Files:**
- Modify: `lib/content/case-studies.ts`

**Interfaces:**
- Consumes: existing `CaseStudySummary` interface and `caseStudies` array (Phase 2 Task 6) — this task extends both, it does not replace them
- Produces: extended `CaseStudySummary` interface (adds `industrySlug`, `narrative`, `specHighlights`) — Tasks 2, 3, 5 consume `industrySlug` to link industries ↔ case studies; Task 5 consumes `narrative` and `specHighlights` to render the case-study detail page

- [ ] **Step 1: Replace the file's contents**

```ts
// lib/content/case-studies.ts
export interface CaseStudySummary {
  slug: string;
  client: string;
  sector: string;
  industrySlug: string;
  material: string;
  summary: string;
  narrative: string;
  specHighlights: { label: string; value: string }[];
  tier: "A" | "B" | "C";
}

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "asml",
    client: "ASML",
    sector: "Semiconductor Equipment",
    industrySlug: "semiconductor-equipment",
    material: "Aluminum 6061-T6",
    summary:
      "Alignment brackets and vacuum-sealing components for lithography systems, holding tight tolerances across six sealing locations.",
    narrative:
      "BELL has machined critical alignment brackets and vacuum/gas sealing components for ASML's lithography systems — the machines that print the circuitry on nearly every advanced chip made today. Two separate engagements: a 3F alignment bracket holding precise tube alignment through the optical path, paired with a \"popless\" fusing lid designed to prevent particle contamination in clean-room environments; and an O-ring sealed bracket and plate set with six tight-tolerance sealing locations (down to 0.079\" plate thickness) maintaining vacuum integrity for wafer processing. This is exactly the kind of work where a tolerance miss doesn't mean a bad part — it means particle contamination in an EUV chamber.",
    specHighlights: [
      { label: "Sealing locations", value: "6 tight-tolerance locations" },
      { label: "Plate thickness", value: 'Down to 0.079"' },
      { label: "Material", value: "Aluminum 6061-T6" },
    ],
    tier: "A",
  },
  {
    slug: "stoke-space",
    client: "Stoke Space",
    sector: "Aerospace",
    industrySlug: "aerospace-components",
    material: "Delrin & PTFE",
    summary:
      "Tube raceway brackets and cryo-compatible clamp families for a reusable launch vehicle's propulsion system.",
    narrative:
      "BELL machined two related bracket families for Stoke Space's Nova program — a fully reusable medium-lift launch vehicle under development at Stoke's Kent, WA facility. The first: white Delrin top/bottom raceway brackets organizing parallel tube and fluid lines with contoured saddles and structural ribs to prevent deflection under vibration. The second: a six-part black PTFE clamp family (standard, \"special,\" and cryo-inert \"Y-Inert\" variants, 90 pieces total) selected specifically for cryogenic compatibility and chemical inertness — consistent with propellant and inerting line management on actual flight hardware. Both shipped on expedited next-day timelines supporting active propulsion system integration.",
    specHighlights: [
      { label: "Clamp family", value: "6-part family, 90 pieces total" },
      { label: "Turnaround", value: "Expedited next-day" },
      { label: "Material", value: "Delrin 150 & cryo-compatible PTFE" },
    ],
    tier: "A",
  },
  {
    slug: "corning",
    client: "Corning Incorporated",
    sector: "Photonics & Optical Systems",
    industrySlug: "photonics-optical-systems",
    material: "Aluminum 6061-T6",
    summary:
      "Optical transition adapter and backing block finished to 32 μin Ra for optical-grade contact surfaces.",
    narrative:
      "An optical transition adapter with 10 tight-tolerance alignment locations, paired with a backing block finished to 32 μin Ra on five surfaces for optical-grade contact — machined for Corning's glass and fiber-optic processing equipment. This is a near-exact match to the \"10+ alignment locations\" and \"32 μin Ra optical-grade finish\" language on BELL's own homepage — this is the real job behind that claim.",
    specHighlights: [
      { label: "Alignment locations", value: "10 tight-tolerance locations" },
      { label: "Surface finish", value: "32 μin Ra on 5 surfaces" },
      { label: "Material", value: "Aluminum 6061-T6" },
    ],
    tier: "A",
  },
  {
    slug: "ucsf",
    client: "UCSF Biomedical Engineering",
    sector: "Medical Device R&D",
    industrySlug: "medical-device-rd",
    material: "Polycarbonate",
    summary:
      "Microfluidic manifold halves for organ-on-chip research, holding a 0.4mm micro-channel width.",
    narrative:
      "Two complementary polycarbonate manifold halves for an organ-on-chip microfluidics research device at UCSF's Byers Hall, Mission Bay campus — with a 0.4mm micro-channel width requirement demanding genuine micro-machining precision. Clear polycarbonate was chosen for optical transparency (real-time visualization of live cell cultures under the microscope) and biocompatibility; the bead-blast finish specifically reduces optical distortion without sacrificing microscopy access.",
    specHighlights: [
      { label: "Micro-channel width", value: "0.4mm" },
      { label: "Finish", value: "Bead-blast, optically clear" },
      { label: "Material", value: "Polycarbonate" },
    ],
    tier: "A",
  },
  {
    slug: "amazon-robotics",
    client: "Amazon Robotics",
    sector: "Robotics & Automation",
    industrySlug: "robotics-automation",
    material: "Polycarbonate, white",
    summary:
      "Precision sensor-mounting fixtures with 3mm/4mm hole patterns for vision-system testing at a robotics innovation hub.",
    narrative:
      "A four-piece polycarbonate fixture set with precision 3mm/4mm hole patterns for sensor mounting and calibration, built for Amazon Robotics' 350,000 sq ft Westborough, MA innovation hub — where the company designs and tests the mobile drive units and warehouse robots used across its fulfillment network. Polycarbonate's optical clarity was specifically needed for vision-system testing during development.",
    specHighlights: [
      { label: "Hole patterns", value: "3mm / 4mm precision" },
      { label: "Fixture set", value: "4-piece" },
      { label: "Material", value: "Polycarbonate" },
    ],
    tier: "A",
  },
  {
    slug: "nvent",
    client: "nVent Data Solutions",
    sector: "Specialty Applications",
    industrySlug: "specialty-applications",
    material: "Delrin 150, black",
    summary:
      "Precision liquid-cooling clamps supplying AI data-center infrastructure on an expedited production ramp.",
    narrative:
      "Precision saddle-style Delrin clamps (9 sets) securing coolant distribution piping at nVent's new 117,000 sq ft Blaine, MN facility — built to supply liquid cooling systems for NVIDIA GB200-class AI server infrastructure. A genuinely notable, currently-relevant client given the AI infrastructure buildout, and a good example of BELL's ability to support a fast production ramp-up: 5-day expedited delivery on this job.",
    specHighlights: [
      { label: "Clamp sets", value: "9 sets, saddle-style" },
      { label: "Turnaround", value: "5-day expedited" },
      { label: "Material", value: "Delrin 150" },
    ],
    tier: "A",
  },
];
```

Every figure is copied verbatim from Case-Studies-Draft.md — nothing invented. `industrySlug` values are chosen now so Task 2's `lib/content/industries.ts` can reference them back; keep them exactly as spelled here (`semiconductor-equipment`, `aerospace-components`, `photonics-optical-systems`, `medical-device-rd`, `robotics-automation`, `specialty-applications`).

- [ ] **Step 2: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0 (this file has no consumers yet beyond Phase 2's `ClientTeaserSection`, which only reads `slug`/`client`/`sector`/`summary` — unaffected by the added fields).

- [ ] **Step 3: Commit**

```bash
git add lib/content/case-studies.ts
git commit -m "$(cat <<'EOF'
Extend case-studies data with narrative detail and industry links

Adds industrySlug, narrative, and specHighlights fields to the four
existing Tier-A case studies (ASML, Stoke Space, Corning, UCSF), and
adds two more flagship case studies (Amazon Robotics, nVent Data
Solutions) so every one of BELL's six industry verticals has exactly
one named case study to link to. All content sourced verbatim from
Case-Studies-Draft.md; the remaining 9 drafted case studies stay
unshipped pending Bushra's naming review.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 2: Industries content data + hub page

**Files:**
- Create: `lib/content/industries.ts`, `components/industries/industry-card.tsx`, `app/industries/page.tsx`

**Interfaces:**
- Consumes: `GlassPanel` (`components/ui/glass-panel.tsx`), `PageContainer` (`components/layout/page-container.tsx`), `caseStudies` (Task 1, for the case-study summary shown on each card — read-only, not modified)
- Produces: `Industry` interface and `industries: Industry[]` export from `lib/content/industries.ts` — Task 3's detail route consumes this by `slug`; `<IndustryCard industry={...} />` — Task 3 does not reuse this component (its own page needs a different, larger layout), it exists for the hub grid only

- [ ] **Step 1: Create the industries content data file**

```ts
// lib/content/industries.ts
export interface Industry {
  slug: string;
  name: string;
  tagline: string;
  body: string;
  materials: string[];
  caseStudySlug: string;
}

export const industries: Industry[] = [
  {
    slug: "semiconductor-equipment",
    name: "Semiconductor Equipment",
    tagline:
      "Sub-micron alignment brackets and vacuum-sealing components for semiconductor lithography systems.",
    body: "BELL machines alignment brackets, vacuum/gas sealing components, thermal management assemblies, and multi-point mounting fixtures for semiconductor equipment builders — holding tolerances to ±0.0002\" on critical features, with surface finishes to 32 μin Ra where optical-grade contact surfaces are required. Every part ships with CMM inspection data and full material certification.",
    materials: ["Aluminum 6061-T6", "Copper C110", "Stainless Steel 303"],
    caseStudySlug: "asml",
  },
  {
    slug: "aerospace-components",
    name: "Aerospace Components",
    tagline: "Flight-hardware-grade CNC machining, from prototype to production run.",
    body: "BELL machines collar and clamping assemblies, multi-piece cabin furniture sets, DO-160 environmental test fixtures, and non-marring components in titanium Grade 5 and Inconel 625/718, plus cryo-compatible tooling for reusable launch vehicle propulsion systems. Standard lead time is 2 weeks; rush turnaround is available in 24 hours.",
    materials: ["Titanium Grade 5", "Inconel 625", "Inconel 718", "Aluminum 2024"],
    caseStudySlug: "stoke-space",
  },
  {
    slug: "robotics-automation",
    name: "Robotics & Automation",
    tagline:
      "Precision fixtures and wear components for warehouse robotics and automated production lines.",
    body: "BELL machines sensor-mounting and calibration fixtures for robotics R&D, plus wear-resistant components for automated material-handling systems — built to hold precise hole patterns for vision-system testing and to survive continuous-duty industrial automation environments.",
    materials: ["Polycarbonate", "UHMW PE"],
    caseStudySlug: "amazon-robotics",
  },
  {
    slug: "photonics-optical-systems",
    name: "Photonics & Optical Systems",
    tagline: "Optical-grade alignment components finished to 32 μin Ra.",
    body: "BELL machines optical transition adapters, backing blocks, and precision alignment fixtures for glass, fiber-optic, and laser-crystal processing equipment — finished to 32 μin Ra on optical-grade contact surfaces, with tolerances that hold true across ten or more alignment locations on a single part.",
    materials: ["Aluminum 6061-T6", "PTFE"],
    caseStudySlug: "corning",
  },
  {
    slug: "medical-device-rd",
    name: "Medical Device R&D",
    tagline: "Sub-millimeter precision for medical device and biomedical research tooling.",
    body: "BELL machines trim jigs, disassembly fixtures, and microfluidic manifolds for medical device and biopharmaceutical R&D — including sub-millimeter micro-channel features for organ-on-chip research and material-certified tooling for regulated pharmaceutical teardown analysis.",
    materials: ["Polycarbonate", "Stainless Steel 303"],
    caseStudySlug: "ucsf",
  },
  {
    slug: "specialty-applications",
    name: "Specialty Applications",
    tagline:
      "Precision components for AI data-center infrastructure, packaging automation, and beyond.",
    body: "BELL machines precision clamps, wear blocks, and custom fixtures for applications outside its five core verticals — including liquid-cooling clamps for AI data-center infrastructure and wear-resistant components for automated packaging equipment, often on expedited production-ramp timelines.",
    materials: ["Delrin", "UHMW PE"],
    caseStudySlug: "nvent",
  },
];
```

Semiconductor Equipment and Aerospace Components copy is Rebuild-Build-Plan.md §2.4's own drafted industry-page blocks, unchanged. The other four are written in the same answer-first voice, sourced from each industry's Case-Studies-Draft.md section — no invented specs.

- [ ] **Step 2: Create the IndustryCard component**

```tsx
// components/industries/industry-card.tsx
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { Industry } from "@/lib/content/industries";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
    >
      <GlassPanel className="h-full p-6">
        <h3 className="text-lg font-semibold text-steel-100">{industry.name}</h3>
        <p className="mt-2 text-sm text-steel-200">{industry.tagline}</p>
      </GlassPanel>
    </Link>
  );
}
```

`hoverLift` is left at its default `true` — Design-Direction.md §2 lists industry cards as an explicit glass-plus-hover use case, matching `ClientTeaserSection`'s cards.

- [ ] **Step 3: Create the Industries hub page**

```tsx
// app/industries/page.tsx
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { IndustryCard } from "@/components/industries/industry-card";
import { industries } from "@/lib/content/industries";

export const metadata: Metadata = {
  title: "Industries — Precision CNC Machining by Vertical | BELL Machine Works",
  description:
    "Semiconductor equipment, aerospace, robotics, photonics, medical device, and specialty-applications machining — real tolerances, real materials, real clients. Gilroy, CA.",
};

export default function IndustriesPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Industries</h1>
        <p className="mt-4 max-w-2xl text-steel-200">
          Six verticals where BELL has real, shipped work — not a generic capability
          claim for each.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <IndustryCard key={industry.slug} industry={industry} />
        ))}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0, route summary includes `/industries`.

- [ ] **Step 5: Verify the rendered output**

```bash
./node_modules/.bin/next start -p 3104 &
sleep 2
curl -s http://localhost:3104/industries | grep -o 'Semiconductor Equipment'
curl -s http://localhost:3104/industries | grep -o 'Specialty Applications'
kill %1
```

Expected: both greps find a match.

- [ ] **Step 6: Commit**

```bash
git add lib/content/industries.ts components/industries/industry-card.tsx app/industries/page.tsx
git commit -m "$(cat <<'EOF'
Add Industries hub page

Six industry-vertical cards (Semiconductor Equipment, Aerospace,
Robotics & Automation, Photonics & Optical Systems, Medical Device
R&D, Specialty Applications), sourced from Rebuild-Build-Plan.md §2.4
and Case-Studies-Draft.md. Cards are glass per the industry-card
carve-out in the Global Constraints.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 3: Industry detail page (dynamic route)

**Files:**
- Create: `app/industries/[slug]/page.tsx`

**Interfaces:**
- Consumes: `industries` (Task 2), `caseStudies` (Task 1), `PageContainer`, `GlassPanel`
- Produces: nothing later tasks in this plan depend on

- [ ] **Step 1: Create the dynamic industry detail page**

```tsx
// app/industries/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel } from "@/components/ui/glass-panel";
import { industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/case-studies";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} CNC Machining | BELL Machine Works`,
    description: industry.tagline,
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  const caseStudy = caseStudies.find((cs) => cs.slug === industry.caseStudySlug);

  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <p className="text-sm text-accent-400">Industries</p>
        <h1 className="mt-1 text-3xl font-semibold text-steel-100 md:text-4xl">
          {industry.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-steel-200">{industry.tagline}</p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <p className="max-w-3xl text-steel-200">{industry.body}</p>
        <div className="mt-6">
          <h2 className="text-sm font-medium text-steel-200">Materials</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {industry.materials.map((material) => (
              <li
                key={material}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-steel-100"
              >
                {material}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {caseStudy && (
        <section>
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Featured work</h2>
          <Link href={`/work/${caseStudy.slug}`} className="mt-6 block">
            <GlassPanel className="p-6">
              <p className="text-sm text-accent-400">{caseStudy.sector}</p>
              <h3 className="mt-1 text-lg font-semibold text-steel-100">{caseStudy.client}</h3>
              <p className="mt-2 text-sm text-steel-200">{caseStudy.summary}</p>
            </GlassPanel>
          </Link>
        </section>
      )}

      <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <h2 className="text-xl font-semibold text-steel-100">Have a print or model ready?</h2>
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

The materials list and the case-study data facts stay on the solid `bg-graphite-900` section per the glass-exclusion rule; only the featured-work teaser card and the closing CTA use `GlassPanel`, matching Capabilities' own pattern.

- [ ] **Step 2: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0, route summary includes `/industries/[slug]` as a static (SSG) route with 6 generated paths.

- [ ] **Step 3: Verify the rendered output**

```bash
./node_modules/.bin/next start -p 3104 &
sleep 2
curl -s http://localhost:3104/industries/semiconductor-equipment | grep -o 'ASML'
curl -s http://localhost:3104/industries/specialty-applications | grep -o 'nVent Data Solutions'
curl -s -o /dev/null -w '%{http_code}' http://localhost:3104/industries/not-a-real-slug
kill %1
```

Expected: both greps find a match; the last curl prints `404`.

- [ ] **Step 4: Commit**

```bash
git add app/industries/\[slug\]/page.tsx
git commit -m "$(cat <<'EOF'
Add industry detail pages

Dynamic /industries/[slug] route, statically generated for all 6
verticals. Each page shows the industry's copy and materials on a
solid background, then its featured case study as a glass teaser
card linking to the full /work/[slug] page.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 4: Work (case studies) hub page

**Files:**
- Create: `components/work/case-study-card.tsx`, `app/work/page.tsx`

**Interfaces:**
- Consumes: `caseStudies` (Task 1), `GlassPanel`, `PageContainer`
- Produces: `<CaseStudyCard caseStudy={...} />` — reused nowhere else in this plan, but kept as its own component (not inlined) since Task 1's data now has 6 entries and this pattern may grow

- [ ] **Step 1: Create the CaseStudyCard component**

```tsx
// components/work/case-study-card.tsx
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { CaseStudySummary } from "@/lib/content/case-studies";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudySummary }) {
  return (
    <Link
      href={`/work/${caseStudy.slug}`}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
    >
      <GlassPanel className="h-full p-6">
        <p className="text-sm text-accent-400">{caseStudy.sector}</p>
        <h3 className="mt-1 text-lg font-semibold text-steel-100">{caseStudy.client}</h3>
        <p className="mt-2 text-sm text-steel-200">{caseStudy.summary}</p>
      </GlassPanel>
    </Link>
  );
}
```

- [ ] **Step 2: Create the Work hub page**

```tsx
// app/work/page.tsx
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { CaseStudyCard } from "@/components/work/case-study-card";
import { caseStudies } from "@/lib/content/case-studies";

export const metadata: Metadata = {
  title: "Work — Case Studies | BELL Machine Works",
  description:
    "Real parts, real clients: ASML, Stoke Space, Corning, UCSF, Amazon Robotics, and nVent Data Solutions. Precision CNC machining case studies from BELL Machine Works, Gilroy, CA.",
};

export default function WorkPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Work</h1>
        <p className="mt-4 max-w-2xl text-steel-200">
          Named clients, real specs, real materials — one flagship case study per
          industry BELL serves.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {caseStudies.map((caseStudy) => (
          <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0, route summary includes `/work`.

- [ ] **Step 4: Verify the rendered output**

```bash
./node_modules/.bin/next start -p 3104 &
sleep 2
curl -s http://localhost:3104/work | grep -o 'Amazon Robotics'
curl -s http://localhost:3104/work | grep -o 'nVent Data Solutions'
kill %1
```

Expected: both greps find a match.

- [ ] **Step 5: Commit**

```bash
git add components/work/case-study-card.tsx app/work/page.tsx
git commit -m "$(cat <<'EOF'
Add Work (case studies) hub page

Grid of all 6 flagship case studies as glass cards linking to their
own /work/[slug] detail pages.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 5: Case study detail page (dynamic route)

**Files:**
- Create: `app/work/[slug]/page.tsx`

**Interfaces:**
- Consumes: `caseStudies` (Task 1, including `industrySlug`/`narrative`/`specHighlights`), `industries` (Task 2, to link back to the parent industry), `PageContainer`, `GlassPanel`
- Produces: nothing later tasks in this plan depend on

- [ ] **Step 1: Create the dynamic case-study detail page**

```tsx
// app/work/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel } from "@/components/ui/glass-panel";
import { caseStudies } from "@/lib/content/case-studies";
import { industries } from "@/lib/content/industries";

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.client} — Case Study | BELL Machine Works`,
    description: caseStudy.summary,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);
  if (!caseStudy) notFound();

  const industry = industries.find((i) => i.slug === caseStudy.industrySlug);

  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <p className="text-sm text-accent-400">{caseStudy.sector}</p>
        <h1 className="mt-1 text-3xl font-semibold text-steel-100 md:text-4xl">
          {caseStudy.client}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-steel-200">{caseStudy.summary}</p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <p className="max-w-3xl text-steel-200">{caseStudy.narrative}</p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          {caseStudy.specHighlights.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-steel-200">{item.label}</dt>
              <dd className="mt-1 text-lg text-steel-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {industry && (
        <p className="text-sm text-steel-200">
          Part of BELL&apos;s{" "}
          <Link
            href={`/industries/${industry.slug}`}
            className="text-steel-100 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            {industry.name}
          </Link>{" "}
          work.
        </p>
      )}

      <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <h2 className="text-xl font-semibold text-steel-100">Have a print or model ready?</h2>
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

Note `text-steel-200` (not `text-steel-400`) on the `<dt>` labels here — Phase 2's final review found `text-steel-400` fails WCAG AA at 3.84:1 on `bg-graphite-900`; this task uses the already-corrected token from the start rather than repeating that regression.

- [ ] **Step 2: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0, route summary includes `/work/[slug]` as a static (SSG) route with 6 generated paths.

- [ ] **Step 3: Verify the rendered output**

```bash
./node_modules/.bin/next start -p 3104 &
sleep 2
curl -s http://localhost:3104/work/asml | grep -o 'EUV chamber'
curl -s http://localhost:3104/work/nvent | grep -o 'GB200'
curl -s http://localhost:3104/work/asml | grep -o 'Semiconductor Equipment'
curl -s -o /dev/null -w '%{http_code}' http://localhost:3104/work/not-a-real-slug
kill %1
```

Expected: first three greps each find a match; the last curl prints `404`.

- [ ] **Step 4: Commit**

```bash
git add app/work/\[slug\]/page.tsx
git commit -m "$(cat <<'EOF'
Add case study detail pages

Dynamic /work/[slug] route, statically generated for all 6 flagship
case studies. Narrative and spec highlights on a solid background;
glass used only for the closing CTA, per the glass-exclusion rule.
Links back to the parent industry page.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

### Task 6: Photography integration

**Files:**
- Modify: `components/home/hero-section.tsx`, `app/capabilities/page.tsx`, `app/industries/page.tsx`, `app/work/page.tsx`

**Interfaces:**
- Consumes: `public/images/stock/MANIFEST.md` (sourced separately into this repo before this task starts — a curated list of free-commercial-use CNC/precision-machining stock photos, one line per file, each tagged with a suggested use: hero background / industry card / case-study card / detail accent) and the image files it lists in `public/images/stock/`

This is the task that directly answers "the site looks bland, get some images in it." Every other Phase 3 task ships pages with zero photography — this one adds it, everywhere it's cheap and honest to add it.

- [ ] **Step 1: Read the manifest**

```bash
cat public/images/stock/MANIFEST.md
```

Pick: one image tagged **hero background** (wide/landscape, dark/moody preferred) for Step 2; one image tagged **detail accent** or **industry card** for each of Steps 3-4 (a different image for Capabilities than for Industries/Work, so the three pages don't look identical). If the manifest has fewer images than sections listed below, reuse an image rather than skip a section — visual repetition is fine, an unstyled/photo-less section is the thing being fixed.

- [ ] **Step 2: Add a background photo to the home hero**

Read `components/home/hero-section.tsx` first to see its current structure (a `GlassPanel` with headline/subhead/CTA, from Phase 2 Task 4). Wrap it in a relatively-positioned container with the chosen hero-background image absolutely positioned behind it, `next/image` with `fill`, a dark scrim for text-contrast safety, and the existing glass hero panel on top unchanged. Use this shape (adjust the `src` to the actual filename you picked from the manifest, and keep every existing prop/className on `GlassPanel` and its children exactly as Task 4 left them — only the wrapping structure changes):

```tsx
import Image from "next/image";

// ...inside the component, wrapping the existing <GlassPanel> hero content:
<div className="relative overflow-hidden rounded-2xl">
  <Image
    src="/images/stock/<chosen-filename>.jpg"
    alt="CNC machining in progress"
    fill
    priority
    sizes="100vw"
    className="object-cover"
  />
  <div className="absolute inset-0 bg-graphite-900/70" aria-hidden />
  {/* existing GlassPanel hero content goes here, unchanged */}
</div>
```

The `alt` text stays generic ("CNC machining in progress") — never name a specific client or part, since this is stock photography, not a photo of actual BELL work (Global Constraints). The `bg-graphite-900/70` scrim keeps the existing hero text's contrast ratio safe against a photo of unknown brightness — verify in Step 6 rather than assuming.

- [ ] **Step 3: Add a photo accent to the Capabilities page**

Add one `next/image` between the Processes and Materials sections in `app/capabilities/page.tsx` (both currently `<section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">` per Phase 2 Task 7) — a full-width banner image, not inside either solid data section (so it doesn't read as if it's part of the spec table):

```tsx
<div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
  <Image
    src="/images/stock/<chosen-filename>.jpg"
    alt="Precision CNC machining detail"
    fill
    sizes="100vw"
    className="object-cover"
  />
</div>
```

Add `import Image from "next/image";` to the file's existing import block.

- [ ] **Step 4: Add a photo banner to the Industries and Work hub pages**

In both `app/industries/page.tsx` and `app/work/page.tsx`, add the same banner pattern as Step 3 (a different manifest image is fine, or the same one — use your judgment from what's available) directly below each page's intro `<div>` (headline + one-line description) and above the card grid. Add the `next/image` import to both files.

- [ ] **Step 5: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0. Watch for a Next.js image-domain error — there should be none, since every image referenced is a local file under `public/`, which `next/image` serves without any `next.config.ts` changes.

- [ ] **Step 6: Verify the rendered output and contrast**

```bash
./node_modules/.bin/next start -p 3104 &
sleep 2
curl -s http://localhost:3104 | grep -o 'stock/'
curl -s http://localhost:3104/capabilities | grep -o 'stock/'
curl -s http://localhost:3104/industries | grep -o 'stock/'
curl -s http://localhost:3104/work | grep -o 'stock/'
kill %1
```

Expected: all four greps find at least one match (confirms each page now references a stock image).

Then open `http://localhost:3104` in a browser (manual check, can't be curl-verified) and confirm the hero headline and subhead text are still clearly readable over the photo — if not, deepen the scrim from `/70` to `/80` in Step 2 and re-check.

- [ ] **Step 7: Commit**

```bash
git add components/home/hero-section.tsx app/capabilities/page.tsx app/industries/page.tsx app/work/page.tsx public/images/stock/
git commit -m "$(cat <<'EOF'
Add photography to home hero, Capabilities, Industries, and Work pages

First photography pass across the site: a background photo behind
the home hero (with a scrim for text contrast), and banner accents on
Capabilities, Industries, and Work. Images are generic, free-license
stock (public/images/stock/, see MANIFEST.md) standing in until real
shop photography is supplied — never captioned as depicting a named
client's actual part, per the Global Constraints.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01HVcNcjykngEZuiQGvzQ6Wf
EOF
)"
```

---

## Phase 4 — Motion & Visual System (detailed below, build now)

Ports the interaction system from the reference site (aiautomationsociety.ai — real CSS/JS pulled from the live site, not the earlier text-fetch summary) onto BELL's existing dark "liquid glass" design from Phases 1-3: a Lenis-driven smooth-scroll engine with a `prefers-reduced-motion` fallback, a reveal-on-enter primitive applied across every existing page, eye-level text dimming retrofit on the home cert-roadmap proof points, sticky stacked cards retrofit on the Work hub's case studies, a pill-tab crossfade "stage" switcher as a new Industries hub spotlight, and a scroll-progress bar plus nav scroll-shadow. User-confirmed priority effects (all four in scope): smooth inertia scroll, eye-level dimming, sticky stacked cards, reveal-on-scroll + tab/slide switcher.

**Reference site's real mechanism corrects the Design-Direction.md framing:** the reference is mostly opaque near-black cards with hairline borders, not heavy glassmorphism — its premium feel comes from scroll choreography (Lenis inertia, reveal timing, proximity-based dimming/scaling), not blur. This phase brings those *mechanics* over; it does not add more glass to BELL's existing surfaces.

### Task 1: Scroll engine — Lenis, `useScrollFrame`, `prefers-reduced-motion`, verification harness

**Files:**
- Create: `lib/motion/scroll-engine.tsx`
- Create: `scripts/scroll-check.mjs`
- Modify: `app/layout.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `ScrollEngineProvider` (client component), `useScrollFrame(callback: (scrollY: number) => void): void`, `usePrefersReducedMotion(): boolean` — all exported from `@/lib/motion/scroll-engine`. Every later task in this phase imports one or more of these.
- `useScrollFrame`'s callback fires once per Lenis scroll event with the current `scrollY`. It **never fires** when `prefers-reduced-motion: reduce` matches (the provider skips booting Lenis entirely in that case) — every consumer must therefore render a static, fully-visible default state that doesn't depend on the callback ever running.

- [ ] **Step 1: Install the scroll library and headless-Chrome verification tooling**

```bash
npm install lenis
npm install --save-dev puppeteer-core
```

`puppeteer-core` ships with no bundled Chromium download — it drives the Google Chrome.app already installed on this machine, which is what `scripts/scroll-check.mjs` (Step 4) uses.

- [ ] **Step 2: Write the scroll engine**

Create `lib/motion/scroll-engine.tsx`:

```tsx
// lib/motion/scroll-engine.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

type FrameCallback = (scrollY: number) => void;

interface ScrollEngineValue {
  registerFrameCallback: (id: string, callback: FrameCallback) => () => void;
}

const ScrollEngineContext = createContext<ScrollEngineValue | null>(null);

/** True when the user has requested reduced motion. Every motion primitive
 *  in this phase must check this and render its final, static state
 *  instead of animating when it's true. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Registers `callback` to run once per Lenis scroll event with the
 *  current scrollY. No-ops under prefers-reduced-motion — the provider
 *  never boots Lenis in that case, so the callback simply never fires. */
export function useScrollFrame(callback: FrameCallback) {
  const engine = useContext(ScrollEngineContext);
  const id = useId();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!engine) return;
    return engine.registerFrameCallback(id, (y) => callbackRef.current(y));
  }, [engine, id]);
}

export function ScrollEngineProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const callbacksRef = useRef(new Map<string, FrameCallback>());

  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    let rafId = 0;
    let lenisInstance: { raf: (t: number) => void; destroy: () => void } | null = null;

    function broadcast(scrollY: number) {
      for (const callback of callbacksRef.current.values()) callback(scrollY);
    }

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
      lenisInstance = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      lenis.on("scroll", ({ scroll }: { scroll: number }) => broadcast(scroll));
      broadcast(window.scrollY);

      (window as typeof window & { __scrollEngine?: unknown }).__scrollEngine = { lenis };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, [reducedMotion]);

  const registerFrameCallback = (id: string, callback: FrameCallback) => {
    callbacksRef.current.set(id, callback);
    return () => {
      callbacksRef.current.delete(id);
    };
  };

  return (
    <ScrollEngineContext.Provider value={{ registerFrameCallback }}>
      {children}
    </ScrollEngineContext.Provider>
  );
}
```

- [ ] **Step 3: Mount the provider in the root layout**

In `app/layout.tsx`, add the import and wrap the body's existing children:

```tsx
import { ScrollEngineProvider } from "@/lib/motion/scroll-engine";
```

Replace:

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

with:

```tsx
      <body className="flex min-h-screen flex-col bg-graphite-950 antialiased">
        <ScrollEngineProvider>
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
        </ScrollEngineProvider>
      </body>
```

- [ ] **Step 4: Write the scroll-verification script**

Static single-frame headless-Chrome screenshots (used in Phase 3) can't verify scroll-position-dependent effects. Create `scripts/scroll-check.mjs`:

```js
#!/usr/bin/env node
// scripts/scroll-check.mjs
// Drives the system Chrome via puppeteer-core (no bundled Chromium) to
// screenshot a page at given scroll positions and report console/page
// errors and whether the scroll engine booted. Usage:
//   node scripts/scroll-check.mjs <url> <outDir> [scrollY...]
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const [, , url, outDir, ...scrollArgs] = process.argv;
if (!url || !outDir) {
  console.error("Usage: node scripts/scroll-check.mjs <url> <outDir> [scrollY...]");
  process.exit(1);
}

const executablePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();

const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });

const hasScrollEngine = await page.evaluate(() => typeof window.__scrollEngine !== "undefined");
console.log("scrollEngine present:", hasScrollEngine);

const positions = scrollArgs.length ? scrollArgs.map(Number) : [0];
for (const y of positions) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await new Promise((resolve) => setTimeout(resolve, 400));
  await page.screenshot({ path: `${outDir}/scroll-${y}.png` });
}

console.log(`Captured ${positions.length} screenshot(s) in ${outDir}`);
await browser.close();

if (errors.length) {
  console.error("Console/page errors:", errors);
  process.exit(1);
}
```

`page.evaluate`'s callback runs inside the browser, not in this Node script, so it's plain JS with a runtime `typeof` check — no TypeScript cast needed or usable there.

- [ ] **Step 5: Add a convenience npm script**

In `package.json`, add to `"scripts"`:

```json
    "scroll-check": "node scripts/scroll-check.mjs"
```

- [ ] **Step 6: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 7: Verify the scroll engine boots**

```bash
./node_modules/.bin/next start -p 3110 &
sleep 2
node scripts/scroll-check.mjs http://localhost:3110 /tmp/scroll-check-task1 0 800
kill %1
```

Expected: `scrollEngine present: true` printed, two screenshots written to `/tmp/scroll-check-task1`, exit code 0 (no console/page errors).

- [ ] **Step 8: Commit**

```bash
git add lib/motion/scroll-engine.tsx scripts/scroll-check.mjs app/layout.tsx package.json package-lock.json
git commit -m "$(cat <<'EOF'
Add Lenis scroll engine and scroll-verification harness

Foundation for the motion system: a ScrollEngineProvider mounted in
the root layout drives Lenis smooth-scroll and broadcasts scrollY to
any component via useScrollFrame, fully skipped under
prefers-reduced-motion so consumers fall back to their static state.
scripts/scroll-check.mjs drives the system Chrome via puppeteer-core
to screenshot scroll-position-dependent effects, which static
headless-Chrome screenshots can't verify.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 2: `<Reveal>` fade-up-on-enter primitive, applied across every existing page

**Files:**
- Create: `components/motion/reveal.tsx`
- Modify: `components/home/cert-roadmap-section.tsx`
- Modify: `components/home/client-teaser-section.tsx`
- Modify: `app/capabilities/page.tsx`
- Modify: `app/industries/page.tsx`
- Modify: `app/work/page.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` from `@/lib/motion/scroll-engine` (Task 1).
- Produces: `Reveal` component (default export from `@/components/motion/reveal`), props `{ children: ReactNode; className?: string; delay?: number }`. Wraps a single block-level child in a `div`; callers keep their own semantic wrapper (`section`, etc.) as the child.
- The home hero (`HeroSection`) is intentionally **not** wrapped — it's above the fold and already visible on load, matching the reference site's own choice not to `.reveal` its hero. The Work hub's case-study grid is intentionally **not** wrapped here — Task 4 replaces it with `<StickyStack>`, which has its own entrance behavior.

- [ ] **Step 1: Write the Reveal primitive**

Create `components/motion/reveal.tsx`:

```tsx
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
  const [isIn, setIsIn] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

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
      className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isIn ? "translate-y-0 opacity-100" : "translate-y-[18px] opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Wrap the home page's two below-fold sections**

In `components/home/cert-roadmap-section.tsx`, add the import and wrap the returned `<section>`:

```tsx
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { certRoadmapContent } from "@/lib/content/home";

export function CertRoadmapSection() {
  return (
    <Reveal>
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
    </Reveal>
  );
}
```

(Task 3 rewrites this component's body again — the `<ul>` of proof points becomes eye-level-dimmed paragraphs. This step's job is only to establish the `<Reveal>` wrapper.)

In `components/home/client-teaser-section.tsx`, add the import and wrap the returned `<section>`:

```tsx
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { CaseStudyCard } from "@/components/work/case-study-card";
import { caseStudies } from "@/lib/content/case-studies";

export function ClientTeaserSection() {
  return (
    <Reveal>
      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
            Trusted by engineering teams at
          </h2>
          <Link
            href="/work"
            className="shrink-0 text-sm font-medium text-accent-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            See all work →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.slug} caseStudy={study} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}
```

- [ ] **Step 3: Wrap the Capabilities page's five sections**

In `app/capabilities/page.tsx`, add `import { Reveal } from "@/components/motion/reveal";` and wrap each of the five direct children of `<PageContainer>` (the intro `<div>`, the "Machining capability" `<section>`, the "Processes" `<section>`, the image banner `<div>`, the "Materials" `<section>`, and the closing `<GlassPanel>`) each in its own `<Reveal>` with a `delay` that steps up by 80ms per section so they cascade in rather than all firing on the same frame:

```tsx
export default function CapabilitiesPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">
            Capabilities
          </h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Precision CNC machining built around real tolerance and finish
            requirements — not generic shop capability claims.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
            Machining capability
          </h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {capabilityHighlights.map((item) => (
              <div key={item.label}>
                <dt className="text-sm text-steel-200">{item.label}</dt>
                <dd className="mt-1 text-lg text-steel-100">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      <Reveal delay={160}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
            Processes
          </h2>
          <table className="mt-6 w-full text-left text-sm text-steel-200">
            <thead>
              <tr className="border-b border-white/10 text-steel-200">
                <th className="py-2 pr-4 font-medium" scope="col">Process</th>
                <th className="py-2 font-medium" scope="col">Status</th>
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
          <p className="mt-4 text-sm text-steel-200">
            Additional in-house processes and a full equipment list are being
            confirmed and will be added here — ask about a specific process on
            your RFQ.
          </p>
        </section>
      </Reveal>

      <Reveal delay={240}>
        <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
          <Image
            src="/images/stock/cnc-milling-gear-part-macro.jpg"
            alt=""
            fill
            sizes="(min-width: 1152px) 1120px, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      <Reveal delay={320}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
            Materials
          </h2>
          <table className="mt-6 w-full text-left text-sm text-steel-200">
            <thead>
              <tr className="border-b border-white/10 text-steel-200">
                <th className="py-2 pr-4 font-medium" scope="col">Family</th>
                <th className="py-2 font-medium" scope="col">Examples</th>
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
      </Reveal>

      <Reveal delay={400}>
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
      </Reveal>
    </PageContainer>
  );
}
```

This is a one-time fade+rise settling at each section's normal fully-opaque, fully-static appearance — it does not put a continuous scroll-linked effect on the Processes/Materials tables, so it doesn't conflict with the Global Constraints' spec-table exclusion rule.

- [ ] **Step 4: Wrap the Industries page's intro, banner, and grid**

In `app/industries/page.tsx`, add `import { Reveal } from "@/components/motion/reveal";` and wrap the intro `<div>`, the banner `<div>`, and the grid `<div>`:

```tsx
export default function IndustriesPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Industries</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Six verticals where BELL has real, shipped work — not a generic capability
            claim for each.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
          <Image
            src="/images/stock/cnc-lathe-turning-shaft-detail.jpg"
            alt=""
            fill
            sizes="(min-width: 1152px) 1120px, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
      <Reveal delay={160}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Reveal>
    </PageContainer>
  );
}
```

(Task 5 adds a new `<TabStage>` spotlight section between the banner and the grid — this step's ordering already anticipates that gap.)

- [ ] **Step 5: Wrap the Work page's intro and banner**

In `app/work/page.tsx`, add `import { Reveal } from "@/components/motion/reveal";` and wrap only the intro `<div>` and the banner `<div>` (the case-study grid below them is replaced entirely in Task 4):

```tsx
export default function WorkPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Work</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Named clients, real specs, real materials — one flagship case study per
            industry BELL serves.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
          <Image
            src="/images/stock/precision-metal-parts-tray.jpg"
            alt=""
            fill
            sizes="(min-width: 1152px) 1120px, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        {caseStudies.map((caseStudy) => (
          <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))}
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 6: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 7: Verify reveal-in behavior across pages**

```bash
./node_modules/.bin/next start -p 3110 &
sleep 2
node scripts/scroll-check.mjs http://localhost:3110/ /tmp/scroll-check-task2/home 0 900
node scripts/scroll-check.mjs http://localhost:3110/capabilities /tmp/scroll-check-task2/capabilities 0 900 1800
node scripts/scroll-check.mjs http://localhost:3110/industries /tmp/scroll-check-task2/industries 0 900
node scripts/scroll-check.mjs http://localhost:3110/work /tmp/scroll-check-task2/work 0 900
kill %1
```

Expected: all four exit 0 with no console/page errors. Open the `scroll-800`/`scroll-900` screenshots and confirm the below-fold sections are visible and opaque (not stuck at `opacity-0`) — that would indicate the IntersectionObserver never fired.

- [ ] **Step 8: Commit**

```bash
git add components/motion/reveal.tsx components/home/cert-roadmap-section.tsx components/home/client-teaser-section.tsx app/capabilities/page.tsx app/industries/page.tsx app/work/page.tsx
git commit -m "$(cat <<'EOF'
Add Reveal fade-up-on-enter primitive across every existing page

Applies aiautomationsociety.ai's .reveal/.is-in entrance pattern to
every below-fold section on the home, Capabilities, Industries, and
Work pages via a shared IntersectionObserver-driven Reveal component.
One-time fade+rise settling at each section's normal static
appearance — spec tables keep their content fully static and legible
throughout, per the Global Constraints.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 3: Eye-level text dimming, retrofit on the home cert-roadmap proof points

**Files:**
- Create: `lib/motion/use-eye-level-opacity.ts`
- Create: `components/motion/eye-level-paragraph.tsx`
- Modify: `components/home/cert-roadmap-section.tsx`

**Interfaces:**
- Consumes: `useScrollFrame` from `@/lib/motion/scroll-engine` (Task 1).
- Produces: `useEyeLevelOpacity<T extends HTMLElement>(): { ref: RefObject<T | null>; opacity: number }` from `@/lib/motion/use-eye-level-opacity`; `EyeLevelParagraph` component from `@/components/motion/eye-level-paragraph`.
- Retrofit target: `certRoadmapContent.proofPoints` (`lib/content/home.ts`) — the four already-approved factual lines ("Full material traceability with mill test reports (MTRs) on every job", etc.). No new copy is introduced; only the presentation changes from a static two-column list to a stacked, scroll-dimmed sequence.

- [ ] **Step 1: Write the eye-level opacity hook**

Create `lib/motion/use-eye-level-opacity.ts`:

```ts
// lib/motion/use-eye-level-opacity.ts
"use client";

import { useRef, useState } from "react";
import { useScrollFrame } from "@/lib/motion/scroll-engine";

/** Attach the returned ref to a text block. Its opacity reads 1 when the
 *  block's vertical center sits at the viewport's vertical center, dimming
 *  to a floor of 0.22 as it moves away — mirrors aiautomationsociety.ai's
 *  `[data-intro]` paragraph treatment. Desktop-only (viewport >= 768px);
 *  holds at full opacity on narrow viewports and whenever the scroll
 *  engine's callback never fires (prefers-reduced-motion). */
export function useEyeLevelOpacity<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [opacity, setOpacity] = useState(1);

  useScrollFrame(() => {
    const node = ref.current;
    if (!node || window.innerWidth < 768) {
      setOpacity(1);
      return;
    }
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.bottom < -200 || rect.top > vh + 200) return;

    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - vh * 0.5) / (vh * 0.42);
    const next = Math.max(0.22, 1 - Math.max(0, distance - 0.1) * 1.3);
    setOpacity((prev) => (Math.abs(prev - next) > 0.01 ? next : prev));
  });

  return { ref, opacity };
}
```

- [ ] **Step 2: Write the EyeLevelParagraph wrapper**

Create `components/motion/eye-level-paragraph.tsx`:

```tsx
// components/motion/eye-level-paragraph.tsx
"use client";

import type { ReactNode } from "react";
import { useEyeLevelOpacity } from "@/lib/motion/use-eye-level-opacity";

export function EyeLevelParagraph({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, opacity } = useEyeLevelOpacity<HTMLParagraphElement>();
  return (
    <p
      ref={ref}
      style={{ opacity }}
      className={`transition-opacity duration-300 ${className}`}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 3: Retrofit CertRoadmapSection's proof points**

Replace the full contents of `components/home/cert-roadmap-section.tsx`:

```tsx
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { EyeLevelParagraph } from "@/components/motion/eye-level-paragraph";
import { certRoadmapContent } from "@/lib/content/home";

export function CertRoadmapSection() {
  return (
    <Reveal>
      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          {certRoadmapContent.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-steel-200">{certRoadmapContent.status}</p>
        <div className="mt-10 flex flex-col gap-6">
          {certRoadmapContent.proofPoints.map((point) => (
            <EyeLevelParagraph
              key={point}
              className="max-w-2xl text-xl font-medium text-steel-100 md:text-2xl"
            >
              {point}
            </EyeLevelParagraph>
          ))}
        </div>
        <Link
          href={certRoadmapContent.ctaHref}
          className="mt-8 inline-block text-sm font-medium text-accent-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
        >
          {certRoadmapContent.ctaLabel} →
        </Link>
      </section>
    </Reveal>
  );
}
```

- [ ] **Step 4: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 5: Verify the dimming behaves as scroll position changes**

```bash
./node_modules/.bin/next start -p 3110 &
sleep 2
node scripts/scroll-check.mjs http://localhost:3110/ /tmp/scroll-check-task3 400 700 1000
kill %1
```

Expected: exits 0. Compare the three screenshots — the proof-point paragraph nearest the viewport's vertical center in each should read visibly brighter than the others; none should ever be fully invisible (floor is 0.22, not 0).

- [ ] **Step 6: Commit**

```bash
git add lib/motion/use-eye-level-opacity.ts components/motion/eye-level-paragraph.tsx components/home/cert-roadmap-section.tsx
git commit -m "$(cat <<'EOF'
Add eye-level text dimming, retrofit on home cert-roadmap proof points

Reuses the four already-approved proof-point lines verbatim; only the
presentation changes, from a static two-column list to a stacked
sequence whose opacity tracks distance from the viewport's vertical
center (aiautomationsociety.ai's [data-intro] treatment), floored at
0.22 so nothing fully disappears. Desktop-only; static full opacity
under prefers-reduced-motion or on narrow viewports.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 4: Sticky stacked cards, retrofit on the Work hub's case studies

**Files:**
- Create: `components/motion/sticky-stack.tsx`
- Modify: `app/work/page.tsx`

**Interfaces:**
- Consumes: `useScrollFrame` from `@/lib/motion/scroll-engine` (Task 1).
- Produces: `StickyStack<T>` generic component from `@/components/motion/sticky-stack`, props `{ items: T[]; getKey: (item: T) => string; renderItem: (item: T, index: number) => ReactNode; className?: string }`.
- Design decision: the reference's `.deck` pattern pairs an image with copy per card, but BELL's case studies have no per-item photography, and the Global Constraints forbid attaching stock photos to a specific named client's part. This retrofit is therefore a **text-only** deck — large-type, generous padding, using the case studies' existing `client`/`sector`/`summary`/`specHighlights` fields only, no new copy and no imagery.

- [ ] **Step 1: Write the StickyStack primitive**

Create `components/motion/sticky-stack.tsx`:

```tsx
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
```

- [ ] **Step 2: Retrofit the Work hub page**

Replace the full contents of `app/work/page.tsx`:

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Reveal } from "@/components/motion/reveal";
import { StickyStack } from "@/components/motion/sticky-stack";
import { caseStudies } from "@/lib/content/case-studies";

export const metadata: Metadata = {
  title: "Work — Case Studies | BELL Machine Works",
  description:
    "Real parts, real clients: ASML, Stoke Space, Corning, UCSF, Amazon Robotics, and nVent Data Solutions. Precision CNC machining case studies from BELL Machine Works, Gilroy, CA.",
};

export default function WorkPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Work</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Named clients, real specs, real materials — one flagship case study per
            industry BELL serves.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
          <Image
            src="/images/stock/precision-metal-parts-tray.jpg"
            alt=""
            fill
            sizes="(min-width: 1152px) 1120px, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
      <StickyStack
        items={caseStudies}
        getKey={(caseStudy) => caseStudy.slug}
        renderItem={(caseStudy) => (
          <Link
            href={`/work/${caseStudy.slug}`}
            className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            <GlassPanel hoverLift={false} className="flex min-h-[60vh] flex-col justify-center p-10 md:p-16">
              <p className="text-sm text-accent-400">{caseStudy.sector}</p>
              <h2 className="mt-2 text-3xl font-semibold text-steel-100 md:text-4xl">
                {caseStudy.client}
              </h2>
              <p className="mt-4 max-w-xl text-steel-200">{caseStudy.summary}</p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                {caseStudy.specHighlights.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-xs uppercase tracking-wide text-steel-400">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-steel-100">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </GlassPanel>
          </Link>
        )}
      />
    </PageContainer>
  );
}
```

`CaseStudyCard` stays exactly as-is and stays in use on the home page's `ClientTeaserSection` — only the Work hub page gets the taller, deck-style presentation.

- [ ] **Step 3: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 4: Verify the stack's climb-over behavior**

```bash
./node_modules/.bin/next start -p 3110 &
sleep 2
node scripts/scroll-check.mjs http://localhost:3110/work /tmp/scroll-check-task4 0 1200 2400 3600
kill %1
```

Expected: exits 0. Compare the screenshots — later cards should visibly sit on top of earlier ones as scroll increases, and the card being climbed over should read smaller/dimmer than the one currently in front.

- [ ] **Step 5: Commit**

```bash
git add components/motion/sticky-stack.tsx app/work/page.tsx
git commit -m "$(cat <<'EOF'
Add sticky stacked cards, retrofit on the Work hub's case studies

Text-only deck (no imagery) using each case study's existing
client/sector/summary/specHighlights fields — the reference site's
[data-deck] pattern pairs an image with copy, but BELL has no
per-case-study photography, and the Global Constraints forbid
attaching stock photos to a specific named client's part. Cards climb
over each other on scroll; the one beneath scales down and dims
proportionally to the overlap.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 5: Pill-tab crossfade "stage" switcher — new Industries hub spotlight

**Files:**
- Create: `components/motion/tab-stage.tsx`
- Modify: `app/industries/page.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` from `@/lib/motion/scroll-engine` (Task 1).
- Produces: `TabStage<T>` generic component from `@/components/motion/tab-stage`, props `{ items: T[]; getKey: (item: T) => string; getLabel: (item: T) => string; renderSlide: (item: T) => ReactNode; autoAdvanceMs?: number; className?: string }`.
- Design decision: the reference's tab/slide switcher is presentational (a product-feature showcase), not applied to scannable spec data. Converting the Capabilities page's Processes/Materials tables into one-at-a-time slides would reduce their scannability, which the Global Constraints' spec-table exclusion rule already forbids in spirit. This task instead adds a **new, additive** "Featured verticals" spotlight to the Industries hub, using each industry's existing `name`/`tagline` — the full industry grid stays exactly where it is, unchanged, immediately below, so nothing about the page's scannability or SEO regresses.

- [ ] **Step 1: Write the TabStage primitive**

Create `components/motion/tab-stage.tsx`:

```tsx
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
```

- [ ] **Step 2: Add the "Featured verticals" spotlight to the Industries hub**

In `app/industries/page.tsx`, add `import { TabStage } from "@/components/motion/tab-stage";` and insert a new `<Reveal>`-wrapped `<TabStage>` between the banner image and the grid:

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { IndustryCard } from "@/components/industries/industry-card";
import { Reveal } from "@/components/motion/reveal";
import { TabStage } from "@/components/motion/tab-stage";
import { industries } from "@/lib/content/industries";

export const metadata: Metadata = {
  title: "Industries — Precision CNC Machining by Vertical | BELL Machine Works",
  description:
    "Semiconductor equipment, aerospace, robotics, photonics, medical device, and specialty-applications machining — real tolerances, real materials, real clients. Gilroy, CA.",
};

export default function IndustriesPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Industries</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Six verticals where BELL has real, shipped work — not a generic capability
            claim for each.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
          <Image
            src="/images/stock/cnc-lathe-turning-shaft-detail.jpg"
            alt=""
            fill
            sizes="(min-width: 1152px) 1120px, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
      <Reveal delay={160}>
        <TabStage
          items={industries}
          getKey={(industry) => industry.slug}
          getLabel={(industry) => industry.name}
          renderSlide={(industry) => (
            <div>
              <p className="text-sm text-accent-400">{industry.name}</p>
              <p className="mt-3 max-w-xl text-xl text-steel-100 md:text-2xl">
                {industry.tagline}
              </p>
              <Link
                href={`/industries/${industry.slug}`}
                className="mt-6 inline-block text-sm font-medium text-accent-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
              >
                See the {industry.name} page →
              </Link>
            </div>
          )}
        />
      </Reveal>
      <Reveal delay={240}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Reveal>
    </PageContainer>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 4: Verify the tab-stage renders and crossfades**

```bash
./node_modules/.bin/next start -p 3110 &
sleep 2
node scripts/scroll-check.mjs http://localhost:3110/industries /tmp/scroll-check-task5 600
kill %1
```

Expected: exits 0. Open the screenshot and confirm the pill tab row and the first industry's tagline slide are both visible, with the full industry-card grid still present below, unchanged.

Manual check in a browser (can't be curl/screenshot-verified): confirm clicking a different tab crossfades to that industry's tagline, and that the active tab auto-advances after ~4.5s if left alone.

- [ ] **Step 5: Commit**

```bash
git add components/motion/tab-stage.tsx app/industries/page.tsx
git commit -m "$(cat <<'EOF'
Add pill-tab crossfade stage switcher as an Industries hub spotlight

New "Featured verticals" TabStage above the existing industry grid,
using each industry's existing name/tagline — no new copy. Auto-
advances every 4.5s, click-selectable, crossfades via opacity/scale/
translate. Deliberately not applied to the Capabilities page's
Processes/Materials tables, since turning scannable spec data into a
one-at-a-time slideshow would work against the Global Constraints'
spec-table exclusion rule. The full industry grid stays unchanged
immediately below, so scannability and SEO aren't affected.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 6: Nav scroll-shadow and scroll-progress bar

**Files:**
- Create: `components/layout/scroll-progress.tsx`
- Modify: `components/layout/nav.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `useScrollFrame` from `@/lib/motion/scroll-engine` (Task 1).
- Produces: `ScrollProgress` component from `@/components/layout/scroll-progress`, no props.

- [ ] **Step 1: Write the scroll-progress bar**

Create `components/layout/scroll-progress.tsx`:

```tsx
// components/layout/scroll-progress.tsx
"use client";

import { useRef } from "react";
import { useScrollFrame } from "@/lib/motion/scroll-engine";

/** Thin glowing line along the top edge tracking scroll progress through
 *  the page. Mirrors aiautomationsociety.ai's `.progress` bar. Holds at
 *  0 width whenever the scroll engine's callback never fires
 *  (prefers-reduced-motion) — an empty bar, not a broken one. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useScrollFrame((y) => {
    const bar = barRef.current;
    if (!bar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;
    bar.style.transform = `scaleX(${progress.toFixed(4)})`;
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-accent-500 via-accent-400 to-white"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the root layout**

In `app/layout.tsx`, add `import { ScrollProgress } from "@/components/layout/scroll-progress";` and render it as the first child inside `<ScrollEngineProvider>`, before `<BackgroundDepth />`:

```tsx
        <ScrollEngineProvider>
          <ScrollProgress />
          <BackgroundDepth />
```

- [ ] **Step 3: Add a scroll-shadow to the nav past a small threshold**

In `components/layout/nav.tsx`, add `useState`/`useScrollFrame` imports and a `scrolled` state, then apply a conditional `drop-shadow` to the `<header>` wrapper (not to `GlassPanel` itself, since `GlassPanel` hardcodes its own `boxShadow` after spreading any caller-provided `style`, so a caller-side override on that component wouldn't reliably win):

```tsx
// components/layout/nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Container } from "@/components/layout/container";
import { useScrollFrame } from "@/lib/motion/scroll-engine";
```

Replace:

```tsx
export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50">
```

with:

```tsx
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
```

- [ ] **Step 4: Verify the build**

```bash
./node_modules/.bin/next build
```

Expected: exits 0.

- [ ] **Step 5: Verify the progress bar and nav shadow respond to scroll**

```bash
./node_modules/.bin/next start -p 3110 &
sleep 2
node scripts/scroll-check.mjs http://localhost:3110/ /tmp/scroll-check-task6 0 100 2000
kill %1
```

Expected: exits 0. Compare the three screenshots — the top progress line should be near-empty at `scroll-0`, partially filled at `scroll-100`, and mostly/fully filled at `scroll-2000`; the nav should show a visible drop-shadow starting at `scroll-100` (past the 40px threshold) that isn't present at `scroll-0`.

- [ ] **Step 6: Commit**

```bash
git add components/layout/scroll-progress.tsx components/layout/nav.tsx app/layout.tsx
git commit -m "$(cat <<'EOF'
Add scroll-progress bar and nav scroll-shadow

Small closing polish pieces for the motion system: a thin glowing bar
tracking scroll progress along the top edge, and a drop-shadow on the
nav's outer wrapper past a 40px scroll threshold — applied to the
header, not GlassPanel itself, since GlassPanel hardcodes its own
boxShadow after spreading caller style and won't take an override.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

---

## Phase 5 — RFQ form + file upload backend (detailed below, build now)

Structured RFQ form (name, email, company, material, quantity, timeline, cert requirement, notes, file input) per spec §4, submitted through a Next.js Server Action that validates every field and the attached file with `zod`. **Delivery is deferred** (see the ruling immediately below): the spec's original design has the action stream the file to Vercel Blob and send Bushra a Resend email with a link to it, but hosting is not yet decided, so this phase builds and validates the form completely without wiring either vendor — a follow-up task fills in delivery once storage is chosen. Accepted file types are STEP, IGES, Parasolid, STL, PDF, DWG, DXF, enforced both by the file picker's `accept` attribute and server-side by extension. A visible turnaround-SLA statement sits at the top of the form (spec §4, Pillar 6). The form surface itself stays solid/opaque — no `GlassPanel` — per the glass exclusion list; it's wrapped in one-time `<Reveal>` entrances only, never a continuous scroll-linked effect, per Phase 4's own exclusion rule. This phase also closes out the five capability pages left unassigned since Phase 3's close: `/capabilities/5-axis-milling` and the four `/capabilities/materials/*` pages already linked from the Capabilities hub table.

**Ruling (2026-09-04) — Vercel Blob/Resend delivery deferred:** the spec's §1 storage/email choice (Vercel Blob, Resend) was made when this site's hosting was assumed to be Vercel. Hosting is no longer decided as of this phase's kickoff — the user confirmed deployment platform is an open question to be settled later — so provisioning a Vercel Blob store now would wire storage to a hosting platform that may not be the final choice. Per the user's explicit decision, this phase builds the RFQ form, its validation, and its page completely (real, working UI and server-side validation), but defers the actual delivery mechanism (streaming the file somewhere durable + emailing Bushra) until hosting/storage is chosen. Task 1 installs only `zod` (vendor-agnostic) and raises the Server Action body-size limit (a Next.js-level setting, not tied to any vendor). Task 3 (Resend email) is marked deferred, not built this pass. Task 4's server action performs full real validation and returns an honest "submission isn't live yet" state rather than a fabricated success — no vendor SDK is imported. Cost if this ruling is wrong: low — Tasks 3 and 4's delivery step are additive; when hosting/storage is decided, a follow-up task fills in `sendQuoteNotification` and the actual upload call without touching the validation/UI layer built here.

**Form field types are new to this codebase** — no prior page has form inputs. `FIELD_STYLE` / `LABEL_STYLE` / `ERROR_STYLE` constants introduced in Task 5 (`components/quote/quote-form.tsx`) are this phase's equivalent of the `LINK_STYLE` constant already established in `app/capabilities/page.tsx` — reuse them rather than inventing new ad hoc classes if a later phase adds another form.

### Task 1: Dependency install and Server Action body-size config

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`

**Interfaces:**
- Produces: installed `zod` package; `next.config.ts`'s Server Actions body-size limit raised from Next's 1MB default to accommodate CAD file uploads reaching the validation layer. Task 2 imports `zod`; Task 4's server action relies on the raised body limit to receive large files at all (even though it does not yet upload them anywhere — see the phase-level ruling above).

- [ ] **Step 1: Install zod**

```bash
npm install zod
```

- [ ] **Step 2: Raise the Server Actions body-size limit**

CAD files (STEP/IGES/Parasolid) can run tens of megabytes; Next's default 1MB Server Action body cap would reject them. In `next.config.ts`, replace:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // CAD drawing/model uploads (STEP/IGES/Parasolid) run well past
      // Next's 1MB Server Action default — spec §4's RFQ file upload.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
```

- [ ] **Step 3: Verify and commit**

```bash
./node_modules/.bin/next build
git add package.json package-lock.json next.config.ts
git commit -m "$(cat <<'EOF'
Install zod and raise Server Action body limit for RFQ uploads

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 2: Quote content + validation schema

**Files:**
- Create: `lib/content/quote.ts`
- Create: `lib/quote/validation.ts`

**Interfaces:**
- Produces (from `@/lib/content/quote`): `quoteContent` object with `slaStatement: string`, `materials: string[]`, `timelines: string[]`, `certRequirements: string[]`, `acceptedFileExtensions: string[]`, `acceptedFileLabel: string`, `maxFileSizeLabel: string`.
- Produces (from `@/lib/quote/validation`): `quoteFormSchema` (zod object), `QuoteFormValues` (`z.infer<typeof quoteFormSchema>`), `MAX_FILE_SIZE_BYTES: number`, `isAcceptedFileType(filename: string): boolean`.
- Consumed by Task 4's server action, Task 5's form component.

- [ ] **Step 1: Write the quote content**

Create `lib/content/quote.ts`. Materials/timelines/cert options are drawn from the material families and lead-time facts already established in `lib/content/industries.ts` and `lib/content/capabilities.ts` — no new claims invented:

```ts
export const quoteContent = {
  slaStatement:
    "Most quotes go out within hours — no minimum order, from single prototypes to 1,000+ unit runs.",
  materials: [
    "Titanium Grade 5",
    "Inconel 625",
    "Inconel 718",
    "Stainless Steel 303",
    "Aluminum 6061-T6",
    "Aluminum 7075",
    "Aluminum 2024",
    "Copper C110",
    "PEEK",
    "Delrin",
    "PTFE",
    "UHMW PE",
    "Polycarbonate",
    "Other (specify in notes)",
  ],
  timelines: ["Standard", "Rush / expedited", "Flexible — no rush"],
  certRequirements: [
    "None required",
    "Material certification (mill cert)",
    "CMM inspection report",
    "First Article Inspection (FAI)",
    "Other (specify in notes)",
  ],
  acceptedFileExtensions: [
    ".step",
    ".stp",
    ".iges",
    ".igs",
    ".x_t",
    ".x_b",
    ".stl",
    ".pdf",
    ".dwg",
    ".dxf",
  ],
  acceptedFileLabel: "STEP, IGES, Parasolid, STL, PDF, DWG, DXF",
  maxFileSizeLabel: "50MB",
};
```

- [ ] **Step 2: Write the validation schema**

Create `lib/quote/validation.ts`:

```ts
import { z } from "zod";

export const ACCEPTED_FILE_EXTENSIONS = [
  ".step",
  ".stp",
  ".iges",
  ".igs",
  ".x_t",
  ".x_b",
  ".stl",
  ".pdf",
  ".dwg",
  ".dxf",
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export function isAcceptedFileType(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ACCEPTED_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export const quoteFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  company: z.string().trim().optional(),
  material: z.string().trim().min(1, "Select a material."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  timeline: z.string().trim().min(1, "Select a timeline."),
  certRequirement: z.string().trim().min(1, "Select a certification requirement."),
  notes: z.string().trim().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
```

Note: keep `ACCEPTED_FILE_EXTENSIONS` in `lib/quote/validation.ts` (the server-side source of truth used by the action's file check) and `quoteContent.acceptedFileExtensions` in `lib/content/quote.ts` (used for the file input's `accept` attribute and the human-readable label) as two separately-maintained lists with identical values — `lib/content/*.ts` never imports from `lib/quote/*.ts` elsewhere in this codebase's conventions, so this mirrors that boundary rather than introducing a new cross-import. If the accepted-type list ever changes, update both.

- [ ] **Step 3: Verify and commit**

```bash
./node_modules/.bin/next build
git add lib/content/quote.ts lib/quote/validation.ts
git commit -m "$(cat <<'EOF'
Add RFQ form content and validation schema

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 3: Resend email notification — DEFERRED, not built this pass

**Status:** not dispatched. Per the phase-level ruling above, storage/hosting is undecided, so wiring a real Resend account/API key now would be premature. This task's shape is recorded here so a future phase can implement it without re-deriving the interface:

- Would create `lib/quote/email.ts`, consuming `QuoteFormValues` from `@/lib/quote/validation` (Task 2).
- Would produce `sendQuoteNotification(values: QuoteFormValues, fileUrl: string, fileName: string): Promise<void>`, using the `resend` package (`new Resend(process.env.RESEND_API_KEY)`, `resend.emails.send({...})`) to notify Bushra with submission details plus a link to wherever the file ends up stored.
- Follow-up work when hosting/storage is decided: install `resend`, provision a real API key + sending identity, write this module, then update Task 4's `submitQuoteRequest` (below) to call it after a real upload step and change the `"unavailable"` return branch to a real `"success"` branch.

### Task 4: Server Action — validate the RFQ submission (delivery deferred)

**Files:**
- Create: `app/quote/actions.ts`

**Interfaces:**
- Consumes: `quoteFormSchema`, `MAX_FILE_SIZE_BYTES`, `isAcceptedFileType` from `@/lib/quote/validation` (Task 2).
- Produces: `QuoteFormState` interface (`status: "idle" | "success" | "error" | "unavailable"`, `errors: Record<string, string[]>`, `message: string`) and `submitQuoteRequest(prevState: QuoteFormState, formData: FormData): Promise<QuoteFormState>`, both exported from `@/app/quote/actions`. Consumed by Task 5's `useActionState` call. `"success"` is defined but not reachable yet — it activates once Task 3's real delivery is wired in; today every validated submission resolves to `"unavailable"`, which Task 5 renders as an honest "not live yet" notice rather than a fabricated confirmation.

- [ ] **Step 1: Write the server action**

Create `app/quote/actions.ts`. No vendor SDK is imported — this task validates every field and the file for real, then stops short of actually delivering the submission anywhere, since no storage/email backend is provisioned yet:

```ts
"use server";

import { quoteFormSchema, MAX_FILE_SIZE_BYTES, isAcceptedFileType } from "@/lib/quote/validation";

export interface QuoteFormState {
  status: "idle" | "success" | "error" | "unavailable";
  errors: Record<string, string[]>;
  message: string;
}

export async function submitQuoteRequest(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const parsed = quoteFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    material: formData.get("material"),
    quantity: formData.get("quantity"),
    timeline: formData.get("timeline"),
    certRequirement: formData.get("certRequirement"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      message: "Please fix the highlighted fields and try again.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      errors: { file: ["A drawing or model file is required."] },
      message: "Please attach a drawing or model file.",
    };
  }

  if (!isAcceptedFileType(file.name)) {
    return {
      status: "error",
      errors: {
        file: ["Unsupported file type. Accepted: STEP, IGES, Parasolid, STL, PDF, DWG, DXF."],
      },
      message: "Please attach a supported file type.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      status: "error",
      errors: { file: ["File is too large. Max 50MB."] },
      message: "Please attach a smaller file.",
    };
  }

  // Delivery (file upload + Resend notification) is deferred until hosting
  // and a storage provider are decided — see Task 3 and the phase-level
  // ruling above. The submission is fully validated but not yet sent
  // anywhere; return an honest "not live yet" state instead of a fake
  // success.
  return {
    status: "unavailable",
    errors: {},
    message:
      "Your request looks good, but online submission isn't live yet — we're finishing this feature. Please check back soon.",
  };
}
```

- [ ] **Step 2: Verify and commit**

```bash
./node_modules/.bin/next build
git add app/quote/actions.ts
git commit -m "$(cat <<'EOF'
Add RFQ server action with full field/file validation (delivery deferred)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 5: Quote form component

**Files:**
- Create: `components/quote/quote-form.tsx`

**Interfaces:**
- Consumes: `submitQuoteRequest`, `QuoteFormState` from `@/app/quote/actions` (Task 4); `quoteContent` from `@/lib/content/quote` (Task 2).
- Produces: `QuoteForm` component, exported from `@/components/quote/quote-form`. Consumed by Task 6's page.

- [ ] **Step 1: Write the form component**

Create `components/quote/quote-form.tsx`. Solid surface (`bg-graphite-900` + hairline border, matching every other spec-table panel on the site) — no `GlassPanel`, per the glass exclusion list:

```tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitQuoteRequest, type QuoteFormState } from "@/app/quote/actions";
import { quoteContent } from "@/lib/content/quote";

const initialState: QuoteFormState = { status: "idle", errors: {}, message: "" };

const FIELD_STYLE =
  "mt-2 w-full rounded-lg border border-white/10 bg-graphite-800 px-4 py-3 text-steel-100 placeholder:text-steel-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2";
const LABEL_STYLE = "block text-sm font-medium text-steel-100";
const ERROR_STYLE = "mt-1 text-sm text-red-400";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
    >
      {pending ? "Submitting…" : "Submit Quote Request"}
    </button>
  );
}

export function QuoteForm() {
  const [state, formAction] = useActionState(submitQuoteRequest, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100">Request received.</h2>
        <p className="mt-2 text-steel-200">{state.message}</p>
      </div>
    );
  }

  if (state.status === "unavailable") {
    return (
      <div className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100">Almost there.</h2>
        <p className="mt-2 text-steel-200">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12"
    >
      <p className="text-sm text-accent-400">{quoteContent.slaStatement}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL_STYLE}>
            Name
          </label>
          <input id="name" name="name" type="text" required className={FIELD_STYLE} />
          {state.errors.name && <p className={ERROR_STYLE}>{state.errors.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="email" className={LABEL_STYLE}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={FIELD_STYLE} />
          {state.errors.email && <p className={ERROR_STYLE}>{state.errors.email[0]}</p>}
        </div>
        <div>
          <label htmlFor="company" className={LABEL_STYLE}>
            Company
          </label>
          <input id="company" name="company" type="text" className={FIELD_STYLE} />
        </div>
        <div>
          <label htmlFor="material" className={LABEL_STYLE}>
            Material
          </label>
          <select id="material" name="material" required defaultValue="" className={FIELD_STYLE}>
            <option value="" disabled>
              Select a material
            </option>
            {quoteContent.materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
          {state.errors.material && <p className={ERROR_STYLE}>{state.errors.material[0]}</p>}
        </div>
        <div>
          <label htmlFor="quantity" className={LABEL_STYLE}>
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            required
            className={FIELD_STYLE}
          />
          {state.errors.quantity && <p className={ERROR_STYLE}>{state.errors.quantity[0]}</p>}
        </div>
        <div>
          <label htmlFor="timeline" className={LABEL_STYLE}>
            Timeline
          </label>
          <select id="timeline" name="timeline" required defaultValue="" className={FIELD_STYLE}>
            <option value="" disabled>
              Select a timeline
            </option>
            {quoteContent.timelines.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
          {state.errors.timeline && <p className={ERROR_STYLE}>{state.errors.timeline[0]}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="certRequirement" className={LABEL_STYLE}>
            Certification requirement
          </label>
          <select
            id="certRequirement"
            name="certRequirement"
            required
            defaultValue=""
            className={FIELD_STYLE}
          >
            <option value="" disabled>
              Select a certification requirement
            </option>
            {quoteContent.certRequirements.map((cert) => (
              <option key={cert} value={cert}>
                {cert}
              </option>
            ))}
          </select>
          {state.errors.certRequirement && (
            <p className={ERROR_STYLE}>{state.errors.certRequirement[0]}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className={LABEL_STYLE}>
            Notes (optional)
          </label>
          <textarea id="notes" name="notes" rows={4} className={FIELD_STYLE} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="file" className={LABEL_STYLE}>
            Drawing or model file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            required
            accept={quoteContent.acceptedFileExtensions.join(",")}
            className={`${FIELD_STYLE} file:mr-4 file:rounded-full file:border-0 file:bg-accent-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white`}
          />
          <p className="mt-2 text-sm text-steel-200">
            Accepted: {quoteContent.acceptedFileLabel}. Max {quoteContent.maxFileSizeLabel}.
          </p>
          {state.errors.file && <p className={ERROR_STYLE}>{state.errors.file[0]}</p>}
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p className="mt-6 text-sm text-red-400" role="alert">
          {state.message}
        </p>
      )}

      <div className="mt-8">
        <SubmitButton />
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
./node_modules/.bin/next build
git add components/quote/quote-form.tsx
git commit -m "$(cat <<'EOF'
Add RFQ form component

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 6: Quote page

**Files:**
- Create: `app/quote/page.tsx`

**Interfaces:**
- Consumes: `QuoteForm` from `@/components/quote/quote-form` (Task 5); `PageContainer`, `Reveal` (existing).
- Closes the dead `/quote` link already present in `components/layout/nav.tsx:74` and `components/layout/footer.tsx:14` — no changes needed to either, both already point at this route.

- [ ] **Step 1: Write the page**

Create `app/quote/page.tsx`:

```tsx
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { QuoteForm } from "@/components/quote/quote-form";

export const metadata: Metadata = {
  title: "Get a Quote — RFQ | BELL Machine Works",
  description:
    "Upload your drawing or model and tell us your material, quantity, and timeline. Most quotes go out within hours. Gilroy, CA precision CNC machining.",
};

export default function QuotePage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Get a Quote</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Upload your drawing or model and tell us your material, quantity, and timeline — no
            minimum order, from single prototypes to 1,000+ unit runs.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <QuoteForm />
      </Reveal>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Manually verify the form's validated-but-deferred submit path**

Run the dev server, open `/quote`, and submit the form to confirm: client-side required-field validation blocks an empty submit; a submit with an invalid file type or an oversized file surfaces the matching server-side error from Task 4; a fully valid submit shows the pending state, then the "unavailable" honest-notice panel added in Task 5 (not a fake success). Delivery (file storage + email) is deferred per the phase-level ruling — there is no real side effect to confirm yet; this step only confirms validation and the deferred-state UX render correctly.

- [ ] **Step 3: Verify build and commit**

```bash
./node_modules/.bin/next build
git add app/quote/page.tsx
git commit -m "$(cat <<'EOF'
Add /quote RFQ page, closing the dead nav/footer link

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 7: Expand capability content for detail pages

**Files:**
- Modify: `lib/content/capabilities.ts`

**Interfaces:**
- Produces: `ProcessDetail` interface (`name`, `status`, `href`, `slug`, `summary`, `specs: { label: string; value: string }[]`, `applications: string[]`) replacing the plain object shape of `processes`; `MaterialFamily` interface extended with `slug`, `summary`, `applications: string[]` (keeping existing `name`, `examples`, `href`). `capabilityHighlights` is unchanged. Consumed by Task 8 and Task 9's pages, and still by the existing `app/capabilities/page.tsx` table (which only reads `name`/`status`/`href`/`examples` — untouched by the new fields).

- [ ] **Step 1: Expand `processes` and `materialFamilies`**

Replace the full contents of `lib/content/capabilities.ts`. Applications listed below are drawn directly from the materials-per-industry mapping already in `lib/content/industries.ts` and the lead-time/process facts in `Rebuild-Build-Plan.md` §2.4 — no new capability claims introduced:

```ts
export const capabilityHighlights = [
  { label: "Tolerance", value: '±0.0002" on critical features' },
  { label: "Micro-features", value: 'Down to < Ø0.01"' },
  { label: "Surface finish", value: "To 32 μin Ra on optical-grade contact surfaces" },
  { label: "Work envelope", value: '8" × 6" × 3" per setup' },
];

export interface ProcessDetail {
  name: string;
  status: string;
  href: string;
  slug: string;
  summary: string;
  specs: { label: string; value: string }[];
  applications: string[];
}

export const processes: ProcessDetail[] = [
  {
    name: "5-Axis CNC Milling",
    status: "In-house, confirmed",
    href: "/capabilities/5-axis-milling",
    slug: "5-axis-milling",
    summary:
      'Simultaneous 5-axis milling for complex geometries that would otherwise need multiple setups — held to ±0.0002" on critical features in a single work-holding.',
    specs: [
      { label: "Tolerance", value: '±0.0002" on critical features' },
      { label: "Micro-features", value: 'Down to < Ø0.01"' },
      { label: "Surface finish", value: "To 32 μin Ra on optical-grade contact surfaces" },
      { label: "Work envelope", value: '8" × 6" × 3" per setup' },
    ],
    applications: [
      "Semiconductor alignment brackets and vacuum-sealing components",
      "Aerospace collar/clamping assemblies and cryo-compatible propulsion tooling",
      "Optical-grade alignment fixtures for photonics equipment",
      "Sub-millimeter medical device and biomedical research tooling",
    ],
  },
];

export interface MaterialFamily {
  name: string;
  slug: string;
  examples: string;
  href: string;
  summary: string;
  applications: string[];
}

export const materialFamilies: MaterialFamily[] = [
  {
    name: "Titanium & Aerospace Alloys",
    slug: "titanium-aerospace-alloys",
    examples: "Titanium Grade 5, Inconel 625, Inconel 718",
    href: "/capabilities/materials/titanium-aerospace-alloys",
    summary:
      "Titanium Grade 5 and Inconel 625/718 machined to flight-hardware tolerances, including cryo-compatible tooling for reusable launch vehicle propulsion systems.",
    applications: [
      "Collar and clamping assemblies",
      "DO-160 environmental test fixtures",
      "Non-marring components",
      "Cryo-compatible propulsion tooling",
    ],
  },
  {
    name: "Stainless Steels",
    slug: "stainless-steels",
    examples: "Including 303, as used in production tooling and fixtures",
    href: "/capabilities/materials/stainless-steels",
    summary:
      "303 stainless steel machined for production tooling, fixtures, and medical device R&D components that need corrosion resistance without titanium's cost.",
    applications: [
      "Production tooling and fixtures",
      "Semiconductor equipment sealing components",
      "Medical device trim jigs and disassembly fixtures",
    ],
  },
  {
    name: "Non-Ferrous",
    slug: "non-ferrous",
    examples: "Aluminum 6061-T6, 7075, Copper C110, and other alloys by request",
    href: "/capabilities/materials/non-ferrous",
    summary:
      "6061-T6 and 7075 aluminum plus Copper C110 for lightweight structural parts, thermal management, and semiconductor equipment builds — the highest-volume material family across BELL's semiconductor and robotics work.",
    applications: [
      "Semiconductor alignment brackets and thermal management assemblies",
      "Robotics sensor-mounting and calibration fixtures",
      "AI data-center liquid-cooling clamps",
      "Aerospace airframe components (2024 alloy)",
    ],
  },
  {
    name: "Engineering Plastics",
    slug: "engineering-plastics",
    examples: "PEEK, Delrin, PTFE, UHMW PE, and other engineering plastics by request",
    href: "/capabilities/materials/engineering-plastics",
    summary:
      "PEEK, Delrin, PTFE, and UHMW PE for wear-resistant, non-marring, and optical-grade components — machined to the same tolerance standard as BELL's metals.",
    applications: [
      "Optical alignment fixtures (PTFE)",
      "Wear-resistant automation components (UHMW PE)",
      "Robotics sensor housings (polycarbonate)",
      "Non-marring production tooling",
    ],
  },
];
```

- [ ] **Step 2: Verify and commit**

```bash
./node_modules/.bin/next build
git add lib/content/capabilities.ts
git commit -m "$(cat <<'EOF'
Expand capability content with detail-page fields

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 8: 5-axis milling process page

**Files:**
- Create: `app/capabilities/5-axis-milling/page.tsx`

**Interfaces:**
- Consumes: `processes` from `@/lib/content/capabilities` (Task 7); `PageContainer`, `Reveal`, `GlassPanel` (existing).

- [ ] **Step 1: Write the page**

Create `app/capabilities/5-axis-milling/page.tsx`. Mirrors the closing CTA panel pattern already used on `/capabilities`, `/quality`, and `/industries/[slug]` — heading + button only, no repeated SLA sentence, per the site-wide rule established in the fourth design-polish round:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { processes } from "@/lib/content/capabilities";

const processDetail = processes.find((item) => item.slug === "5-axis-milling")!;

export const metadata: Metadata = {
  title: `${processDetail.name} | BELL Machine Works`,
  description: processDetail.summary,
};

export default function FiveAxisMillingPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <p className="text-sm text-accent-400">Capabilities / Process</p>
          <h1 className="mt-1 text-3xl font-semibold text-steel-100 md:text-4xl">
            {processDetail.name}
          </h1>
          <p className="mt-4 max-w-2xl text-steel-200">{processDetail.summary}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Specifications</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {processDetail.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-sm text-steel-200">{spec.label}</dt>
                <dd className="mt-1 text-lg text-steel-100">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      <Reveal delay={160}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Where this shows up</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {processDetail.applications.map((application) => (
              <li key={application} className="text-steel-200">
                {application}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={240}>
        <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-xl font-semibold text-steel-100">Have a print or model ready?</h2>
          </div>
          <Link
            href="/quote"
            className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            Get a Quote
          </Link>
        </GlassPanel>
      </Reveal>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Verify and commit**

```bash
./node_modules/.bin/next build
git add app/capabilities/5-axis-milling/page.tsx
git commit -m "$(cat <<'EOF'
Add 5-axis milling process detail page

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

### Task 9: Material family detail pages

**Files:**
- Create: `app/capabilities/materials/[slug]/page.tsx`

**Interfaces:**
- Consumes: `materialFamilies` from `@/lib/content/capabilities` (Task 7); `PageContainer`, `Reveal`, `GlassPanel` (existing). Follows the exact `generateStaticParams` / `generateMetadata` / `notFound()` pattern already established in `app/industries/[slug]/page.tsx`.

- [ ] **Step 1: Write the dynamic route**

Create `app/capabilities/materials/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { materialFamilies } from "@/lib/content/capabilities";

export function generateStaticParams() {
  return materialFamilies.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const family = materialFamilies.find((f) => f.slug === slug);
  if (!family) return {};
  return {
    title: `${family.name} CNC Machining | BELL Machine Works`,
    description: family.summary,
  };
}

export default async function MaterialFamilyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const family = materialFamilies.find((f) => f.slug === slug);
  if (!family) notFound();

  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <p className="text-sm text-accent-400">Capabilities / Materials</p>
          <h1 className="mt-1 text-3xl font-semibold text-steel-100 md:text-4xl">{family.name}</h1>
          <p className="mt-4 max-w-2xl text-steel-200">{family.summary}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Examples</h2>
          <p className="mt-4 text-steel-200">{family.examples}</p>
        </section>
      </Reveal>

      <Reveal delay={160}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Where this shows up</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {family.applications.map((application) => (
              <li key={application} className="text-steel-200">
                {application}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={240}>
        <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-xl font-semibold text-steel-100">Have a print or model ready?</h2>
          </div>
          <Link
            href="/quote"
            className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            Get a Quote
          </Link>
        </GlassPanel>
      </Reveal>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Verify all four material routes render, then commit**

```bash
./node_modules/.bin/next build
```

Expected: build output lists all four static params (`titanium-aerospace-alloys`, `stainless-steels`, `non-ferrous`, `engineering-plastics`) under `/capabilities/materials/[slug]`.

```bash
git add app/capabilities/materials/\[slug\]/page.tsx
git commit -m "$(cat <<'EOF'
Add material family detail pages

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014oH9o221g8kZmeMcjpyk3H
EOF
)"
```

## Phase 6 — About/Team + Quality & Certifications + Contact (plan in detail at phase start)

About/Team page with Bushra's story and any additional named staff (placeholder content where bios/photos aren't yet supplied — flagged, not faked). Quality & Certifications page implementing the Pillar 2 roadmap framing (dated cert status paired with existing quality rigor) and a Sample Quality Documentation section. Contact page. All spec/cert content on solid backgrounds per the glass exclusion list.

## Phase 7 — Polish pass (plan in detail at phase start)

Responsive QA across breakpoints (including the Phase 4 motion primitives' mobile fallbacks), SEO/schema markup (Person schema for team, capability schema for pages), removal of any stray Squarespace-era references, and a final full click-through of every route in-browser. Motion/animation review against the `animate`/`review-animations`/`improve-animations` skills is scoped to a final sweep here — the motion *system* itself is built and reviewed in Phase 4, not deferred to this pass.
