import { Reveal } from "@/components/motion/reveal";
import { identityStatement } from "@/lib/content/home";

export function IdentityStatementSection() {
  return (
    <Reveal>
      <p className="max-w-3xl text-xl font-medium leading-relaxed text-steel-100 md:text-2xl">
        {identityStatement}
      </p>
    </Reveal>
  );
}
