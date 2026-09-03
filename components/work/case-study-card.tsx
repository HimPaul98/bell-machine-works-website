import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { CaseStudySummary } from "@/lib/content/case-studies";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudySummary }) {
  return (
    <Link
      href={`/work/${caseStudy.slug}`}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
    >
      <GlassPanel className="h-full p-6">
        <p className="text-sm text-accent-400">{caseStudy.sector}</p>
        <h3 className="mt-1 text-lg font-semibold text-steel-100">{caseStudy.client}</h3>
        <p className="mt-2 text-sm text-steel-200">{caseStudy.summary}</p>
      </GlassPanel>
    </Link>
  );
}
