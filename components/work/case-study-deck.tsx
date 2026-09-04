// components/work/case-study-deck.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StickyStack } from "@/components/motion/sticky-stack";
import type { CaseStudySummary } from "@/lib/content/case-studies";

/** Client wrapper around StickyStack for the Work hub's case-study deck.
 *  StickyStack's `getKey`/`renderItem` props are functions, and a Server
 *  Component (app/work/page.tsx, which needs its `metadata` export) can't
 *  pass functions across the Server/Client boundary — only serializable
 *  data. This wrapper receives the plain, serializable `caseStudies` data
 *  from the server page and does the function-prop wiring to StickyStack
 *  entirely on the client side, where that's allowed. */
export function CaseStudyDeck({ caseStudies }: { caseStudies: CaseStudySummary[] }) {
  return (
    <StickyStack
      items={caseStudies}
      getKey={(caseStudy) => caseStudy.slug}
      renderItem={(caseStudy, index) => {
        const flipped = index % 2 === 1;

        return (
          <Link
            href={`/work/${caseStudy.slug}`}
            className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            <GlassPanel
              hoverLift={false}
              className="grid overflow-hidden md:min-h-[60vh] md:grid-cols-2"
            >
              <div className={`relative h-64 md:h-full ${flipped ? "md:order-last" : ""}`}>
                <Image
                  src={caseStudy.image}
                  alt=""
                  fill
                  sizes="(min-width: 1152px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-10 md:p-16">
                <p className="text-sm text-accent-400">{caseStudy.sector}</p>
                <h2 className="mt-2 text-3xl font-semibold text-steel-100 md:text-4xl">
                  {caseStudy.client}
                </h2>
                <p className="mt-4 max-w-xl text-steel-200">{caseStudy.summary}</p>
                <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                  {caseStudy.specHighlights.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-xs uppercase tracking-wide text-steel-200">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 text-steel-100">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </GlassPanel>
          </Link>
        );
      }}
    />
  );
}
