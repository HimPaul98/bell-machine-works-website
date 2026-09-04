import { PageContainer } from "@/components/layout/page-container";
import { HeroSection } from "@/components/home/hero-section";
import { IdentityStatementSection } from "@/components/home/identity-statement-section";
import { CapabilityStripSection } from "@/components/home/capability-strip-section";
import { DfmQuoteCtaSection } from "@/components/home/dfm-quote-cta-section";
import { ClientTeaserSection } from "@/components/home/client-teaser-section";

export default function Home() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <HeroSection />
      <IdentityStatementSection />
      <CapabilityStripSection />
      <DfmQuoteCtaSection />
      <ClientTeaserSection />
    </PageContainer>
  );
}
