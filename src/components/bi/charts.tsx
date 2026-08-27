import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import type { SeriesPoint, Severity } from "@/lib/bi/types";
import { brl, int } from "@/lib/bi/mockData";

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-5)",
  "var(--chart-4)",
];

const toneColor: Record<Severity, string> = {
  critical: "var(--chart-4)",
  attention: "var(--chart-3)",
  positive: "var(--chart-2)",
  info: "var(--chart-1)",
};

export const fmt = (v: number, format?: string) =>
  format === "currency" ? brl(v) : format === "percent" ? `${v.toFixed(1)}%` : int(v);

const axisProps = {
  stroke: "var(--border-strong)",
  tick: { fill: "var(--muted-foreground)", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

function ChartTooltip({
  active,
  payload,
  label,
  format,
}: {
  active?: boolean | undefined;
  payload?: { value?: number | string; name?: string; payload?: SeriesPoint }[] | undefined;
  label?: string | number | undefined;
  format?: string | undefined;
}) {
  if (!active || !payload?.length) return null;
  const first = payload[0];
  const name = label ?? first?.payload?.label ?? first?.name;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-pop">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{String(name)}</p>
      <p className="num mt-0.5 text-sm font-semibold text-foreground">
        {fmt(Number(first?.value ?? 0), format)}
      </p>
    </div>
  );
}

export function StatusDistributionChart({
  data,
  format,
  showPercent,
}: {
  data: SeriesPoint[];
  format?: string | undefined;
  showPercent?: boolean | undefined;
}) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 0, left: 0 }} barCategoryGap={14}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="2 4" />
        <XAxis type="number" {...axisProps} hide />
        <YAxis
          type="category"
          dataKey="label"
          width={132}
          {...axisProps}
          tick={{ fill: "var(--foreground)", fontSize: 12 }}
        />
        <Tooltip cursor={{ fill: "var(--surface-muted)" }} content={<ChartTooltip format={format} />} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={26}>
          {data.map((d, i) => (
            <Cell key={d.label} fill={d.tone ? toneColor[d.tone] : CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            className="num"
            formatter={(v: number) => (showPercent ? `${((v / total) * 100).toFixed(0)}%` : fmt(v, format))}
            style={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RankingChart({
  data,
  format,
  horizontal = true,
}: {
  data: SeriesPoint[];
  format?: string | undefined;
  horizontal?: boolean | undefined;
}) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  if (!horizontal) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="2 4" />
          <XAxis dataKey="label" {...axisProps} interval={0} height={52} angle={-18} textAnchor="end" />
          <YAxis {...axisProps} width={56} tickFormatter={(v: number) => int(Math.round(v))} />
          <Tooltip cursor={{ fill: "var(--surface-muted)" }} content={<ChartTooltip format={format} />} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--chart-1)" maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 72, bottom: 0, left: 0 }} barCategoryGap={12}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="2 4" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={158}
          {...axisProps}
          tick={{ fill: "var(--foreground)", fontSize: 12 }}
        />
        <Tooltip cursor={{ fill: "var(--surface-muted)" }} content={<ChartTooltip format={format} />} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {sorted.map((d, i) => (
            <Cell key={d.label} fill={i === 0 ? "var(--chart-1)" : "color-mix(in oklab, var(--chart-1) 55%, white)"} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v: number) => fmt(v, format)}
            style={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({
  data,
  format,
  variant = "area",
}: {
  data: SeriesPoint[];
  format?: string | undefined;
  variant?: "area" | "line" | undefined;
}) {
  if (variant === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="2 4" />
          <XAxis dataKey="label" {...axisProps} interval={2} />
          <YAxis {...axisProps} width={36} allowDecimals={false} />
          <Tooltip content={<ChartTooltip format={format} />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--chart-1)"
            strokeWidth={2.4}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="2 4" />
        <XAxis dataKey="label" {...axisProps} interval={2} />
        <YAxis {...axisProps} width={36} allowDecimals={false} />
        <Tooltip content={<ChartTooltip format={format} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2.4}
          fill="url(#trendFill)"
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, format }: { data: SeriesPoint[]; format?: string | undefined }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip format={format} />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            stroke="var(--surface)"
            strokeWidth={2}
          >
            {data.map((d, i) => (
              <Cell key={d.label} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-2xl font-semibold text-foreground">{int(total)}</span>
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">documentos</span>
      </div>
    </div>
  );
}

export function ChartLegend({ data }: { data: SeriesPoint[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      {data.map((d, i) => (
        <li key={d.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="size-2 rounded-full"
            style={{ background: d.tone ? toneColor[d.tone] : CHART_COLORS[i % CHART_COLORS.length] }}
          />
          {d.label}
        </li>
      ))}
    </ul>
  );
}
