import { Reveal } from "@/components/motion/reveal";
import { faqItems } from "@/lib/content/home";

export function FaqSection() {
  return (
    <Reveal>
      <section className="rounded-2xl border border-white/10 bg-graphite-900 p-8 md:p-12">
        <h2 className="text-xl font-semibold text-steel-100 md:text-2xl">
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-white/10">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-steel-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
                <span className="font-medium">{item.question}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 shrink-0 text-steel-200 transition-transform duration-200 group-open:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-3 max-w-3xl text-steel-200">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
