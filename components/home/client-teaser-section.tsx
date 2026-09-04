import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ClientMarquee } from "@/components/home/client-marquee";
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
        <div className="mt-8">
          <ClientMarquee names={caseStudies.map((study) => study.client)} />
        </div>
      </section>
    </Reveal>
  );
}
