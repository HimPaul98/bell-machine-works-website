import { Reveal } from "@/components/motion/reveal";
import { identityStatement } from "@/lib/content/home";

export function IdentityStatementSection() {
  return (
    <Reveal>
      <p className="text-justify text-xl font-medium leading-relaxed text-steel-100 md:text-2xl">
        {identityStatement.before}
        <strong className="font-semibold text-accent-400">{identityStatement.highlight1}</strong>
        {identityStatement.middle}
        <strong className="font-semibold text-accent-400">{identityStatement.highlight2}</strong>
        {identityStatement.after}
      </p>
    </Reveal>
  );
}
