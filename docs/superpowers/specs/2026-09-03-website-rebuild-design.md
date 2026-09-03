# BELL Machine Works — Website Rebuild: Technical Design

Prepared 2026-09-03. Companion to [Rebuild-Build-Plan.md](../../../Rebuild-Build-Plan.md) (content/trust strategy) and [Design-Direction.md](../../../Design-Direction.md) (visual direction). This document is the technical architecture spec — the "how it's built" companion to those two "what to build" documents. Approved by Himadri in-chat on 2026-09-03.

## 1. Stack

- **Framework:** Next.js 15, App Router, TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Content:** dev-edited, in-repo TS/MDX data files — no headless CMS. Bushra requests content changes; a developer makes them via a PR/deploy. (Explicit decision: self-serve CMS editing was considered and declined for Phase 1 to avoid pushing back launch on CMS schema/integration work.)
- **Database:** none. This is a content-driven marketing site with one dynamic surface (the RFQ form).
- **File storage:** Vercel Blob, for RFQ drawing/model uploads.
- **Email:** Resend, to notify Bushra of new RFQ submissions with a link to the stored file.

## 2. Design system

- Tailwind config carries the Design-Direction.md "liquid glass" tokens: dark graphite/steel palette, a `.glass-panel` utility (backdrop-blur + low-opacity fill + specular top-edge gradient border), restrained motion tokens (hover lift 2–4px, scroll-triggered fade/slide-in).
- Glass treatment applies only where Design-Direction.md Section 2 specifies: nav, hero background, capability/industry cards, CTA panels, case-study cards, modals.
- Glass is explicitly **not** used on: spec tables/data, the RFQ form surface itself, certification/quality documentation pages — these stay solid, opaque, high-contrast per Design-Direction.md Section 2.
- Component/motion quality is reviewed against the installed skill set during build: `web-design-engineer`, `emil-design-eng`, `animate`, `apple-design` for construction and motion; `better-ui` / `better-layout` / `better-colors` / `better-typography` as a review pass per page; `pick-ui-library` to choose UI primitives (e.g. Radix/shadcn) rather than hand-rolling dialogs/toasts; `ask-sonner` if toast feedback is needed on the RFQ form.

## 3. Content architecture

Sitemap exactly as Rebuild-Build-Plan.md Section 3:

```
Home
├── Capabilities (hub) → process pages, Materials (4 material-family pages)
├── Industries (6 pages: Semiconductor Equipment, Robotics & Automation,
│   Photonics & Optical Systems, Aerospace Components, Medical Device R&D,
│   Specialty Applications)
├── Quality & Certifications (Roadmap, Sample Quality Documentation)
├── Work / Case Studies (individual pages, Tier A per Case-Studies-Draft.md)
├── About → Team
├── Get a Quote (RFQ form)
└── Contact
```

Resources/Blog is out of scope (content-plan Phase 3, longer horizon — not part of this build).

- `<TestimonialsSection>` and `<VideoFeature>` are built as independently-conditional components per Design-Direction.md Section 3: each renders `null` cleanly with zero layout impact when no content exists yet, so the site never shows an unfilled-template look.
- Case study content is sourced directly from [Case-Studies-Draft.md](../../../Case-Studies-Draft.md) (Tier A, pending Bushra's final naming review — content is wired to be swapped/pulled per-client without a rebuild).

## 4. RFQ form / file upload

- Client-side form (material, quantity, timeline, cert requirement, file input) → Next.js server action.
- Server action streams the uploaded drawing/model file to Vercel Blob, then sends a Resend email to Bushra with submission details + a link to the stored file.
- Accepted file types per Rebuild-Build-Plan.md Section 2.4: STEP, IGES, Parasolid, STL, PDF, DWG, DXF.
- Visible turnaround SLA statement shown at the point of submission (Pillar 6 of the trust framework).

## 5. Testing / verification

No automated test suite for a marketing site at this stage. Correctness gate is `tsc` + `next build`. Every phase is additionally verified by running the dev server and clicking through the affected pages/breakpoints in-browser before being called done — not inferred from code alone.

## 6. Build phases

Each phase is sized to roughly 100k tokens of work, with a `/compact` boundary between phases per Himadri's request.

1. **Scaffold** — Next.js/TS/Tailwind init, design-system tokens + glass primitives, layout shell (nav, footer, page container), git init + first commit.
2. **Home + Capabilities hub** — hero, spec-led sections, capabilities hub page.
3. **Industries (6 pages) + Case Studies** — using Case-Studies-Draft.md content directly.
4. **RFQ form + file upload backend** (Vercel Blob + Resend).
5. **About/Team + Quality & Certifications + Contact.**
6. **Polish pass** — motion/animation review, responsive QA, SEO/schema markup, remove stray Squarespace-era references.

## 7. Open items carried from Rebuild-Build-Plan.md Section 6

Not blocking the build (placeholder content ships where real content is pending), but need Bushra's input before Phase 1 content is final:
- Final client-naming review (Tier A/B/C)
- Certification target dates (AS9100D, ITAR, CMMC)
- Team info beyond Bushra (names, bios, photos, LinkedIn)
- Photography/video access and shoot-day scheduling
- Confirmation of exactly which processes BELL runs in-house
- Sample redacted CMM/FAI documents
