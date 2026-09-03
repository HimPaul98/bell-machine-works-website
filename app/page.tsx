// app/page.tsx
import { GlassPanel } from "@/components/ui/glass-panel";
import { PageContainer } from "@/components/layout/page-container";

export default function Home() {
  return (
    <main className="bg-graphite-950">
      <PageContainer>
        <GlassPanel className="p-10 md:p-16">
          <h1 className="text-3xl font-semibold text-steel-100 md:text-5xl">
            Engineering-Led CNC Machining, to ±0.0002&quot;
          </h1>
          <p className="mt-4 max-w-2xl text-steel-200">
            Homepage content lands in Phase 2 of the build. This stub proves
            the layout shell — nav, footer, page container, glass panel —
            renders correctly end to end.
          </p>
        </GlassPanel>
      </PageContainer>
    </main>
  );
}
