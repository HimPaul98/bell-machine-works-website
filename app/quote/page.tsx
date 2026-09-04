import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/motion/reveal";
import { QuoteForm } from "@/components/quote/quote-form";

export const metadata: Metadata = {
  title: "Get a Quote — RFQ | BELL Machine Works",
  description:
    "Upload your drawing or model and tell us your material, quantity, and timeline. Most quotes go out within hours. Gilroy, CA precision CNC machining.",
};

export default function QuotePage() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <Reveal>
        <div>
          <h1 className="text-3xl font-semibold text-steel-100 md:text-4xl">Get a Quote</h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Upload your drawing or model and tell us your material, quantity, and timeline — no
            minimum order, from single prototypes to 1,000+ unit runs.
          </p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <QuoteForm />
      </Reveal>
    </PageContainer>
  );
}
