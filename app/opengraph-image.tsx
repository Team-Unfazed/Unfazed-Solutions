import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

/**
 * The card a link to the site unfurls into. Type only, in the site's own
 * palette — no photography, so it never goes stale and claims nothing the page
 * does not. Next serves it as both og:image and twitter:image.
 */

export const alt = `${SITE.name} — a software studio in ${SITE.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8a8a8a",
            borderBottom: "1px solid #434343",
            paddingBottom: 24,
          }}
        >
          <span>Software studio</span>
          <span>{SITE.location}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 168,
              fontWeight: 700,
              letterSpacing: 8,
              lineHeight: 1,
            }}
          >
            {SITE.wordmark}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 30,
              letterSpacing: 12,
              color: "#8a8a8a",
              alignSelf: "flex-end",
            }}
          >
            {SITE.suffix}
          </div>
        </div>

        <div style={{ fontSize: 30, color: "#d0d0d0" }}>
          SaaS, AI agents, automation and deployed products.
        </div>
      </div>
    ),
    size,
  );
}
