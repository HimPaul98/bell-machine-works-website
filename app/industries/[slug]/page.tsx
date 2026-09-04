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
          {/* Bottom-anchored gradient rather than a flat scrim + opaque panel —
              keeps the industry photo itself legible; only the text zone
              darkens. Mirrors the home hero treatment. */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/55 via-40% to-transparent to-75%"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 flex items-end p-6 md:p-14">
          <div className="max-w-2xl">
            <p className="text-sm text-accent-400 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              Industries
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-steel-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-4xl">
              {industry.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-steel-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
              {industry.tagline}
            </p>
          </div>
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
