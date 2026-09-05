import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { contactContent } from "@/lib/content/contact";

export const metadata: Metadata = {
  title: "Contact | BELL Machine Works",
  description:
    "Reach BELL Machine Works in Gilroy, CA — get a quote on a print or model, or email the team directly with a question.",
};

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2";

export default function ContactPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Contact</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            {contactContent.location} · {contactContent.slaStatement}
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {contactContent.channels.map((channel, index) => (
          <Reveal key={channel.label} delay={index * 80}>
            <GlassPanel className="flex h-full flex-col justify-between gap-6 p-8 md:p-10">
              <div>
                <h2 className="text-xl font-semibold text-steel-100">{channel.label}</h2>
                <p className="mt-3 text-steel-200">{channel.body}</p>
              </div>
              <Link
                href={channel.ctaHref}
                className={`inline-block w-fit rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 ${FOCUS_RING}`}
              >
                {channel.ctaLabel}
              </Link>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </PageContainer>
  );
}
