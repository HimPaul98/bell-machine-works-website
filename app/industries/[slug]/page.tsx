import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel } from "@/components/ui/glass-panel";
import { industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/case-studies";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} CNC Machining | BELL Machine Works`,
    description: industry.tagline,
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  const caseStudy = caseStudies.find((cs) => cs.slug === industry.caseStudySlug);

  return (
    <PageContainer className="flex flex-col gap-12">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative h-[320px] md:h-[400px]">
          <Image
            src={industry.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1152px) 1120px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-graphite-900/78" aria-hidden />
        </div>
        <div className="absolute inset-0 flex items-center p-4 md:p-10">
          <GlassPanel hoverLift={false} className="p-8 md:p-12">
            <p className="text-sm text-accent-400">Industries</p>
            <h1 className="mt-1 text-3xl font-semibold text-steel-100 md:text-4xl">
              {industry.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-steel-200">{industry.tagline}</p>
          </GlassPanel>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <p className="max-w-3xl text-steel-200">{industry.body}</p>
        <div className="mt-6">
          <h2 className="text-sm font-medium text-steel-200">Materials</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {industry.materials.map((material) => (
              <li
                key={material}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-steel-100"
              >
                {material}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {caseStudy && (
        <section>
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Featured work</h2>
          <Link
            href={`/work/${caseStudy.slug}`}
            className="mt-6 block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            <GlassPanel className="p-6">
              <p className="text-sm text-accent-400">{caseStudy.sector}</p>
              <h3 className="mt-1 text-lg font-semibold text-steel-100">{caseStudy.client}</h3>
              <p className="mt-2 text-sm text-steel-200">{caseStudy.summary}</p>
            </GlassPanel>
          </Link>
        </section>
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
