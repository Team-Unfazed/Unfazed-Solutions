"use client";

import { motion } from "framer-motion";
import { ScrollTextReveal } from "@/components/shared/ScrollTextReveal";
import { LinkButton, ArrowGlyph } from "@/components/shared/Button";
import { SERVICES, SITE } from "@/lib/constants";
import { transition, VIEWPORT } from "@/lib/animations";

const DETAILS = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { label: "Based in", value: SITE.location },
  { label: "Team", value: "Five engineers, no subcontractors" },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative z-10 py-[var(--spacing-section)]">
      <div className="shell">
        <motion.p
          className="type-mono flex items-center gap-3 text-[color:var(--color-bg-accent)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={transition.enter}
        >
          <span aria-hidden className="inline-block h-px w-8 bg-[color:var(--color-bg-accent)]" />
          Contact
        </motion.p>

        <ScrollTextReveal
          text="Tell us what needs building. We will tell you what it takes, what it costs, and when it goes live."
          className="type-display mt-10 max-w-[16ch] text-[clamp(2.4rem,7.4vw,6.5rem)] text-[color:var(--color-fg)]"
        />

        <motion.div
          className="mt-16 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={transition.enter}
        >
          <LinkButton
            size="lg"
            href={`mailto:${SITE.email}?subject=Project%20enquiry`}
          >
            Start a project
            <ArrowGlyph />
          </LinkButton>
          <LinkButton variant="secondary" size="lg" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </LinkButton>
        </motion.div>

        <motion.dl
          className="mt-20 grid grid-cols-1 border-t border-[color:var(--color-bg-accent)]/50 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ ...transition.enter, delay: 0.1 }}
        >
          {DETAILS.map((detail) => (
            <div
              key={detail.label}
              className="flex flex-col gap-2 border-b border-[color:var(--color-bg-accent)]/50 py-6 sm:border-b-0 sm:pr-8 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-[color:var(--color-bg-accent)]/50 sm:[&:not(:first-child)]:pl-8"
            >
              <dt className="type-mono text-[color:var(--color-bg-accent)]">
                {detail.label}
              </dt>
              <dd className="type-body text-[0.95rem] text-[color:var(--color-fg)]">
                {detail.href ? (
                  <a
                    href={detail.href}
                    className="border-b border-transparent transition-colors duration-300 hover:border-[color:var(--color-fg)]"
                  >
                    {detail.value}
                  </a>
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          ))}
        </motion.dl>

        <p className="type-mono mt-10 text-[color:var(--color-bg-accent)]">
          {SERVICES.length} disciplines · {SITE.location} · Available worldwide
        </p>
      </div>
    </section>
  );
}
