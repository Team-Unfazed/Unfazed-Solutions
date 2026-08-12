"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full " +
  "font-mono uppercase tracking-[0.16em] transition-colors duration-300 " +
  "focus-visible:outline-2 focus-visible:outline-offset-4";

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[0.6875rem]",
  lg: "h-14 px-8 text-[0.75rem]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-cta)] text-[color:var(--color-cta-fg)] hover:text-[color:var(--color-cta)]",
  secondary:
    "bg-[color:var(--color-cta-2)] text-[color:var(--color-cta-2-fg)] " +
    "border border-[color:var(--color-bg-accent)] hover:text-[color:var(--color-cta-fg)]",
  ghost:
    "bg-transparent text-[color:var(--color-accent)] border border-[color:var(--color-bg-accent)] " +
    "hover:text-[color:var(--color-cta-fg)]",
};

/**
 * The fill sweeps up from the bottom on hover and the label inverts with it.
 * Transform-only, so it composites without repainting the button.
 */
const fill: Record<Variant, string> = {
  primary: "bg-[color:var(--color-cta-fg)]",
  secondary: "bg-[color:var(--color-cta-2-fg)]",
  ghost: "bg-[color:var(--color-accent)]",
};

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonProps = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

type LinkButtonProps = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, "children" | "className">;

function Inner({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  return (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100 ${fill[variant]}`}
      />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className ?? ""}`}
      {...rest}
    >
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      className={`${base} ${sizes[size]} ${variants[variant]} ${className ?? ""}`}
      {...rest}
    >
      <Inner variant={variant}>{children}</Inner>
    </a>
  );
}

/** Small arrow used inside buttons and links. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={`transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-x-1 ${className ?? ""}`}
    >
      <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" />
    </svg>
  );
}
