// components/industries/industries-tab-stage.tsx
"use client";

import Link from "next/link";
import { TabStage } from "@/components/motion/tab-stage";
import type { Industry } from "@/lib/content/industries";

/** Client wrapper around TabStage for the Industries hub's "Featured
 *  verticals" spotlight. TabStage's `getKey`/`getLabel`/`renderSlide`
 *  props are functions, and a Server Component (app/industries/page.tsx,
 *  which needs its `metadata` export) can't pass functions across the
 *  Server/Client boundary — only serializable data. This wrapper receives
 *  the plain, serializable `industries` data from the server page and does
 *  the function-prop wiring to TabStage entirely on the client side, where
 *  that's allowed. */
export function IndustriesTabStage({ industries }: { industries: Industry[] }) {
  return (
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
  );
}
