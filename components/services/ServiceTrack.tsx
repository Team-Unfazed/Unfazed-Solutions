"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SERVICES } from "@/lib/constants";
import { ServiceCard } from "./ServiceCard";

const COUNT = SERVICES.length;

/* --------------------------------------------------------------------------
   Geometry. Distances are in "cards" — one unit is one step along the track —
   and converted to pixels against the measured card width, so the arc keeps its
   proportions from a phone to a wide monitor.
   -------------------------------------------------------------------------- */

/** Card centres, as a fraction of one card's width. Below 1 they overlap. */
const SPACING_RATIO = 0.68;
/** Degrees of turn per card away from the middle, before it saturates. */
const ARC_DEG = 30;
const ARC_SATURATES_AT = 2;
/** Pixels pushed back per card away from the middle, before it saturates. */
const DEPTH = 118;
const DEPTH_SATURATES_AT = 2.8;
/** How far a held card comes toward the reader. */
const LIFT = 118;
/** Beyond this the card is fully dark and stops taking the pointer. */
const FADE_OVER = 3.9;

/* --------------------------------------------------------------------------
   Motion.
   -------------------------------------------------------------------------- */

/** Cards per second when nothing is asking it to do anything. */
const DRIFT = 0.14;
/** Cards per second with the cursor pinned to the very edge of the track. */
const MAX_STEER = 3.6;
/** Fraction of the half-width in the middle that steers nothing at all. */
const DEAD_ZONE = 0.16;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Signed distance from the middle of the track, wrapped onto the ring. */
function ringDelta(raw: number) {
  const wrapped = ((raw % COUNT) + COUNT) % COUNT;
  return wrapped > COUNT / 2 ? wrapped - COUNT : wrapped;
}

/**
 * Thirteen disciplines on one turning track.
 *
 * The track is a ring, not a list with two ends — it drifts on its own, the
 * cursor steers it, and a drag scrubs it. What it never does is stop being a
 * single object: every card is drawn from one number, the offset, so there is
 * no second piece of state anywhere that can disagree about where the track is.
 *
 * Steering is squared rather than linear. A cursor resting near the middle does
 * almost nothing and the last fifth of the travel holds most of the speed, so
 * the track answers where the reader is going instead of twitching under a
 * pointer that is only passing through.
 *
 * The layout is written straight to the DOM from one animation frame. Thirteen
 * cards re-rendering through React sixty times a second would be the most
 * expensive thing on the page by a wide margin.
 */
