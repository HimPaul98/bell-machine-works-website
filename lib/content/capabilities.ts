export const capabilityHighlights = [
  { label: "Tolerance", value: '±0.0002" on critical features' },
  { label: "Micro-features", value: 'Down to < Ø0.01"' },
  { label: "Surface finish", value: "To 32 μin Ra on optical-grade contact surfaces" },
  { label: "Work envelope", value: '8" × 6" × 3" per setup' },
];

export interface ProcessDetail {
  name: string;
  status: string;
  href: string;
  slug: string;
  summary: string;
  specs: { label: string; value: string }[];
  applications: string[];
}

export const processes: ProcessDetail[] = [
  {
    name: "5-Axis CNC Milling",
    status: "In-house, confirmed",
    href: "/capabilities/5-axis-milling",
    slug: "5-axis-milling",
    summary:
      'Simultaneous 5-axis milling for complex geometries that would otherwise need multiple setups — held to ±0.0002" on critical features in a single work-holding.',
    specs: capabilityHighlights,
    applications: [
      "Semiconductor alignment brackets and vacuum-sealing components",
      "Aerospace collar/clamping assemblies and cryo-compatible propulsion tooling",
      "Optical-grade alignment fixtures for photonics equipment",
      "Sub-millimeter medical device and biomedical research tooling",
    ],
  },
];

export interface MaterialFamily {
  name: string;
  slug: string;
  examples: string;
  href: string;
  summary: string;
  applications: string[];
}

export const materialFamilies: MaterialFamily[] = [
  {
    name: "Titanium & Aerospace Alloys",
    slug: "titanium-aerospace-alloys",
    examples: "Titanium Grade 5, Inconel 625, Inconel 718",
    href: "/capabilities/materials/titanium-aerospace-alloys",
    summary:
      "Titanium Grade 5 and Inconel 625/718 machined to flight-hardware tolerances, including cryo-compatible tooling for reusable launch vehicle propulsion systems.",
    applications: [
      "Collar and clamping assemblies",
      "DO-160 environmental test fixtures",
      "Non-marring components",
      "Cryo-compatible propulsion tooling",
    ],
  },
  {
    name: "Stainless Steels",
    slug: "stainless-steels",
    examples: "Including 303, as used in production tooling and fixtures",
    href: "/capabilities/materials/stainless-steels",
    summary:
      "303 stainless steel machined for production tooling, fixtures, and medical device R&D components that need corrosion resistance without titanium's cost.",
    applications: [
      "Production tooling and fixtures",
      "Semiconductor equipment sealing components",
      "Medical device trim jigs and disassembly fixtures",
    ],
  },
  {
    name: "Non-Ferrous",
    slug: "non-ferrous",
    examples: "Aluminum 6061-T6, 7075, Copper C110, and other alloys by request",
    href: "/capabilities/materials/non-ferrous",
    summary:
      "6061-T6 and 7075 aluminum plus Copper C110 for lightweight structural parts, thermal management, and semiconductor equipment builds — the highest-volume material family across BELL's semiconductor and robotics work.",
    applications: [
      "Semiconductor alignment brackets and thermal management assemblies",
      "Robotics sensor-mounting and calibration fixtures",
      "AI data-center liquid-cooling clamps",
      "Aerospace airframe components (2024 alloy)",
    ],
  },
  {
    name: "Engineering Plastics",
    slug: "engineering-plastics",
    examples: "PEEK, Delrin, PTFE, UHMW PE, and other engineering plastics by request",
    href: "/capabilities/materials/engineering-plastics",
    summary:
      "PEEK, Delrin, PTFE, and UHMW PE for wear-resistant, non-marring, and optical-grade components — machined to the same tolerance standard as BELL's metals.",
    applications: [
      "Optical alignment fixtures (PTFE)",
      "Wear-resistant automation components (UHMW PE)",
      "Robotics sensor housings (polycarbonate)",
      "Non-marring production tooling",
    ],
  },
];
