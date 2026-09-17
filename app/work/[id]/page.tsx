import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowGlyph } from "@/components/shared/Button";
import { CASE_STUDIES, SITE } from "@/lib/constants";

/**
 * A case study at its own URL. On the home page the same content opens in a
 * modal, which is the right reading experience and the wrong place for the
 * only copy to live: a modal that mounts on click is not in the HTML, so
 * nothing that reads the page without clicking — a crawler, a link preview —
 * ever saw the case or the press coverage behind it. This page is that content,
 * server-rendered, and the panel on the home page links here.
 *
 * Everything on it comes from CASE_STUDIES. Nothing is added.
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const study = CASE_STUDIES[id];
  if (!study) return {};

  const title = `${study.name} — case study`;
  const path = `/work/${study.id}`;

  return {
    title,
    description: study.tagline,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${SITE.name}`,
      description: study.tagline,
      type: "article",
      url: path,
      siteName: SITE.name,
      locale: "en_IN",
      images: [{ url: study.image, alt: caseImageAlt(study.name) }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE.name}`,
      description: study.tagline,
      images: [study.image],
    },
  };
}

function caseImageAlt(name: string) {
  return `Team Unfazed with the ${name} prize cheque`;
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { id } = await params;
  const study = CASE_STUDIES[id];
  if (!study) notFound();

  return (
    <>
      <header className="shell relative z-10 flex items-center justify-between py-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`${SITE.name} — home`}
        >
          <span className="relative block h-7 w-9">
            <Image
              src={SITE.logo}
              alt=""
              fill
              sizes="36px"
              className="object-contain"
            />
          </span>
          <span className="type-mono hidden text-[color:var(--color-fg)] min-[420px]:inline">
            {SITE.name}
          </span>
        </Link>
        <Link
          href="/#record"
          className="type-mono text-[color:var(--color-bg-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)]"
        >
          Back to the record
        </Link>
      </header>

      <main
        id="content"
        tabIndex={-1}
        className="relative z-10 pb-[var(--spacing-section)] outline-none"
      >
        <article className="shell">
          <p className="type-mono mt-10 text-[color:var(--color-bg-accent)]">
            Case file
          </p>
          <h1 className="type-display-xl mt-5 text-[clamp(2.4rem,6vw,4.5rem)]">
            {study.name}
          </h1>
          <p className="type-body mt-5 max-w-[52ch] text-[clamp(1rem,1.3vw,1.15rem)] text-[color:var(--color-fg)]">
            {study.tagline}
          </p>

          <div className="relative mt-12 aspect-[16/10] w-full max-w-[64rem] overflow-hidden rounded-[var(--radius-card)] bg-black">
            <Image
              src={study.image}
              alt={caseImageAlt(study.name)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="object-contain"
            />
          </div>

          <dl className="mt-12 grid max-w-[64rem] grid-cols-1 border-t border-[color:var(--color-bg-accent)]/50 sm:grid-cols-2">
            {study.facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-1 border-b border-[color:var(--color-bg-accent)]/50 py-4 sm:odd:pr-8 sm:even:pl-8"
              >
                <dt className="type-mono text-[color:var(--color-bg-accent)]">
                  {fact.label}
                </dt>
                <dd className="type-body text-[0.95rem] text-[color:var(--color-fg)]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex max-w-[62ch] flex-col gap-5">
            {study.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="type-body">
                {paragraph}
              </p>
            ))}
          </div>

          <a
            href={study.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 border-b border-[color:var(--color-bg-accent)] pb-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-[color:var(--color-accent)] transition-colors duration-300 hover:border-[color:var(--color-fg)] hover:text-[color:var(--color-fg)]"
          >
            {study.sourceLabel}
            <ArrowGlyph />
          </a>
        </article>
      </main>

      <footer className="relative z-10 border-t border-[color:var(--color-bg-accent)]/50">
        <div className="shell flex flex-col gap-3 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-mono text-[color:var(--color-bg-accent)]">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <nav aria-label="Site" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/#work"
              className="type-mono text-[color:var(--color-bg-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)]"
            >
              Selected work
            </Link>
            <Link
              href="/#contact"
              className="type-mono text-[color:var(--color-bg-accent)] transition-colors duration-300 hover:text-[color:var(--color-fg)]"
            >
              Start a project
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
