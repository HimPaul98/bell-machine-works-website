import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { processes } from "@/lib/content/capabilities";

const processDetail = processes.find((item) => item.slug === "5-axis-milling")!;

export const metadata: Metadata = {
  title: `${processDetail.name} | BELL Machine Works`,
  description: processDetail.summary,
};

export default function FiveAxisMillingPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <p className="text-sm text-accent-400">Capabilities / Process</p>
          <h1 className="mt-1 text-3xl font-semibold text-steel-100 md:text-4xl">
            {processDetail.name}
          </h1>
          <p className="mt-4 max-w-2xl text-steel-200">{processDetail.summary}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Specifications</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {processDetail.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-sm text-steel-200">{spec.label}</dt>
                <dd className="mt-1 text-lg text-steel-100">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      <Reveal delay={160}>
        <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Where this shows up</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {processDetail.applications.map((application) => (
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
