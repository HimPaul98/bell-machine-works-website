import { GlassPanel } from "@/components/ui/glass-panel";
import { caseStudies } from "@/lib/content/case-studies";

export function ClientTeaserSection() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
        Trusted by engineering teams at
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {caseStudies.map((study) => (
          <GlassPanel key={study.slug} className="p-6">
            <p className="text-sm text-accent-400">{study.sector}</p>
            <h3 className="mt-1 text-lg font-semibold text-steel-100">
              {study.client}
            </h3>
            <p className="mt-2 text-sm text-steel-200">{study.summary}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
