import { AlertTriangle, ArrowUpRight, CircleDashed, Info, Lightbulb, TrendingUp } from "lucide-react";
import type { InsightItem, MetricValue, RecommendationItem, Severity, TableSpec, WidgetBlueprint } from "@/lib/bi/types";
import { brl, int } from "@/lib/bi/mockData";
import { cn } from "@/lib/utils";
import { ChartLegend, DonutChart, RankingChart, StatusDistributionChart, TrendChart } from "./charts";
import { StatusPill } from "./StatusPill";

export function formatMetric(m: MetricValue) {
  if (m.value === null) return "—";
  if (m.format === "currency") return brl(m.value);
  if (m.format === "percent") return `${m.value.toFixed(1)}%`;
  return int(m.value);
}

export function MetricCard({ widget }: { widget: WidgetBlueprint }) {
  const m = widget.metric;
  if (!m) return null;
  const unconfirmed = m.confidence === "unconfirmed";
  return (
    <div className="flex h-full flex-col justify-between px-4 py-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
          {widget.title}
        </span>
        {unconfirmed ? (
          <CircleDashed className="size-3.5 shrink-0 text-warning" />
        ) : (
          <TrendingUp className="size-3.5 shrink-0 text-muted-foreground/50" />
        )}
      </div>
      <div className="mt-1.5">
        <span
          className={cn(
            "num block text-[30px] font-semibold leading-none",
            unconfirmed ? "text-muted-foreground/70" : "text-foreground",
          )}
        >
          {formatMetric(m)}
        </span>
      </div>
      <p
        className={cn(
          "mt-2 truncate text-[11.5px]",
          unconfirmed ? "text-warning-foreground/80 dark:text-warning" : "text-muted-foreground",
        )}
        title={widget.emptyState?.message ?? m.hint ?? widget.intent}
      >
        {widget.emptyState?.message ?? m.hint ?? widget.intent}
      </p>
    </div>
  );
}

const severityStyles: Record<Severity, { dot: string; text: string; bg: string; icon: typeof AlertTriangle }> = {
  critical: { dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/8", icon: AlertTriangle },
  attention: { dot: "bg-warning", text: "text-warning", bg: "bg-warning/10", icon: AlertTriangle },
  info: { dot: "bg-info", text: "text-info", bg: "bg-info/10", icon: Info },
  positive: { dot: "bg-success", text: "text-success", bg: "bg-success/10", icon: TrendingUp },
};

export function InsightRow({ item }: { item: InsightItem }) {
  const s = severityStyles[item.severity];
  const Icon = s.icon;
  return (
    <li className="group/insight flex gap-4 rounded-xl border border-border/70 bg-surface px-4 py-3.5 transition-colors hover:border-border-strong hover:bg-surface-muted/60">
      <div className="flex flex-col items-center gap-2 pt-0.5">
        <span className="num flex size-6 items-center justify-center rounded-md bg-surface-muted text-xs font-semibold text-muted-foreground">
          {item.rank}
        </span>
        <span className={cn("w-px flex-1 rounded-full", s.dot, "opacity-30")} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-[14.5px] font-semibold leading-snug text-foreground">{item.title}</h4>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide",
              s.bg,
              s.text,
            )}
          >
            <Icon className="mr-1 inline size-3 -translate-y-px" />
            {item.severity === "critical"
              ? "Crítico"
              : item.severity === "attention"
                ? "Atenção"
                : item.severity === "positive"
                  ? "Positivo"
                  : "Contexto"}
          </span>
        </div>
        <p className="num mt-1 text-[13px] font-medium text-foreground/80">{item.evidence}</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{item.interpretation}</p>
      </div>
    </li>
  );
}