export function ServiceTrack() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /** Where the track is, in cards. The single source of truth. */
  const offset = useRef(0);
  const velocity = useRef(0);
  /** Per-card ease toward held: straightened, lifted, turned over. */
  const focus = useRef<number[]>(new Array(COUNT).fill(0));
  /** Normalised cursor position across the track, -1 to 1. */
  const steer = useRef(0);
  const pointerInside = useRef(false);
  /** The card being held. Mirrored into state, because the turn is CSS. */
  const active = useRef<number | null>(null);
  /** True when a click or a focus put it there, so the pointer may not take it. */
  const sticky = useRef(false);
  const snapTo = useRef<number | null>(null);
  const spacing = useRef(320);
  const drag = useRef({
    active: false,
    moved: false,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });

  const [turned, setTurned] = useState<number | null>(null);

  const setActive = useCallback((index: number | null, pin = false) => {
    active.current = index;
    sticky.current = index === null ? false : pin;
    setTurned(index);
  }, []);

  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (card) spacing.current = card.offsetWidth * SPACING_RATIO;
    };
    measure();

    const resize = new ResizeObserver(measure);
    resize.observe(viewport);

    // The GPU has nothing to do here once the track is off screen.
    let visible = true;
    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "15% 0px" },
    );
    seen.observe(viewport);

    const steerVelocity = () => {
      if (!pointerInside.current) return 0;
      const s = steer.current;
      const away = Math.abs(s);
      if (away <= DEAD_ZONE) return 0;
      // Squared past the dead zone: gentle through the middle, quick at the rim.
      const ramp = (away - DEAD_ZONE) / (1 - DEAD_ZONE);
      return Math.sign(s) * ramp * ramp * MAX_STEER;
    };

    const draw = () => {
      const step = spacing.current;

      for (let i = 0; i < COUNT; i += 1) {
        const node = cardRefs.current[i];
        if (!node) continue;

        const d = ringDelta(i - offset.current);
        const away = Math.abs(d);
        const f = focus.current[i];
        const side = Math.sign(d);

        // A held card is straightened out of the arc and brought forward on the
        // same eased value, so it arrives upright exactly as it arrives in
        // front — and the turn is timed to start on that arrival.
        const turn =
          -side * Math.min(away, ARC_SATURATES_AT) * ARC_DEG * (1 - f);
        const depth =
          -Math.min(away, DEPTH_SATURATES_AT) * DEPTH * (1 - f) + LIFT * f;

        const dim = clamp(1 - away / FADE_OVER, 0, 1);
        const opacity = dim + (1 - dim) * f;

        node.style.transform =
          `translate3d(calc(-50% + ${(d * step).toFixed(2)}px), 0, ` +
          `${depth.toFixed(2)}px) rotateY(${turn.toFixed(2)}deg)`;
        node.style.opacity = opacity.toFixed(3);
        node.style.zIndex = String(Math.round(100 - away * 10 + f * 60));
        // Cards this far out are dark enough to be invisible. Letting them keep
        // the pointer would mean hovering nothing at all.
        node.style.pointerEvents = opacity < 0.18 ? "none" : "auto";
      }
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;

      // Framerate-independent easing, so a dropped frame costs distance rather
      // than changing the shape of the curve.
      const focusRate = 1 - Math.pow(0.0009, dt);
      for (let i = 0; i < COUNT; i += 1) {
        const target = active.current === i ? 1 : 0;
        focus.current[i] += (target - focus.current[i]) * focusRate;
      }

      if (drag.current.active) {
        velocity.current = 0;
      } else if (snapTo.current !== null) {
        // Keyboard and focus put the track somewhere specific. It takes the
        // short way round, because the track is a ring.
        const delta = ringDelta(snapTo.current - offset.current);
        if (Math.abs(delta) < 0.002) {
          snapTo.current = null;
          velocity.current = 0;
        } else {
          offset.current += delta * (1 - Math.pow(0.004, dt));
        }
      } else {
        // A held card stops the track. Reading it is the point of holding it.
        const wants = active.current !== null ? 0 : DRIFT + steerVelocity();
        velocity.current += (wants - velocity.current) * (1 - Math.pow(0.02, dt));
        offset.current += velocity.current * dt;
      }

      offset.current = ((offset.current % COUNT) + COUNT) % COUNT;
      draw();
    };

    raf = requestAnimationFrame(frame);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
    };
  }, []);

  /* ---------------------------------------------------------------------- */

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      pointerInside.current = true;

      const rect = viewportRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        steer.current = clamp(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -1,
          1,
        );
      }

      if (!drag.current.active) return;
      const now = performance.now();
      const dx = event.clientX - drag.current.lastX;
      const dt = Math.max((now - drag.current.lastT) / 1000, 0.001);

      if (Math.abs(dx) > 2) drag.current.moved = true;
      // Dragging right pulls earlier cards back into view.
      offset.current -= dx / spacing.current;
      drag.current.velocity = -dx / spacing.current / dt;
      drag.current.lastX = event.clientX;
      drag.current.lastT = now;
    },
    [],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Touch keeps its native vertical scroll; only a mouse scrubs the track.
      const scrubbing = event.pointerType !== "touch";
      drag.current = {
        active: scrubbing,
        moved: false,
        lastX: event.clientX,
        lastT: performance.now(),
        velocity: 0,
      };
      if (!scrubbing) return;
      snapTo.current = null;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const endDrag = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    // Let go and it keeps going, then settles back into its drift.
    velocity.current = clamp(drag.current.velocity, -14, 14);
  }, []);

  const onPointerLeave = useCallback(() => {
    pointerInside.current = false;
    steer.current = 0;
    endDrag();
    if (!sticky.current) setActive(null);
  }, [endDrag, setActive]);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const from = snapTo.current ?? Math.round(offset.current);
    snapTo.current = from + (event.key === "ArrowRight" ? 1 : -1);
  }, []);

  return (
    <div
      ref={viewportRef}
      role="group"
      aria-label="The thirteen disciplines, on a track you can drag or steer"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
      className="relative select-none py-12 [overflow-x:clip] [overflow-y:visible] [perspective-origin:50%_50%] [perspective:1500px]"
    >
      <div className="relative h-[clamp(19rem,26vw,22.5rem)] [transform-style:preserve-3d]">
        {SERVICES.map((service, i) => (
          <div
            key={service.id}
            ref={(node) => {
              cardRefs.current[i] = node;
            }}
            onPointerEnter={() => {
              if (drag.current.active) return;
              setActive(i);
            }}
            onPointerLeave={() => {
              if (sticky.current || active.current !== i) return;
              setActive(null);
            }}
            className="absolute left-1/2 top-0 h-full w-[clamp(13.5rem,19vw,16.5rem)] [transform-style:preserve-3d] [will-change:transform,opacity]"
          >
            <ServiceCard
              service={service}
              index={i}
              total={COUNT}
              turned={turned === i}
              onClick={() => {
                // A drag that happens to end on a card is a drag, not a tap.
                if (drag.current.moved) return;
                const closing = sticky.current && active.current === i;
                setActive(closing ? null : i, true);
                if (!closing) snapTo.current = i;
              }}
              onFocus={() => {
                // Tabbing to a card off the side of the track brings it round.
                snapTo.current = i;
                setActive(i, true);
              }}
              onBlur={() => {
                if (active.current !== i) return;
                setActive(null);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
