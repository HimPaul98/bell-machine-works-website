import { PageContainer } from "@/components/layout/page-container";
import { HeroSection } from "@/components/home/hero-section";
import { CertRoadmapSection } from "@/components/home/cert-roadmap-section";

export default function Home() {
  return (
    <PageContainer className="flex flex-col gap-12">
      <HeroSection />
      <CertRoadmapSection />
    </PageContainer>
  );
}
