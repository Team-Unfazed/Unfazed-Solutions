import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { SITE } from "@/lib/constants";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://unfazedsolution.com"),
  title: {
    default: "Unfazed Solution — Software studio, Mumbai",
    template: "%s — Unfazed Solution",
  },
  description:
    "A software studio in Mumbai. SaaS, AI agents, automation and deployed products — built by the team that won India's largest GenAI student challenge.",
  keywords: [
    "software agency India",
    "AI automation",
    "AI agents",
    "SaaS development",
    "Next.js studio Mumbai",
  ],
  openGraph: {
    title: "Unfazed Solution — Software studio, Mumbai",
    description:
      "Deadlines move. Scope grows. Models change. The build ships anyway.",
    type: "website",
    siteName: SITE.name,
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
      <body>
        <SmoothScroll />
        <div className="page-rules" aria-hidden />
        <div className="grain" aria-hidden />
        <a
          href="#capabilities"
          className="type-mono sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-[color:var(--color-cta)] focus:px-5 focus:py-3 focus:text-[color:var(--color-cta-fg)]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
