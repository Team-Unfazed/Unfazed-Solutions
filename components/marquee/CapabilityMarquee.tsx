import { SERVICES } from "@/lib/constants";

const ITEMS = SERVICES.map((service) => service.name);

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="type-mono px-6 text-[color:var(--color-accent)]">
            {item}
          </span>
          <span
            aria-hidden
            className="h-1 w-1 rounded-full bg-[color:var(--color-bg-accent)]"
          />
        </span>
      ))}
    </div>
  );
}

/**
 * The seam between the hero and the capabilities section: a single continuous
 * band listing what the studio actually does. Two identical rows translated by
 * -50% give a loop with no visible restart.
 */
export function CapabilityMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-[color:var(--color-bg-accent)]/45 py-4">
      <div className="marquee-track">
        <Row />
        {/* Duplicate exists only to make the loop seamless. */}
        <span aria-hidden className="flex shrink-0">
          <Row />
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[color:var(--color-bg)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[color:var(--color-bg)] to-transparent"
      />
    </div>
  );
}
