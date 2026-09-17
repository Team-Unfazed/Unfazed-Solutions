import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { SITE } from "@/lib/constants";
import { SITE_DESCRIPTION, siteJsonLd } from "@/lib/schema";

/**
 * One superfamily, used at two extremes of its width axis: Archivo pushed wide
 * for display, and set normal for body copy. The contrast between the two is
 * the typographic idea — the same face under different pressure.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/** Utility face for eyebrows, meta and data — the team's own vernacular. */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const NO_SCRIPT_CSS = `
[data-intro-loader]{display:none!important}
[style*="opacity:0"]{opacity:1!important;transform:none!important}
[data-prearm]{opacity:1!important}
[data-reveal-line],[style*="scaleX(0)"]{transform:none!important}
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Software studio, Mumbai`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE.name,
  // The canonical is set per route (see app/page.tsx), not here: metadata in
  // the root layout is inherited, and every page would otherwise claim "/".
  keywords: [
    "software agency India",
    "AI automation",
    "AI agents",
    "SaaS development",
    "Next.js studio Mumbai",
  ],
  openGraph: {
    title: `${SITE.name} — Software studio, Mumbai`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: SITE.name,
    locale: "en_IN",
  },
  // The image for both cards comes from app/opengraph-image.tsx.
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Software studio, Mumbai`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <head>
        {/* Every entrance on the page starts from an inline hidden state that
            JavaScript resolves. Without JavaScript nothing would ever resolve
            them, so this puts the page in its finished state instead. */}
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
      </head>
      <body>
        <script
          type="application/ld+json"
          // "<" is escaped so no string in the data can close the script tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll />
        <div className="page-rules" aria-hidden />
        <div className="grain" aria-hidden />
        <a
          href="#content"
          className="type-mono sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-[color:var(--color-cta)] focus:px-5 focus:py-3 focus:text-[color:var(--color-cta-fg)]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
