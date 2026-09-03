// components/layout/container.tsx
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-6xl px-4 ${className}`}>{children}</div>
  );
}
