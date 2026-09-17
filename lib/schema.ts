import { AWARDS, FOUNDERS, SITE } from "./constants";

/**
 * Structured data for the studio, built off the same constants the page
 * renders so the two cannot drift apart.
 *
 * Only what is verified goes in. Deliberately absent, per CONTENT-TODO.md:
 * `foundingDate` (§8, a placeholder year), the second and third `AWARDS`
 * entries (§2, read off photographs), a LinkedIn `sameAs` (no page yet), and
 * any Review / AggregateRating markup — there are no genuine client reviews
 * to mark up.
 */

const ORGANIZATION_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export const SITE_DESCRIPTION =
  "A software studio in Mumbai. SaaS, AI agents, automation and deployed products — built by the team that won India's largest GenAI student challenge.";

export function siteJsonLd() {
  // The Buildathon win is the one award sourced from press coverage.
  const verifiedAward = AWARDS.find((award) => award.id === "buildathon");
  const logo = new URL(SITE.logo, SITE.url).href;
  const telephone = SITE.phone.replace(/\s+/g, "");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORGANIZATION_ID,
        name: SITE.name,
        url: SITE.url,
        logo,
        image: logo,
        description: SITE_DESCRIPTION,
        email: SITE.email,
        telephone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
        ...(verifiedAward
          ? {
              award: `${verifiedAward.placement} — ${verifiedAward.event}, ${verifiedAward.location} (${verifiedAward.year})`,
            }
          : {}),
        sameAs: [SITE.github, SITE.instagram],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: SITE.email,
            telephone,
            availableLanguage: ["en"],
          },
          {
            "@type": "ContactPoint",
            contactType: "sales",
            url: `https://wa.me/${SITE.whatsapp}`,
            availableLanguage: ["en"],
          },
        ],
        member: FOUNDERS.map((person) => ({
          "@type": "Person",
          name: person.name,
          jobTitle: person.role,
        })),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}
