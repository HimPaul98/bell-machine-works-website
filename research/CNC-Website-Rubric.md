# BELL Machine Works Website Rubric
### What a strong CNC machining website needs, what bellmachineworks.com has today, and what to change

Prepared 2026-09-03. Sources: (1) https://digital-marketing-for-manufacturers.com/industries/cnc-machining-marketing/ (CNC-specific guidance only, agency self-promotion stripped out), (2) direct audit of the live bellmachineworks.com site, (3) patterns pulled from [Top10-Competitor-Website-Analysis.md](./Top10-Competitor-Website-Analysis.md).

**Bottom line up front:** BELL's current site is a single-page Squarespace site with genuinely strong technical specificity (real tolerances, real materials, real work envelope) but almost no proof, no structure, and no active certifications. The technical credibility is there; the trust architecture around it is not. That's fixable and is most of what this document is about.

---

## 1. Site Structure

| Item | Best-practice standard | BELL today | Gap / Priority |
|---|---|---|---|
| Multi-page architecture | Hub-and-spoke: capability hub → process pages → material pages → industry pages → cert pages. Shops using this reportedly see 40–60% higher organic traffic, 25–40% higher RFQ-to-quote conversion. | **Single long-scroll page** (`/home`). "Capabilities" and "Contact" are same-page anchors, not real URLs. Only one indexable content page exists. | **Critical.** Rebuild as a real multi-page site. This is the single highest-leverage structural change — it's both an SEO and a content-depth problem. |
| Duplicate/orphan pages | N/A — clean sitemap. | `/industries-draft` and `/new-page` are live, indexed in sitemap.xml, and duplicate homepage sections, but are unlinked from nav. | **High.** Delete or noindex these before relaunch; duplicate content live in a sitemap is a real SEO liability. |
| Machine-specific capability pages | One page per machine/process type: axis count, spindle speed, max part envelope, tolerance capability. | None. No equipment list exists anywhere on the site. | **High.** |
| Material-specific pages | One per material: machinability, achievable tolerances, finishes, design considerations — as tables, not prose. | Materials are listed (good list: Al 6061/7075, Ti Grade 5, Inconel 625/718, PEEK, etc.) but only as a flat bullet list on the homepage, no dedicated pages. | **Medium** — the underlying data exists, it just needs to be expanded into standalone pages. |
| Industry vertical pages | Dedicated page per vertical: certs required, regulatory context, typical parts, quality deliverables. | Six industry cards exist on the homepage (Semiconductor, Robotics, Photonics, Aerospace, Medical, Specialty) with example parts — genuinely good raw content — but each is a homepage card, not a real page, and "VIEW DETAILS +" links don't appear to go anywhere. | **High** — this is the best raw content on the current site; it just needs to become 6 real pages. |
| Certification scope pages | One per cert held: certifying body, audit history, covered processes, docs delivered. | No certs currently held — ISO 9001 and ITAR are listed as "planned 2026," CMMC as "pursuing." | **Blocking, not just structural** — see Section 3. |
| DFM / tolerance guide | Wall thickness minimums, corner radii, thread engagement, tolerance-class tradeoffs. | Not present as a standalone resource; some of this exists implicitly in FAQ answers. | **Medium.** |
| Case studies | 15–30, organized by material/process/industry, each with challenge, tolerances achieved, inspection method, outcome. | **Zero.** No case studies anywhere. | **Critical** — see Section 4. |
| About / Team page | Named engineers/quality staff, LinkedIn profiles, Person schema. | **Does not exist** (`/about` 404s). No founder story, no team photos, no names. | **High** — undercuts the site's own "engineering-led" / "engineers building for engineers" positioning, which currently has no visible engineer behind it. |
| RFQ / quote page with real form | Fields for drawing upload, material, quantity, target price, timeline, cert requirements — placed on every technical page. | **No form at all.** "Submit Technical Package" section is just instructional copy telling visitors to email files. Contact is email + phone only. `/contact` and `/quote` both 404. | **Critical** — see Section 5. |
| Quality documentation page | Sample CMM reports, FAI examples, SPC/Cpk data. | Mentioned in prose (MTRs, GD&T verification, FAI, batch records) but no examples or sample docs shown. | **Medium.** |
| Blog / technical resources | Downloadable GD&T samples, DFM checklists, material logs — used as lead magnets. | None. | **Medium** — lower priority than the above, but a long-term SEO/content engine gap. |

---

## 2. Homepage Content

