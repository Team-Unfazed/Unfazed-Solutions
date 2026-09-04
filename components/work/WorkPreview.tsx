import Image from "next/image";

/**
 * The product, in the card.
 *
 * This slot used to hold an abstract composition of grey tiles, because there
 * were no screenshots of these twelve in the repository. There are now — one
 * poster each, every one already composed against its own ground — so the
 * frame does nothing but hold and crop them. The border and the 10px radius
 * stay exactly where they were: they belong to the card, not to the picture
 * inside it.
 *
 * The frame keeps its 16/9. Eleven of the twelve posters are 11:6 and lose
 * 1.5% off each side to it, which is inside every one of their margins.
 * Shoogle is the one exception at 16:10 and gives up 9.6% of its height
 * instead — `position` anchors it to the bottom so all of that comes off the
 * empty air above the composition rather than through the wordmark under it.
 */
export function WorkPreview({
  src,
  alt,
  position,
  className,
}: {
  src: string;
  alt: string;
  /** `object-position`, where a centred crop would take something needed. */
  position?: string;
  className?: string;
}) {
  return (
    // Spacing sits on a wrapper rather than on the frame. `aspect-ratio` is
    // measured on the border box, so padding on the frame itself would come
    // out of the picture — and a `fill` image, which lays itself out against
    // the padding box, would be inset by it.
    <div className={className}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[10px] border border-[color:var(--color-bg-accent)]/45 bg-[color:var(--color-bg)]">
        <Image
          src={src}
          alt={alt}
          fill
          /* The real ceiling is ~660px: the shell stops at 1560, and two
             columns plus the card's own padding take the rest of it. Nothing
             here is ever above the fold — Work is the fifth section on the
             page — so all twelve stay lazy. */
          sizes="(max-width: 767px) 84vw, (max-width: 1560px) 46vw, 700px"
          style={position ? { objectPosition: position } : undefined}
          /* The same 1.02 the award photography answers a hover with. It is
             the only thing the picture does on its own; the card's tilt does
             the rest. */
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover/work:scale-[1.02] group-focus-visible/work:scale-[1.02]"
        />
      </div>
    </div>
  );
}
