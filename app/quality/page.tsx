import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { CertRoadmapTabStage } from "@/components/quality/cert-roadmap-tab-stage";
import { qualityContent } from "@/lib/content/quality";

export const metadata: Metadata = {
  title: "Quality & Certifications | BELL Machine Works",
  description:
    "BELL Machine Works' quality process and certification roadmap — material traceability, first-article inspection, GD&T verification, and documentation on every job.",
};

export default function QualityPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">
            Quality & Certifications
          </h1>
          <p className="mt-4 max-w-2xl text-steel-200">{qualityContent.status}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
            Certification roadmap
          </h2>
          <p className="mt-3 max-w-2xl text-steel-200">{qualityContent.roadmapIntro}</p>
          <div className="mt-10">
            <CertRoadmapTabStage proofPoints={qualityContent.proofPoints} />
          </div>
        </section>
      </Reveal>

      <Reveal delay={160}>
        <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-xl font-semibold text-steel-100">
              Have a print or model ready?
            </h2>
            <p className="mt-2 text-steel-200">Most quotes go out within hours.</p>
          </div>
          <Link
            href="/quote"
            className="shrink-0 rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            Get a Quote
          </Link>
        </GlassPanel>
      </Reveal>
    </PageContainer>
  );
}
