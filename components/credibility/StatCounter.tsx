"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

/** Split "₹5,00,000" into "₹", 500000, "" so the digits can be animated. */
function parse(display: string) {
  const match = display.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    value: Number(match[2].replace(/,/g, "")),
    suffix: match[3],
  };
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

interface StatCounterProps {
  display: string;
  className?: string;
}

/**
 * Counts up to the figure when it scrolls into view. The digits are written
 * straight to the node's text content, so a 1.6s count costs zero React
 * renders and cannot fight anything else on the page for frames.
 */
export function StatCounter({ display, className }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const parsed = parse(display);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || !parsed) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      node.textContent = display;
      return;
    }

    const duration = 1600;
    // The clock starts on the first animation frame, not on `performance.now()`
    // here: a rAF callback reports the time the frame *began*, which can
    // precede this line and would otherwise make the first `t` negative — and
    // a negative `t` sends the expo curve below zero, printing "-8,959+".
    let start: number | null = null;
    let frame = 0;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      const current = Math.round(parsed.value * easeOutExpo(t));
      node.textContent = `${parsed.prefix}${current.toLocaleString("en-IN")}${parsed.suffix}`;
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `parsed` is derived from `display` on every render; depending on the
    // object itself would restart the count whenever the parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, display]);

  if (!parsed) {
    return <span className={className}>{display}</span>;
  }

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {`${parsed.prefix}0${parsed.suffix}`}
    </span>
  );
}