export function RecommendationCard({
  item,
  onAsk,
}: {
  item: RecommendationItem;
  onAsk?: ((text: string) => void) | undefined;
}) {
  const s = severityStyles[item.severity];
  return (
    <div className="flex h-full flex-col rounded-xl border border-border/70 bg-surface p-4 transition-shadow hover:shadow-raised">
      <div className="flex items-center gap-2">
        <span className={cn("flex size-7 items-center justify-center rounded-lg", s.bg)}>
          <Lightbulb className={cn("size-3.5", s.text)} />
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
          {item.effort}
        </span>
      </div>
      <h4 className="mt-3 text-[14px] font-semibold leading-snug text-foreground">{item.title}</h4>
      <p className="mt-1 flex-1 text-[13px] leading-relaxed text-muted-foreground">{item.rationale}</p>
      <button
        type="button"
        onClick={() => onAsk?.(item.title)}
        className="mt-3 inline-flex items-center gap-1 self-start text-[12.5px] font-medium text-primary transition-colors hover:text-primary/80"
      >
        Pedir ao Genius <ArrowUpRight className="size-3.5" />
      </button>
    </div>
  );
}

export function MiniTable({ spec }: { spec: TableSpec }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-surface-muted">
            {spec.columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                  c.align === "right" && "text-right",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.rows.map((row, i) => (
            <tr key={i} className="border-t border-border/70 transition-colors hover:bg-surface-muted/60">
              {spec.columns.map((c) => {
                const v = row[c.key];
                return (
                  <td
                    key={c.key}
                    className={cn(
                      "max-w-[260px] truncate px-3 py-2.5 text-foreground/90",
                      c.align === "right" && "num text-right",
                    )}
                    title={String(v ?? "")}
                  >
                    {c.type === "status" ? (
                      <StatusPill status={String(v)} />
                    ) : c.type === "currency" ? (
                      brl(Number(v))
                    ) : (
                      String(v ?? "—")
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyWidgetState({ kind, message }: { kind: "confirmed-empty" | "unconfirmed"; message: string }) {
  return (
    <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-muted/40 p-6 text-center">
      {kind === "unconfirmed" ? (
        <CircleDashed className="size-5 text-warning" />
      ) : (
        <Info className="size-5 text-muted-foreground" />
      )}
      <p className="max-w-[280px] text-[13px] text-muted-foreground">{message}</p>
    </div>
  );
}

/** Renders widget content from semantics + user variant overrides. */
export function WidgetContent({
  widget,
  variant,
  height,
  onAsk,
}: {
  widget: WidgetBlueprint;
  variant?: string | undefined;
  height: number;
  onAsk?: ((text: string) => void) | undefined;
}) {
  const series = widget.series ?? [];

  switch (widget.type) {
    case "metric":
      return <MetricCard widget={widget} />;
    case "status-distribution":
      return (
        <div className="px-4 pb-4">
          <div style={{ height }}>
            {variant === "donut" ? (
              <DonutChart data={series} format={widget.format} />
            ) : variant === "vertical" ? (
              <RankingChart data={series} format={widget.format} horizontal={false} />
            ) : (
              <StatusDistributionChart data={series} format={widget.format} showPercent={variant === "percent"} />
            )}
          </div>
        </div>
      );
    case "donut":
      return (
        <div className="flex h-full flex-col px-4 pb-4">
          <div style={{ height: height - 44 }}>
            {variant === "bars" ? (
              <StatusDistributionChart data={series} format={widget.format} />
            ) : (
              <DonutChart data={series} format={widget.format} />
            )}
          </div>
          <ChartLegend data={series} />
        </div>
      );
    case "ranking":
      return (
        <div className="h-full px-4 pb-4" style={{ height }}>
          <RankingChart data={series} format={widget.format} horizontal={variant !== "vertical"} />
        </div>
      );
    case "trend":
      return (
        <div className="h-full px-4 pb-4" style={{ height }}>
          <TrendChart data={series} format={widget.format} variant={variant === "line" ? "line" : "area"} />
        </div>
      );
    case "insight-list":
      return (
        <ul className="flex flex-col gap-2.5 px-4 pb-4">
          {(widget.insights ?? []).map((i) => (
            <InsightRow key={i.id} item={i} />
          ))}
        </ul>
      );
    case "recommendation-list":
      return (
        <div className="grid grid-cols-1 gap-3 px-4 pb-4 md:grid-cols-2 xl:grid-cols-3">
          {(widget.recommendations ?? []).map((r) => (
            <RecommendationCard key={r.id} item={r} onAsk={onAsk} />
          ))}
        </div>
      );
    case "table":
      return <div className="px-4 pb-4">{widget.table ? <MiniTable spec={widget.table} /> : null}</div>;
    default:
      return null;
  }
}
