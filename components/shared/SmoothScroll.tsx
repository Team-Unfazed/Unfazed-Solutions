"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Site-wide inertial scrolling.
 *
 * Lenis owns the scroll position; GSAP's ticker drives its rAF loop so the two
 * never run competing frame loops, and ScrollTrigger is updated from Lenis's
 * scroll event so scroll-driven sequences stay in lockstep with the eased
 * position rather than the raw one.
 *
 * When the user asks for reduced motion we skip all of it and let the browser
 * scroll natively.
 */
export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      // Expo-out: the scroll keeps travelling after the wheel stops, then
      // settles rather than snapping.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    // Development-only handle so the scroller can be driven from the console
    // or a headless browser. Stripped from production builds.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduceMotion]);

  return null;
}
