export interface Industry {
  slug: string;
  name: string;
  tagline: string;
  body: string;
  materials: string[];
  caseStudySlug: string;
  image: string;
}

export const industries: Industry[] = [
  {
    slug: "semiconductor-equipment",
    name: "Semiconductor Equipment",
    tagline:
      "Sub-micron alignment brackets and vacuum-sealing components for semiconductor lithography systems.",
    body: "BELL machines alignment brackets, vacuum/gas sealing components, thermal management assemblies, and multi-point mounting fixtures for semiconductor equipment builders — holding tolerances to ±0.0002\" on critical features, with surface finishes to 32 μin Ra where optical-grade contact surfaces are required. Every part ships with CMM inspection data and full material certification.",
    materials: ["Aluminum 6061-T6", "Copper C110", "Stainless Steel 303"],
    caseStudySlug: "asml",
    image: "/images/stock/semiconductor-cleanroom-wafer-handling.jpg",
  },
  {
    slug: "aerospace-components",
    name: "Aerospace Components",
    tagline: "Flight-hardware-grade CNC machining, from prototype to production run.",
    body: "BELL machines collar and clamping assemblies, multi-piece cabin furniture sets, DO-160 environmental test fixtures, and non-marring components in titanium Grade 5 and Inconel 625/718, plus cryo-compatible tooling for reusable launch vehicle propulsion systems. Standard lead time is 2 weeks; rush turnaround is available in 24 hours.",
    materials: ["Titanium Grade 5", "Inconel 625", "Inconel 718", "Aluminum 2024"],
    caseStudySlug: "stoke-space",
    image: "/images/stock/aerospace-turbine-blade-closeup.jpg",
  },
  {
    slug: "robotics-automation",
    name: "Robotics & Automation",
    tagline:
      "Precision fixtures and wear components for warehouse robotics and automated production lines.",
    body: "BELL machines sensor-mounting and calibration fixtures for robotics R&D, plus wear-resistant components for automated material-handling systems — built to hold precise hole patterns for vision-system testing and to survive continuous-duty industrial automation environments.",
    materials: ["Polycarbonate", "UHMW PE"],
    caseStudySlug: "amazon-robotics",
    image: "/images/stock/robotics-arm-production-line.jpg",
  },
  {
    slug: "photonics-optical-systems",
    name: "Photonics & Optical Systems",
    tagline: "Optical-grade alignment components finished to 32 μin Ra.",
    body: "BELL machines optical transition adapters, backing blocks, and precision alignment fixtures for glass, fiber-optic, and laser-crystal processing equipment — finished to 32 μin Ra on optical-grade contact surfaces, with tolerances that hold true across ten or more alignment locations on a single part.",
    materials: ["Aluminum 6061-T6", "PTFE"],
    caseStudySlug: "corning",
    image: "/images/stock/photonics-fiber-optic-light.jpg",
  },
  {
    slug: "medical-device-rd",
    name: "Medical Device R&D",
    tagline: "Sub-millimeter precision for medical device and biomedical research tooling.",
    body: "BELL machines trim jigs, disassembly fixtures, and microfluidic manifolds for medical device and biopharmaceutical R&D — including sub-millimeter micro-channel features for organ-on-chip research and material-certified tooling for regulated pharmaceutical teardown analysis.",
    materials: ["Polycarbonate", "Stainless Steel 303"],
    caseStudySlug: "ucsf",
    image: "/images/stock/medical-device-lab-instrument.jpg",
  },
  {
    slug: "specialty-applications",
    name: "Specialty Applications",
    tagline:
      "Precision components for AI data-center infrastructure, packaging automation, and beyond.",
    body: "BELL machines precision clamps, wear blocks, and custom fixtures for applications outside its five core verticals — including liquid-cooling clamps for AI data-center infrastructure and wear-resistant components for automated packaging equipment, often on expedited production-ramp timelines.",
    materials: ["Delrin", "UHMW PE"],
    caseStudySlug: "nvent",
    image: "/images/stock/ai-datacenter-server-racks.jpg",
  },
];
