import { quoteContent } from "@/lib/content/quote";

export const contactContent = {
  email: quoteContent.fallbackContactEmail,
  location: "Gilroy, CA",
  slaStatement: quoteContent.slaStatement,
  channels: [
    {
      label: "Have a print or model ready?",
      body: "The fastest path to a number is the RFQ form — upload your drawing and we'll follow up with a quote.",
      ctaLabel: "Get a Quote",
      ctaHref: "/quote",
    },
    {
      label: "Everything else",
      body: "Questions about capabilities, materials, certifications, or an existing order — email us directly and a real person will get back to you.",
      ctaLabel: `Email ${quoteContent.fallbackContactEmail}`,
      ctaHref: `mailto:${quoteContent.fallbackContactEmail}`,
    },
  ],
};
