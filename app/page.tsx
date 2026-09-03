// app/page.tsx
import { GlassPanel } from "@/components/ui/glass-panel";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-graphite-950 p-8">
      <GlassPanel className="p-8">
        <p className="text-steel-100">Glass panel smoke test</p>
      </GlassPanel>
    </main>
  );
}
