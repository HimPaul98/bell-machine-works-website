import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { CaseStudyCard } from "@/components/work/case-study-card";
import { caseStudies } from "@/lib/content/case-studies";

export const metadata: Metadata = {
  title: "Work — Case Studies | BELL Machine Works",
  description:
    "Real parts, real clients: ASML, Stoke Space, Corning, UCSF, Amazon Robotics, and nVent Data Solutions. Precision CNC machining case studies from BELL Machine Works, Gilroy, CA.",
};

export default function WorkPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Work</h1>
        <p className="mt-4 max-w-2xl text-steel-200">
          Named clients, real specs, real materials — one flagship case study per
          industry BELL serves.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {caseStudies.map((caseStudy) => (
          <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))}
      </div>
    </PageContainer>
  );
}
