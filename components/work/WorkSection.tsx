"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { SELECTED_WORK } from "@/lib/constants";
import { WorkCard } from "./WorkCard";

/** How many of the twelve have a public URL on them. Counted, never typed. */
const LIVE = SELECTED_WORK.filter((item) => item.domain).length;

/**
 * The work itself, named and linkable.
 *
 * It sits directly under the record for a reason: the section above is one
 * competition and a stage in New Delhi, which is a claim a visitor has to take
 * on trust. This one is twelve URLs they can open in the next ten seconds.
 */
export function WorkSection() {
  return (
    <section id="work" className="relative z-10 py-[var(--spacing-section)]">
      <div className="shell">
        {/* Stacked rather than set beside a paragraph, as Record is: the second
            line is the longest display line on the page and it needs the full
            shell to stay on one line at the top of the clamp. */}
        <SectionHeading
          eyebrow="Selected work"
          lines={["We don't just pitch.", "We ship, and it stays live."]}
          lead="Twelve products across healthcare, e-commerce, SaaS and travel — built, deployed, and still running."
        />

        {/* Two columns, and only two. The cards carry a preview each and a
            third column would shrink both the preview and the name past the
            point where either is worth showing. */}
        <ul className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-2 md:gap-5">
          {SELECTED_WORK.map((item, index) => (
            <WorkCard key={item.id} item={item} column={index % 2} />
          ))}
        </ul>

        <div className="mt-10">
          <hr className="hairline" />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <p className="type-mono text-[color:var(--color-bg-accent)]">
              {SELECTED_WORK.length} products shipped
            </p>
            <p className="type-mono text-[color:var(--color-bg-accent)]">
              {LIVE} open in a new tab
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
