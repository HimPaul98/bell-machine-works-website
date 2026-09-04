import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { CertRoadmapTabStage } from "@/components/home/cert-roadmap-tab-stage";
import { certRoadmapContent } from "@/lib/content/home";

export function CertRoadmapSection() {
  return (
    <Reveal>
      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          {certRoadmapContent.heading}
        </h2>
        <p className="mt-3 max-w-2xl text-steel-200">{certRoadmapContent.status}</p>
        <div className="mt-10">
          <CertRoadmapTabStage proofPoints={certRoadmapContent.proofPoints} />
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
