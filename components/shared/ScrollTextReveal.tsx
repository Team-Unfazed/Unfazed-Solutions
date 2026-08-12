"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollTextRevealProps {
  text: string;
  className?: string;
}

/**
 * The page's one scrub-linked sequence: the line resolves word by word as the
 * reader scrolls through it, rather than firing all at once on entry.
 *
 * Animating opacity keeps this on the compositor — the words are laid out once
 * and never re-measured while the scroll runs.
 */
export function ScrollTextReveal({ text, className }: ScrollTextRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.fromTo(
        node.querySelectorAll("[data-word]"),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: node,
            start: "top 82%",
            end: "bottom 58%",
            scrub: 0.6,
          },
        },
      );
    }, node);

    return () => context.revert();
  }, [reduceMotion, text]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        // The separating space sits outside the animated span so words still
        // wrap naturally and each box stays tight around its glyphs.
        <span key={`${word}-${index}`}>
          <span
            data-word
            className="inline-block"
            style={reduceMotion ? undefined : { opacity: 0.16 }}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}
