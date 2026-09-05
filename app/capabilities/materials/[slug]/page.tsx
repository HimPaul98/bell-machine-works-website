import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceSchema } from "@/lib/seo/schema";
import { materialFamilies } from "@/lib/content/capabilities";

export function generateStaticParams() {
  return materialFamilies.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const family = materialFamilies.find((f) => f.slug === slug);
  if (!family) return {};
  return {
    title: `${family.name} CNC Machining | BELL Machine Works`,
    description: family.summary,
  };
}

export default async function MaterialFamilyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const family = materialFamilies.find((f) => f.slug === slug);
  if (!family) notFound();

  return (
    <PageContainer className="flex flex-col gap-12">
      <JsonLd
        data={serviceSchema({
          name: `${family.name} CNC Machining`,
          description: family.summary,
          url: `https://bellmachineworks.com/capabilities/materials/${family.slug}`,
        })}
      />
      <Reveal>
        <div>
          <p className="text-sm text-accent-400">Capabilities / Materials</p>
          <h1 className="mt-1 text-3xl font-semibold text-steel-100 md:text-4xl">{family.name}</h1>
          <p className="mt-4 max-w-2xl text-steel-200">{family.summary}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Examples</h2>
          <p className="mt-4 text-steel-200">{family.examples}</p>
        </section>
      </Reveal>

      <Reveal delay={160}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Where this shows up</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {family.applications.map((application) => (
              <li key={application} className="text-steel-200">
                {application}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={240}>
        <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-xl font-semibold text-steel-100">Have a print or model ready?</h2>
          </div>
          <Link
            href="/quote"
            className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            Get a Quote
          </Link>
        </GlassPanel>
      </Reveal>
    </PageContainer>
  );
}
