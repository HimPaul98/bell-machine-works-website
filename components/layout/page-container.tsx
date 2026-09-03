// components/layout/page-container.tsx
import { ReactNode } from "react";
import { Container } from "@/components/layout/container";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <Container className={`py-16 ${className}`}>{children}</Container>;
}
