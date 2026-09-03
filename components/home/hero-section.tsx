import Image from "next/image";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { heroContent } from "@/lib/content/home";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <Image
        src="/images/stock/cnc-5-axis-mill-head-coolant.jpg"
        alt="CNC machining in progress"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-graphite-900/70" aria-hidden />
      <GlassPanel hoverLift={false} className="p-10 md:p-16">
        <h1 className="text-3xl font-semibold text-steel-100 md:text-5xl">
          {heroContent.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-steel-200">{heroContent.subhead}</p>
        <Link
          href={heroContent.ctaHref}
          className="mt-8 inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
        >
          {heroContent.ctaLabel}
        </Link>
      </GlassPanel>
    </div>
  );
}
