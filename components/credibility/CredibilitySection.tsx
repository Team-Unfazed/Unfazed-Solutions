"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AWARDS, CASE_STUDIES, STATS } from "@/lib/constants";
import { transition, VIEWPORT } from "@/lib/animations";
import type { CaseStudy } from "@/lib/types";
import { StatCounter } from "./StatCounter";
import { AwardPanel } from "./AwardPanel";
import { CaseModal } from "./CaseModal";

export function CredibilitySection() {
  const [study, setStudy] = useState<CaseStudy | null>(null);

  const openCase = useCallback((id: string) => {
    setStudy(CASE_STUDIES[id] ?? null);
  }, []);

  const closeCase = useCallback(() => setStudy(null), []);

  const [featured, ...rest] = AWARDS;

  return (
    <section id="record" className="relative z-10 py-[var(--spacing-section)]">
      <div className="shell">
        <SectionHeading
          eyebrow="Record"
          lines={["We don't enter", "to take part."]}
          lead="Three competitions. The largest of them put seventy thousand builders in the field and one team on the stage in New Delhi."
        />

        {/* The numbers carry this section, so they are set at display scale
            rather than tucked into body copy. */}
        {/* Columns are sized to their content rather than split into equal
            thirds — "₹5,00,000" needs roughly four times the width of "#1",
            and forcing them into equal columns collides the two figures. */}
        <dl className="mt-20 flex flex-col border-t border-[color:var(--color-bg-accent)]/50 md:flex-row md:justify-between">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ ...transition.enter, delay: index * 0.1 }}
              className="flex flex-col gap-3 border-b border-[color:var(--color-bg-accent)]/50 py-7 md:border-b-0 md:px-10 md:py-9 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-[color:var(--color-bg-accent)]/50"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <StatCounter
                  display={stat.value}
                  className="type-display-xl block text-[clamp(1.8rem,8vw,4.25rem)] text-[color:var(--color-fg)]"
                />
                <span className="type-mono mt-4 block text-[color:var(--color-accent)]">
                  {stat.label}
                </span>
                <span className="type-body mt-2 block text-[0.85rem]">
                  {stat.note}
                </span>
              </dd>
            </motion.div>
          ))}
        </dl>

        <div className="mt-24 grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AwardPanel
              award={featured}
              featured
              onOpen={openCase}
              priority
            />
          </div>
          <div className="flex flex-col gap-16 lg:col-span-4">
            {rest.map((award) => (
              <AwardPanel key={award.id} award={award} />
            ))}
          </div>
        </div>
      </div>

      <CaseModal study={study} onClose={closeCase} />
    </section>
  );
}
