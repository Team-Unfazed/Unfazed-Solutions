import type { MetadataRoute } from "next";
import { CASE_STUDIES, SITE } from "@/lib/constants";

/**
 * Bump when a page's content changes in a way worth re-crawling. A fixed date
 * rather than `new Date()`: a lastmod that moves on every deploy teaches a
 * crawler to ignore it.
 */
const LAST_MODIFIED = "2026-09-17";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, lastModified: LAST_MODIFIED },
    ...Object.keys(CASE_STUDIES).map((id) => ({
      url: `${SITE.url}/work/${id}`,
      lastModified: LAST_MODIFIED,
    })),
  ];
}
