# BELL Machine Works — Website

Rebuild of the BELL Machine Works marketing site (precision CNC machining shop, Gilroy, CA — [bellmachineworks.com](https://bellmachineworks.com)). Next.js 16 App Router + TypeScript + Tailwind CSS v4.

## Run it locally

Requirements: Node.js 20+ (built with v24), npm.

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**. If port 3000 is already in use, Next.js will print the alternate port it picked instead.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

> **Note for Claude Code / AI agents:** if the repo is cloned into a directory path containing a colon (`:`) or other shell-special character, `npm run <script>` can fail to resolve. If that happens, call the binaries directly instead: `./node_modules/.bin/next dev`, `./node_modules/.bin/next build`, `./node_modules/.bin/next start`.

## Project structure

- `app/` — routes (App Router)
- `components/` — UI, layout, motion, and SEO components
- `lib/` — content data, schema.org helpers, motion/scroll-engine utilities
- `public/` — static assets (images, logo)
- `docs/` — build plan and process documentation (see `docs/superpowers/plans/`)

## Status

The site build is substantively complete (design, all core pages, responsive QA, SEO/schema markup, sitemap/robots). A handful of items are intentionally deferred pending sign-off from the client (Bushra): client-naming approval, process pages beyond 5-axis milling, additional team bios/photos, real shop photography/video, the Sample Quality Documentation section on `/quality`, and firmer ITAR/CMMC certification dates. Deployment/hosting has not been configured yet.
