import type { WidgetBlueprint, WidgetOverride } from "./types";

/**
 * Deterministic layout engine. The blueprint never carries pixels or CSS —
 * spans are derived here from widget semantics.
 */
const BASE_SPAN: Record<WidgetBlueprint["type"], number> = {
  metric: 3,
  "status-distribution": 4,
  ranking: 6,
  trend: 12,
  donut: 4,
  "insight-list": 12,
  "recommendation-list": 12,
  table: 12,
};

const SIZE_BIAS: Record<string, number> = { sm: -1, md: 0, lg: 2, xl: 4 };

export const MIN_SPAN = 3;
export const MAX_SPAN = 12;

export function resolveSpan(widget: WidgetBlueprint, override?: WidgetOverride): number {
  if (override?.span) return clampSpan(override.span);
  const base = BASE_SPAN[widget.type] ?? 6;
  if (widget.type === "metric") return 3;
  const biased = base + (SIZE_BIAS[widget.size] ?? 0);
  return clampSpan(biased);
}

export function clampSpan(span: number) {
  return Math.max(MIN_SPAN, Math.min(MAX_SPAN, Math.round(span)));
}

/** deterministic height grammar so charts always fill their card */
export function resolveHeight(widget: WidgetBlueprint, span: number): number {
  switch (widget.type) {
    case "metric":
      return 118;
    case "trend":
      return span >= 9 ? 300 : 250;
    case "donut":
      return 268;
    case "status-distribution":
      return 268;
    case "ranking":
      return 300;
    case "table":
      return 0;
    default:
      return 0;
  }
}

export const spanClass = (span: number) =>
  ({
    3: "col-span-12 sm:col-span-6 xl:col-span-3",
    4: "col-span-12 md:col-span-6 xl:col-span-4",
    5: "col-span-12 md:col-span-6 xl:col-span-5",
    6: "col-span-12 lg:col-span-6",
    7: "col-span-12 lg:col-span-7",
    8: "col-span-12 lg:col-span-8",
    9: "col-span-12 lg:col-span-9",
    10: "col-span-12 lg:col-span-10",
    11: "col-span-12 lg:col-span-11",
    12: "col-span-12",
  })[span] ?? "col-span-12 lg:col-span-6";