| Item | Best-practice standard | BELL today | Gap / Priority |
|---|---|---|---|
| Lead with capability, not brand | Homepage should answer a specification question directly, no preamble. Generic "CNC machining services" framing converts at 0.5–2% vs. 7–15% for spec-matched content. | Hero leads with brand positioning ("Engineering-Led Machining," "Engineers building for engineers") rather than a specific capability claim. Not generic, but not spec-first either. | **Medium.** The positioning language is good and worth keeping as brand voice — but pair it with a concrete first-sentence capability claim (e.g., "AS9100D-track 5-axis CNC machining of titanium and Inconel to ±0.0002\", Bay Area"). |
| Answer-first / AI-extractable structure | Direct, quotable answers in the first sentence of each section; data as tables not prose (matters for both human scanning and AI/GEO — ChatGPT, Perplexity, Google AI Overviews used in procurement research). | Content is mostly prose/marketing copy. Specs exist but aren't consistently tabular. | **Medium-High**, rising in importance — see Section 6 (SEO/GEO). |

---

## 3. Trust & Credibility Signals

This is BELL's single biggest gap category — and the one competitor research shows matters most to aerospace/defense/space buyers.

| Signal | Best-practice standard | BELL today | Gap / Priority |
|---|---|---|---|
| Active certifications | ISO 9001 (baseline), AS9100D + ITAR + CMMC (aerospace/defense), each with its own scope page, displayed above the fold. | **None active.** ISO 9001 and ITAR: "planned 2026." CMMC: "pursuing." Honestly disclosed, but this is a hard qualifying filter many aerospace/defense/medical buyers apply before reading anything else — every strong competitor site (Xometry, Fathom, A&G, Applied A&D) puts certs in the first screen. | **Critical, and time-bound** — this is a business milestone (getting certified), not just a web content task, but the website should be re-architected now so certs can go live the moment they're achieved, and in the meantime the site should clearly frame *current* quality practices (FAI, MTRs, GD&T verification, batch records) as substitute credibility while certs are pending, rather than only naming the gap. |
| Named clients / case studies | Name real programs/clients specifically wherever contractually allowed — the single biggest differentiator between strong and weak competitor sites. | **Zero** — no client names, logos, or case studies anywhere, despite a real reference list per Closed Won records (Stoke Space, SpaceX, Amazon Robotics, and others). | **Critical.** This is the highest-ROI single fix available: BELL has the same raw material (real, named aerospace/space clients) that separates the *good* competitor sites from the *weak* ones (see Aria Group in the competitor doc — spectacular real work, zero of it shown, weakest site in the set). Confirm what's contractually nameable, then surface it prominently. |
| Equipment / shop transparency | Filterable machine table: model, axis count, spindle speed, max part size, availability. | None — no machine list, no shop-floor photos, no video anywhere on the site. | **High.** |
| Team / named people | Engineers and quality staff listed by name/role, LinkedIn links, Person schema (an actual E-E-A-T/SEO mechanism, not just nice-to-have). | No team page, no names, no photos. | **High** — directly undermines the "engineering-led" brand claim, which currently has no visible person behind it. |
| Third-party validation | Reviews (Google Business, Xometry/Thomas/MFG marketplace reviews), industry association memberships, awards/press. | None found. | **Medium.** |
| Photography / video | Real part photos, shop-floor photos, a short video walkthrough of a 5-axis cell machining an actual part with the operator narrating — cited as the single strongest content format in the source research ("trust is built in the detail, not the polish"). | No photography of real parts or the shop confirmed anywhere; homepage visuals are icon illustrations (cube, atom, magnifying glass icons), not photos. | **High** — and notably, this is a gap even among the *strong* competitor sites (Major Tool, Barnes, Applied A&D all skip real photography too), so doing this well is a genuine differentiator, not just table stakes. |
| Response-time SLA | Visible quote-turnaround commitment (a "48-hour rule" pattern) — response speed is called out as a real competitive differentiator in B2B machining. | Site says estimate "within hours" for the technical package review — good, just not framed as a visible, quotable SLA. | **Low** — mostly a copy/positioning tweak, not new work. |

---

## 4. Buyer-Committee Content Coverage

CNC/precision manufacturing purchases involve a 5–6 month, multi-stakeholder buying cycle. The site needs to speak to each role, not just one generic visitor.

