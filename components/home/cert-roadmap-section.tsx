import Link from "next/link";
import { certRoadmapContent } from "@/lib/content/home";

export function CertRoadmapSection() {
  return (
    <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
      <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
        {certRoadmapContent.heading}
      </h2>
      <p className="mt-3 max-w-2xl text-steel-200">{certRoadmapContent.status}</p>
      <ul className="mt-6 grid gap-3 text-sm text-steel-200 md:grid-cols-2">
        {certRoadmapContent.proofPoints.map((point) => (
          <li key={point} className="flex gap-2">
            <span aria-hidden className="text-accent-400">
              &middot;
            </span>
            {point}
          </li>
        ))}
      </ul>
      <Link
        href={certRoadmapContent.ctaHref}
        className="mt-6 inline-block text-sm font-medium text-accent-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
      >
        {certRoadmapContent.ctaLabel} →
      </Link>
    </section>
  );
}
