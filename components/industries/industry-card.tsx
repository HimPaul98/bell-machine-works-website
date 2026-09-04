import Image from "next/image";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { Industry } from "@/lib/content/industries";

export function IndustryCard({ industry }: { industry: Industry }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
    >
      <GlassPanel className="h-full overflow-hidden p-0">
        <div className="relative h-56">
          <Image
            src={industry.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-graphite-950/60 via-graphite-950/10 to-transparent"
            aria-hidden
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-steel-100">{industry.name}</h3>
          <p className="mt-2 text-sm text-steel-200">{industry.tagline}</p>
        </div>
      </GlassPanel>
    </Link>
  );
}
