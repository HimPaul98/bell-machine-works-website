import type { Metadata } from "next";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { IndustryCard } from "@/components/industries/industry-card";
import { IndustriesTabStage } from "@/components/industries/industries-tab-stage";
import { Reveal } from "@/components/motion/reveal";
import { industries } from "@/lib/content/industries";

export const metadata: Metadata = {
  title: "Industries — Precision CNC Machining by Vertical | BELL Machine Works",
  description:
    "Semiconductor equipment, aerospace, robotics, photonics, medical device, and specialty-applications machining — real tolerances, real materials, real clients. Gilroy, CA.",
};

export default function IndustriesPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Industries</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Six verticals where BELL has real, shipped work — not a generic capability
            claim for each.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="relative h-72 overflow-hidden rounded-2xl md:h-96">
          <Image
            src="/images/stock/cnc-lathe-turning-shaft-detail.jpg"
            alt=""
            fill
            sizes="(min-width: 1152px) 1120px, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-graphite-950/40 to-transparent"
            aria-hidden
          />
        </div>
      </Reveal>
      <Reveal delay={160}>
        <div>
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
            Featured verticals
          </h2>
          <div className="mt-4">
            <IndustriesTabStage industries={industries} />
          </div>
        </div>
      </Reveal>
      <Reveal delay={240}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Reveal>
    </PageContainer>
  );
}
