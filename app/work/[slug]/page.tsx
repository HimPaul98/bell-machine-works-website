import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel } from "@/components/ui/glass-panel";
import { caseStudies } from "@/lib/content/case-studies";
import { industries } from "@/lib/content/industries";

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.client} — Case Study | BELL Machine Works`,
    description: caseStudy.summary,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);
  if (!caseStudy) notFound();

  const industry = industries.find((i) => i.slug === caseStudy.industrySlug);

  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <p className="text-sm text-accent-400">{caseStudy.sector}</p>
        <h1 className="mt-1 text-3xl font-semibold text-steel-100 md:text-4xl">
          {caseStudy.client}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-steel-200">{caseStudy.summary}</p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <p className="max-w-3xl text-steel-200">{caseStudy.narrative}</p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-3">
          {caseStudy.specHighlights.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-steel-200">{item.label}</dt>
              <dd className="mt-1 text-lg text-steel-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {industry && (
        <p className="text-sm text-steel-200">
          Part of BELL&apos;s{" "}
          <Link
            href={`/industries/${industry.slug}`}
            className="text-steel-100 underline underline-offset-4 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            {industry.name}
          </Link>{" "}
          work.
        </p>
      )}

      <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <h2 className="text-xl font-semibold text-steel-100">Have a print or model ready?</h2>
          <p className="mt-2 text-steel-200">Most quotes go out within hours.</p>
        </div>
        <Link
          href="/quote"
          className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
        >
          Get a Quote
        </Link>
      </GlassPanel>
    </PageContainer>
  );
}
