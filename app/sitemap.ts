import type { MetadataRoute } from "next";
import { materialFamilies, processes } from "@/lib/content/capabilities";
import { industries } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/case-studies";

const SITE_URL = "https://bellmachineworks.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/capabilities",
    "/industries",
    "/work",
    "/quote",
    "/about",
    "/quality",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const processRoutes: MetadataRoute.Sitemap = processes.map((process) => ({
    url: `${SITE_URL}${process.href}`,
    lastModified: new Date(),
  }));

  const materialRoutes: MetadataRoute.Sitemap = materialFamilies.map((family) => ({
    url: `${SITE_URL}${family.href}`,
    lastModified: new Date(),
  }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${SITE_URL}/industries/${industry.slug}`,
    lastModified: new Date(),
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: `${SITE_URL}/work/${caseStudy.slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...processRoutes,
    ...materialRoutes,
    ...industryRoutes,
    ...caseStudyRoutes,
  ];
}