| Buyer role | What they need | BELL today |
|---|---|---|
| Manufacturing Engineer (highest influence) | Material grade, GD&T datums, tolerance class, Ra finish — will not RFQ a shop that can't show prior experience in the same material + tolerance combo. Needs downloadable GD&T samples, material experience log. | Partial — real spec data exists on the homepage, but no downloadable resources, no proof of prior material-specific experience (i.e., no case studies). |
| Quality Manager | FAI (AS9102), CMM capability, SPC/Cpk data, material traceability. | Mentioned in prose only; no sample documents shown. |
| Procurement Specialist | Commercial terms, lead times, capacity. | Lead times and MOQ info present (2-week standard, 24-hour rush, no MOQ) — this part is actually solid. |
| VP / Supply Chain | Contract risk, strategic fit, certifications. | Weakest coverage — no certs, no named client relationships to de-risk the decision. |

---

## 5. Conversion Elements

| Item | Best-practice standard | BELL today | Gap / Priority |
|---|---|---|---|
| RFQ form | Structured form with drawing upload, material, quantity, target price, timeline, cert requirements — placed on every technical page, top and bottom. | **None.** Visitor is asked to compose a cold email with attachments to team@bellmachineworks.com. No upload portal. | **Critical.** This is the actual point of the site (getting quotes) and currently has the most friction of any competitor reviewed. |
| Process clarity | A simple visual "how it works" bar (e.g., Protolabs: Upload → Quote/DFM → Manufacturing → Ship) removes first-time-buyer uncertainty. | "How We Work" section exists (Review → Execution → Documentation → Delivery) but is icon-only with minimal depth. | **Medium** — good bones, needs more substance and could be paired with the new RFQ flow. |
| CTAs | Clear, repeated, benefit-oriented CTAs throughout. | Effectively one CTA (email submission), repeated. Industry card "VIEW DETAILS +" links appear non-functional. | **Medium-High.** |

---

## 6. SEO / Technical Considerations (including GEO — Generative Engine Optimization)

Increasingly relevant as procurement research shifts to AI assistants (ChatGPT, Perplexity, Google AI Overviews).

| Item | Best-practice standard | BELL today |
|---|---|---|
| Spec-based page titles/headings | Mirror how engineers actually search: "5-axis CNC milling titanium 6Al-4V AS9100D" outperforms "Precision Manufacturing Services" 8–15% vs. 0.5–2% conversion. | Page title is decent ("BELL Engineering-Led Machining \| San Francisco Bay Area Precision CNC Machining") but no supporting spec-specific pages exist to rank for those higher-intent queries. |
| Structured/tabular data | Machine lists, tolerance envelopes, material grades, cert scope — as tables/lists, not prose, because "AI systems lift the right column and ignore the left." | Data exists but is presented as bullet lists/prose within one page, not structured per-topic. |
| Schema markup | Person schema for staff at minimum; broader Organization/capability schema where possible. | Meta/OG tags are configured correctly (good baseline), but no evidence of Person or capability schema (no team page to attach it to yet). |
| Content depth | 4+ supporting assets per capability page (process guide, material guide, tolerance reference, cert scope page). | N/A — no capability pages exist yet to support. |

---

## 7. Design / UX Cleanup (lower-effort, do alongside the rebuild)

- Remove the stray Squarespace e-commerce cart icon in the header — irrelevant to a B2B custom-manufacturing site.
- Add footer legal pages (Privacy Policy, Terms) and, once they exist, social/LinkedIn links.
- Fix or remove non-functional "VIEW DETAILS +" links on industry cards.
- Decide platform: Squarespace's single-page-first pattern is a real constraint against the multi-page architecture this rubric calls for — worth evaluating whether Squarespace can be structured properly with real subpages (it can, this just wasn't done) or whether a rebuild on a different stack is warranted. Flagging as a decision point, not a foregone conclusion.

---

## 8. Priority Summary — What to Fix First

**Do first (blocking, highest ROI):**
1. Real multi-page architecture (kills the single-page/anchor-link problem, unlocks everything else)
2. Named client / case study content — BELL's strongest untapped asset
3. Structured RFQ form with file upload
4. Team/About page with real names and photos
5. Clean up orphaned duplicate pages (`/industries-draft`, `/new-page`)

**Do second (high value, more content-production-heavy):**
6. Industry vertical pages (convert the 6 existing homepage cards into real pages)
7. Equipment list + shop/part photography, ideally a short video walkthrough
8. Material and capability pages as structured tables

**Do third (compounding, longer-horizon):**
9. Certification scope pages (publish as certs are actually achieved — this is a milestone, not a content task)
10. DFM/tolerance guides, downloadable technical resources
11. Blog/resources content engine, schema markup, broader SEO/GEO buildout

**Ongoing / low-effort polish:**
12. Header cart icon removal, footer legal pages, CTA copy tightening, visible response-time SLA framing
