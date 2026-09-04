// lib/content/case-studies.ts
export interface CaseStudySummary {
  slug: string;
  client: string;
  sector: string;
  industrySlug: string;
  material: string;
  summary: string;
  narrative: string;
  specHighlights: { label: string; value: string }[];
  tier: "A" | "B" | "C";
  image: string;
  /** RGB triplet ("R G B", 0-255) sampled from the image's dominant tone,
   *  used to tint the card's elevated glow to match the photo inside. */
  glowColor: string;
}

export const caseStudies: CaseStudySummary[] = [
  {
    slug: "asml",
    client: "ASML",
    sector: "Semiconductor Equipment",
    industrySlug: "semiconductor-equipment",
    material: "Aluminum 6061-T6",
    summary:
      "Alignment brackets and vacuum-sealing components for lithography systems, holding tight tolerances across six sealing locations.",
    narrative:
      "BELL has machined critical alignment brackets and vacuum/gas sealing components for ASML's lithography systems — the machines that print the circuitry on nearly every advanced chip made today. Two separate engagements: a 3F alignment bracket holding precise tube alignment through the optical path, paired with a \"popless\" fusing lid designed to prevent particle contamination in clean-room environments; and an O-ring sealed bracket and plate set with six tight-tolerance sealing locations (down to 0.079\" plate thickness) maintaining vacuum integrity for wafer processing. This is exactly the kind of work where a tolerance miss doesn't mean a bad part — it means particle contamination in an EUV chamber.",
    specHighlights: [
      { label: "Sealing locations", value: "6 tight-tolerance locations" },
      { label: "Plate thickness", value: 'Down to 0.079"' },
      { label: "Material", value: "Aluminum 6061-T6" },
    ],
    tier: "A",
    image: "/images/stock/precision-machined-aluminum-block.jpg",
    glowColor: "203 213 225",
  },
  {
    slug: "stoke-space",
    client: "Stoke Space",
    sector: "Aerospace Components",
    industrySlug: "aerospace-components",
    material: "Delrin & PTFE",
    summary:
      "Tube raceway brackets and cryo-compatible clamp families for a reusable launch vehicle's propulsion system.",
    narrative:
      "BELL machined two related bracket families for Stoke Space's Nova program — a fully reusable medium-lift launch vehicle under development at Stoke's Kent, WA facility. The first: white Delrin top/bottom raceway brackets organizing parallel tube and fluid lines with contoured saddles and structural ribs to prevent deflection under vibration. The second: a six-part black PTFE clamp family (standard, \"special,\" and cryo-inert \"Y-Inert\" variants, 90 pieces total) selected specifically for cryogenic compatibility and chemical inertness for propellant and inerting line management. Both shipped on expedited next-day timelines supporting active propulsion system integration.",
    specHighlights: [
      { label: "Clamp family", value: "6-part family, 90 pieces total" },
      { label: "Turnaround", value: "Expedited next-day" },
      { label: "Material", value: "Delrin 150 & cryo-compatible PTFE" },
    ],
    tier: "A",
    image: "/images/stock/cnc-5-axis-mill-head-coolant.jpg",
    glowColor: "59 130 246",
  },
  {
    slug: "corning",
    client: "Corning Incorporated",
    sector: "Photonics & Optical Systems",
    industrySlug: "photonics-optical-systems",
    material: "Aluminum 6061-T6",
    summary:
      "Optical transition adapter and backing block finished to 32 μin Ra for optical-grade contact surfaces.",
    narrative:
      "An optical transition adapter with 10 tight-tolerance alignment locations, paired with a backing block finished to 32 μin Ra on five surfaces for optical-grade contact — machined for Corning's glass and fiber-optic processing equipment.",
    specHighlights: [
      { label: "Alignment locations", value: "10 tight-tolerance locations" },
      { label: "Surface finish", value: "32 μin Ra on 5 surfaces" },
      { label: "Material", value: "Aluminum 6061-T6" },
    ],
    tier: "A",
    image: "/images/stock/precision-drill-tip-macro.jpg",
    glowColor: "100 116 139",
  },
  {
    slug: "ucsf",
    client: "UCSF Biomedical Engineering",
    sector: "Medical Device R&D",
    industrySlug: "medical-device-rd",
    material: "Polycarbonate",
    summary:
      "Microfluidic manifold halves for organ-on-chip research, holding a 0.4mm micro-channel width.",
    narrative:
      "Two complementary polycarbonate manifold halves for an organ-on-chip microfluidics research device at UCSF's Byers Hall, Mission Bay campus — with a 0.4mm micro-channel width requirement demanding genuine micro-machining precision. Clear polycarbonate was chosen for optical transparency (real-time visualization of live cell cultures under the microscope) and biocompatibility; the bead-blast finish specifically reduces optical distortion without sacrificing microscopy access.",
    specHighlights: [
      { label: "Micro-channel width", value: "0.4mm" },
      { label: "Finish", value: "Bead-blast, optically clear" },
      { label: "Material", value: "Polycarbonate" },
    ],
    tier: "A",
    image: "/images/stock/cnc-lathe-shaft-closeup.jpg",
    glowColor: "191 156 96",
  },
  {
    slug: "amazon-robotics",
    client: "Amazon Robotics",
    sector: "Robotics & Automation",
    industrySlug: "robotics-automation",
    material: "Polycarbonate, white",
    summary:
      "Precision sensor-mounting fixtures with 3mm/4mm hole patterns for vision-system testing at a robotics innovation hub.",
    narrative:
      "A four-piece polycarbonate fixture set with precision 3mm/4mm hole patterns for sensor mounting and calibration, built for Amazon Robotics' 350,000 sq ft Westborough, MA innovation hub — where the company designs and tests the mobile drive units and warehouse robots used across its fulfillment network. Polycarbonate's optical clarity was specifically needed for vision-system testing during development.",
    specHighlights: [
      { label: "Hole patterns", value: "3mm / 4mm precision" },
      { label: "Fixture set", value: "4-piece" },
      { label: "Material", value: "Polycarbonate" },
    ],
    tier: "A",
    image: "/images/stock/milling-cutters-metal-shavings.jpg",
    glowColor: "129 140 248",
  },
  {
    slug: "nvent",
    client: "nVent Data Solutions",
    sector: "Specialty Applications",
    industrySlug: "specialty-applications",
    material: "Delrin 150, black",
    summary:
      "Precision liquid-cooling clamps supplying AI data-center infrastructure on an expedited production ramp.",
    narrative:
      "Precision saddle-style Delrin clamps (9 sets) securing coolant distribution piping at nVent's new 117,000 sq ft Blaine, MN facility — built to supply liquid cooling systems for NVIDIA GB200-class AI server infrastructure, delivered on a 5-day expedited turnaround to support a fast production ramp-up.",
    specHighlights: [
      { label: "Clamp sets", value: "9 sets, saddle-style" },
      { label: "Turnaround", value: "5-day expedited" },
      { label: "Material", value: "Delrin 150" },
    ],
    tier: "A",
    image: "/images/stock/lathe-turning-metal-macro.jpg",
    glowColor: "234 88 12",
  },
];
