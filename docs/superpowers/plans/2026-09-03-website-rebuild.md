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

## Phase 2 — Home + Capabilities hub (plan in detail at phase start)

Real homepage content replacing the Phase 1 stub (spec-first hero, cert-roadmap snippet, named-client teaser per Rebuild-Build-Plan.md §2.3–2.4), plus the Capabilities hub page (tolerance table, machine list, links to process/material pages). Uses `GlassPanel` for hero/CTA framing and plain solid tables for spec data, per the Global Constraints glass rule.

## Phase 3 — Industries (6 pages) + Case Studies (plan in detail at phase start)

One page per industry vertical (Semiconductor Equipment, Robotics & Automation, Photonics & Optical Systems, Aerospace Components, Medical Device R&D, Specialty Applications) sourcing copy from Rebuild-Build-Plan.md §2.4, plus individual case-study pages sourced directly from Case-Studies-Draft.md's Tier-A content. Case-study cards use glass; the tolerance/material facts within them stay on solid backgrounds.

## Phase 4 — RFQ form + file upload backend (plan in detail at phase start)

Structured form (material, quantity, timeline, cert requirement, file input) per spec §4, a Next.js server action streaming the upload to Vercel Blob, a Resend email to Bushra with submission details and a file link, accepted-type validation (STEP/IGES/Parasolid/STL/PDF/DWG/DXF), and a visible turnaround-SLA statement at the point of submission. Form surface stays solid per the glass exclusion list.

## Phase 5 — About/Team + Quality & Certifications + Contact (plan in detail at phase start)

About/Team page with Bushra's story and any additional named staff (placeholder content where bios/photos aren't yet supplied — flagged, not faked). Quality & Certifications page implementing the Pillar 2 roadmap framing (dated cert status paired with existing quality rigor) and a Sample Quality Documentation section. Contact page. All spec/cert content on solid backgrounds per the glass exclusion list.

## Phase 6 — Polish pass (plan in detail at phase start)

Motion/animation review against the `animate`/`review-animations`/`improve-animations` skills, responsive QA across breakpoints, SEO/schema markup (Person schema for team, capability schema for pages), removal of any stray Squarespace-era references, and a final full click-through of every route in-browser.
