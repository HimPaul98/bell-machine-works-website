// components/motion/eye-level-paragraph.tsx
"use client";

import type { ReactNode } from "react";
import { useEyeLevelOpacity } from "@/lib/motion/use-eye-level-opacity";

export function EyeLevelParagraph({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, opacity } = useEyeLevelOpacity<HTMLParagraphElement>();
  return (
    <p
      ref={ref}
      style={{ opacity }}
      className={`transition-opacity duration-300 ${className}`}
    >
      {children}
    </p>
  );
}
