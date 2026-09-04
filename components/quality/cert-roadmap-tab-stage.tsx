// components/quality/cert-roadmap-tab-stage.tsx
"use client";

import { TabStage } from "@/components/motion/tab-stage";
import type { qualityContent } from "@/lib/content/quality";

type ProofPoint = (typeof qualityContent)["proofPoints"][number];

export function CertRoadmapTabStage({ proofPoints }: { proofPoints: ProofPoint[] }) {
  return (
    <TabStage
      items={proofPoints}
      getKey={(point) => point.label}
      getLabel={(point) => point.label}
      renderSlide={(point) => (
        <p className="max-w-2xl text-xl font-medium text-steel-100 md:text-2xl">{point.body}</p>
      )}
    />
  );
}
