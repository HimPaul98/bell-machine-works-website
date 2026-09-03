import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { Industry } from "@/lib/content/industries";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
    >
      <GlassPanel className="h-full p-6">
        <h3 className="text-lg font-semibold text-steel-100">{industry.name}</h3>
        <p className="mt-2 text-sm text-steel-200">{industry.tagline}</p>
      </GlassPanel>
    </Link>
  );
}
