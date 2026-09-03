// components/layout/footer.tsx
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-graphite-900 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-steel-200 md:flex-row md:items-center md:justify-between">
        <p>© {year} BELL Machine Works. Gilroy, CA.</p>
        <nav className="flex gap-6">
          <Link href="/quote" className="hover:text-steel-100">
            Get a Quote
          </Link>
          <Link href="/contact" className="hover:text-steel-100">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
