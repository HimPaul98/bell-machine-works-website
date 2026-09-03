import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
  capabilityHighlights,
  materialFamilies,
  processes,
} from "@/lib/content/capabilities";

const LINK_STYLE =
  "text-steel-100 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2";

export default function CapabilitiesPage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <div>
        <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">
          Capabilities
        </h1>
        <p className="mt-4 max-w-2xl text-steel-200">
          Precision CNC machining built around real tolerance and finish
          requirements — not generic shop capability claims.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          Machining capability
        </h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          {capabilityHighlights.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-steel-400">{item.label}</dt>
              <dd className="mt-1 text-lg text-steel-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          Processes
        </h2>
        <table className="mt-6 w-full text-left text-sm text-steel-200">
          <thead>
            <tr className="border-b border-white/10 text-steel-400">
              <th className="py-2 pr-4 font-medium">Process</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.name} className="border-b border-white/5">
                <td className="py-3 pr-4">
                  <Link href={process.href} className={LINK_STYLE}>
                    {process.name}
                  </Link>
                </td>
                <td className="py-3">{process.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-steel-400">
          Additional in-house processes and a full equipment list are being
          confirmed and will be added here — ask about a specific process on
          your RFQ.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          Materials
        </h2>
        <table className="mt-6 w-full text-left text-sm text-steel-200">
          <thead>
            <tr className="border-b border-white/10 text-steel-400">
              <th className="py-2 pr-4 font-medium">Family</th>
              <th className="py-2 font-medium">Examples</th>
            </tr>
          </thead>
          <tbody>
            {materialFamilies.map((family) => (
              <tr key={family.name} className="border-b border-white/5">
                <td className="py-3 pr-4">
                  <Link href={family.href} className={LINK_STYLE}>
                    {family.name}
                  </Link>
                </td>
                <td className="py-3">{family.examples}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <GlassPanel className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <h2 className="text-xl font-semibold text-steel-100">
            Have a print or model ready?
          </h2>
          <p className="mt-2 text-steel-200">Most quotes go out within hours.</p>
        </div>
        <Link
          href="/quote"
          className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
        >
          Get a Quote
        </Link>
      </GlassPanel>
    </PageContainer>
  );
}
