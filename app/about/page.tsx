import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { aboutContent } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "About | BELL Machine Works",
  description:
    "BELL Machine Works is a precision CNC machining shop in Gilroy, CA, co-owned by Bushra — built for the parts other shops turn away.",
};

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2";

export default function AboutPage() {
  return (
    <PageContainer className="flex flex-col gap-16">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">About</h1>
          <p className="mt-4 max-w-2xl text-steel-200">{aboutContent.intro}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
          {aboutContent.story.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-3xl text-steel-200">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div>
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">Team</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {aboutContent.team.map((member) => (
              <GlassPanel key={member.name} className="flex items-start gap-5 p-8">
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-lg font-semibold text-accent-400"
                >
                  {member.initials}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-steel-100">{member.name}</h3>
                  <p className="text-sm text-steel-400">{member.title}</p>
                  <p className="mt-2 text-steel-200">{member.bio}</p>
                </div>
              </GlassPanel>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-steel-400">{aboutContent.teamNote}</p>
        </div>
      </Reveal>

      <Reveal delay={240}>
        <div>
          <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">What we hold to</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {aboutContent.values.map((value) => (
              <div key={value.label} className="rounded-2xl border border-white/10 bg-graphite-900 p-6">
                <h3 className="font-semibold text-steel-100">{value.label}</h3>
                <p className="mt-2 text-sm text-steel-200">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <h2 className="text-xl font-semibold text-steel-100">Have a print or model ready?</h2>
          <Link
            href="/quote"
            className={`shrink-0 rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 ${FOCUS_RING}`}
          >
            Get a Quote
          </Link>
        </GlassPanel>
      </Reveal>
    </PageContainer>
  );
}
