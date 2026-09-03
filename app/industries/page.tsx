import type { Metadata } from "next";
import Image from "next/image";
import { PageContainer } from "@/components/layout/page-container";
import { IndustryCard } from "@/components/industries/industry-card";
import { industries } from "@/lib/content/industries";

export const metadata: Metadata = {
  title: "Industries — Precision CNC Machining by Vertical | BELL Machine Works",
  description:
    "Semiconductor equipment, aerospace, robotics, photonics, medical device, and specialty-applications machining — real tolerances, real materials, real clients. Gilroy, CA.",
};

export default function IndustriesPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Industries</h1>
        <p className="mt-4 max-w-2xl text-steel-200">
          Six verticals where BELL has real, shipped work — not a generic capability
          claim for each.
        </p>
      </div>
      <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
        <Image
          src="/images/stock/cnc-mill-drilling-hot-chips.jpg"
          alt="Precision CNC machining detail"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <IndustryCard key={industry.slug} industry={industry} />
        ))}
      </div>
    </PageContainer>
  );
}
