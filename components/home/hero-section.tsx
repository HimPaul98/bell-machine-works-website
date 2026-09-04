import Image from "next/image";
import Link from "next/link";
import { heroContent } from "@/lib/content/home";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="relative h-[480px] md:h-[560px]">
        <Image
          src="/images/stock/cnc-5-axis-mill-aluminum-block.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1152px) 1120px, 100vw"
          className="object-cover"
        />
        {/* Bottom-anchored gradient rather than a flat scrim + opaque panel —
            keeps the machining photo itself legible; only the text zone
            darkens. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/55 via-40% to-transparent to-75%"
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 flex items-end p-6 md:p-14">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-wide text-accent-300 uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
            {heroContent.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-steel-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-5xl">
            {heroContent.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-steel-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            {heroContent.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={heroContent.ctaHref}
              className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
            >
              {heroContent.ctaLabel}
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-steel-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
              <span aria-hidden className="size-1.5 rounded-full bg-accent-400" />
              {heroContent.sla}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
