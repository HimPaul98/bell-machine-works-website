export interface CaseStudySummary {
  slug: string;
  client: string;
  sector: string;
  material: string;
  summary: string;
  tier: "A" | "B" | "C";
}

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "asml",
    client: "ASML",
    sector: "Semiconductor Equipment",
    material: "Aluminum 6061-T6",
    summary:
      "Alignment brackets and vacuum-sealing components for lithography systems, holding tight tolerances across six sealing locations.",
    tier: "A",
  },
  {
    slug: "stoke-space",
    client: "Stoke Space",
    sector: "Aerospace",
    material: "Delrin & PTFE",
    summary:
      "Tube raceway brackets and cryo-compatible clamp families for a reusable launch vehicle's propulsion system.",
    tier: "A",
  },
  {
    slug: "corning",
    client: "Corning Incorporated",
    sector: "Photonics & Optical Systems",
    material: "Aluminum 6061-T6",
    summary:
      "Optical transition adapter and backing block finished to 32 μin Ra for optical-grade contact surfaces.",
    tier: "A",
  },
  {
    slug: "ucsf",
    client: "UCSF Biomedical Engineering",
    sector: "Medical Device R&D",
    material: "Polycarbonate",
    summary:
      "Microfluidic manifold halves for organ-on-chip research, holding a 0.4mm micro-channel width.",
    tier: "A",
  },
];
