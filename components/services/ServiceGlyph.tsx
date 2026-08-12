import type { ServiceGroup } from "@/lib/types";

/**
 * One line-drawn mark per discipline. Deliberately schematic rather than
 * illustrative — they read as parts on an engineering sheet, which is the
 * substrate the whole page is set on.
 */
const PATHS: Record<ServiceGroup, string> = {
  product: "M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm0 6.5 9 4.5 9-4.5",
  ai: "M12 3v4m0 10v4M5.5 7.5 8.7 9.4m6.6 5.2 3.2 1.9m0-9-3.2 1.9m-6.6 5.2-3.2 1.9M12 9.2 14.4 12 12 14.8 9.6 12Z",
  commerce: "M4 8h16l-1.4 12H5.4L4 8Zm4 0V6a4 4 0 0 1 8 0v2",
  data: "M4 20V11m5 9V5m5 15v-6m5 6V8",
  web: "M3.5 5.5h17v13h-17v-13Zm0 4h17M6.5 7.5h.01M9 7.5h.01",
  platform: "M8 4H6a2 2 0 0 0-2 2v4l-2 2 2 2v4a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v4l2 2-2 2v4a2 2 0 0 1-2 2h-2",
  ops: "M20 12a8 8 0 1 1-2.6-5.9M20 3v4h-4",
  mobile: "M7.5 3h9a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16.5 21h-9A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3Zm2.5 15h4",
  support: "M4 5h16v11H9l-5 4V5Zm4 5h8M8 13h5",
  infra: "M12 3 4.5 6v6c0 4.4 3.1 8.2 7.5 9 4.4-.8 7.5-4.6 7.5-9V6L12 3Zm-3 9 2.2 2.2L15.5 10",
  messaging: "M3.5 5h11v8h-7l-4 3.5V5Zm7 10.5h3l3.5 3v-3h2.5V8.5h-3",
  delivery: "M12 3v11m0-11 4 4m-4-4-4 4M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16",
};

export function ServiceGlyph({
  group,
  className,
}: {
  group: ServiceGroup;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={PATHS[group]} />
    </svg>
  );
}
