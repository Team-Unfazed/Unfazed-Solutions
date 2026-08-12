"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { HeroField } from "./HeroField";

/**
 * WebGL layer behind the hero wordmark.
 *
 * Rendering is paused whenever the hero scrolls out of view, so the GPU is
 * idle for the rest of the page. Reduced-motion users get nothing at all.
 */
export function HeroCanvas() {
  const reduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [pointerActive, setPointerActive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "10% 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const enable = () => setPointerActive(true);
    const disable = () => setPointerActive(false);
    window.addEventListener("pointermove", enable, { once: true });
    window.addEventListener("pointerleave", disable);
    return () => {
      window.removeEventListener("pointermove", enable);
      window.removeEventListener("pointerleave", disable);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(240,240,240,0.06),transparent_62%)]"
      />
    );
  }

  return (
    <div ref={hostRef} aria-hidden className="absolute inset-0">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 34], fov: 45, near: 0.1, far: 120 }}
      >
        <HeroField active={pointerActive} />
      </Canvas>
    </div>
  );
}
