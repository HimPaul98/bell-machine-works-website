import { Reveal } from "@/components/motion/reveal";
import { capabilityHighlights } from "@/lib/content/capabilities";

export function CapabilityStripSection() {
  return (
    <Reveal>
      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          Machining capability
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilityHighlights.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-steel-200">{item.label}</dt>
              <dd className="mt-1 text-lg text-steel-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Reveal>
  );
}
