export const capabilityHighlights = [
  { label: "Tolerance", value: '±0.0002" on critical features' },
  { label: "Micro-features", value: 'Down to < Ø0.01"' },
  { label: "Surface finish", value: "To 32 μin Ra on optical-grade contact surfaces" },
  { label: "Work envelope", value: '8" × 6" × 3" per setup' },
];

export const processes = [
  {
    name: "5-Axis CNC Milling",
    status: "In-house, confirmed",
    href: "/capabilities/5-axis-milling",
  },
];

export interface MaterialFamily {
  name: string;
  examples: string;
  href: string;
}

export const materialFamilies: MaterialFamily[] = [
  {
    name: "Titanium & Aerospace Alloys",
    examples: "Titanium Grade 5, Inconel 625, Inconel 718",
    href: "/capabilities/materials/titanium-aerospace-alloys",
  },
  {
    name: "Stainless Steels",
    examples: "Including 303, as used in production tooling and fixtures",
    href: "/capabilities/materials/stainless-steels",
  },
  {
    name: "Non-Ferrous",
    examples: "Aluminum 6061-T6, 7075, Copper C110, and other alloys by request",
    href: "/capabilities/materials/non-ferrous",
  },
  {
    name: "Engineering Plastics",
    examples: "PEEK, Delrin, PTFE, UHMW PE, and other engineering plastics by request",
    href: "/capabilities/materials/engineering-plastics",
  },
];
