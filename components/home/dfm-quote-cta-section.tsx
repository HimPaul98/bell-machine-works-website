import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { GlassPanel } from "@/components/ui/glass-panel";

export function DfmQuoteCtaSection() {
  return (
    <Reveal delay={80}>
      <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <h2 className="text-xl font-semibold text-steel-100">
            Send a print, get more than a price
          </h2>
          <p className="mt-2 max-w-xl text-steel-200">
            Every quote request includes a free design-for-manufacturability
            review from an engineer — not just a number. Most quotes go out
            within hours.
          </p>
        </div>
        <Link
          href="/quote"
          className="shrink-0 rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
        >
          Get a Free DFM Review + Quote
        </Link>
      </GlassPanel>
    </Reveal>
  );
}
