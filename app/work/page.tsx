import type { Metadata } from "next";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { CaseStudyDeck } from "@/components/work/case-study-deck";
import { caseStudies } from "@/lib/content/case-studies";

export const metadata: Metadata = {
  title: "Work — Case Studies | BELL Machine Works",
  description:
    "Real parts, real clients: ASML, Stoke Space, Corning, UCSF, Amazon Robotics, and nVent Data Solutions. Precision CNC machining case studies from BELL Machine Works, Gilroy, CA.",
};

export default function WorkPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Work</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Named clients, real specs, real materials — one flagship case study per
            industry BELL serves.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
          <Image
            src="/images/stock/precision-metal-parts-tray.jpg"
            alt=""
            fill
            sizes="(min-width: 1152px) 1120px, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
      <CaseStudyDeck caseStudies={caseStudies} />
    </PageContainer>
  );
}
