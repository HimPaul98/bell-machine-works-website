// components/layout/footer.tsx
import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-graphite-900 py-10">
      <Container className="flex flex-col gap-4 text-sm text-steel-200 md:flex-row md:items-center md:justify-between">
        <p>© {year} BELL Machine Works. Gilroy, CA.</p>
        <nav aria-label="Footer" className="flex gap-6">
          <Link
            href="/quote"
            className="rounded-sm hover:text-steel-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            Get a Quote
          </Link>
          <Link
            href="/contact"
            className="rounded-sm hover:text-steel-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 focus-visible:outline-offset-2"
          >
            Contact
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
