const SITE_URL = "https://bellmachineworks.com";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BELL Machine Works",
  url: SITE_URL,
  logo: `${SITE_URL}/images/brand/bell-logo-white.png`,
  description:
    "Precision CNC machining shop specializing in simultaneous 5-axis milling of metals and engineering plastics for aerospace, space, semiconductor, and robotics teams.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gilroy",
    addressRegion: "CA",
    addressCountry: "US",
  },
  email: "team@bellmachineworks.com",
};

export function personSchema({
  name,
  jobTitle,
  description,
  url,
}: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    url,
    worksFor: {
      "@type": "Organization",
      name: organizationSchema.name,
      url: organizationSchema.url,
    },
  };
}

export function serviceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: organizationSchema.name,
      url: organizationSchema.url,
    },
    areaServed: "US",
  };
}
