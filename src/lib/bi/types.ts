/**
 * Semantic model produced by the (simulated) AI Dashboard Composer.
 * The blueprint describes MEANING, never presentation pixels.
 * The layout engine decides grid spans deterministically.
 */

export type WidgetType =
  | "metric"
  | "status-distribution"
  | "ranking"
  | "trend"
  | "donut"
  | "insight-list"
  | "recommendation-list"
  | "table";

export type WidgetSize = "sm" | "md" | "lg" | "xl";

export type DataConfidence = "confirmed" | "unconfirmed";

export type Severity = "critical" | "attention" | "info" | "positive";

export interface MetricValue {
  value: number | null;
  /** confirmed zero vs. data not confirmed in this refresh */
  confidence: DataConfidence;
  format: "integer" | "currency" | "percent";
  delta?: number;
  deltaLabel?: string;
  hint?: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
  secondary?: number;
  tone?: Severity;
}

export interface InsightItem {
  id: string;
  rank: number;
  title: string;
  evidence: string;
  interpretation: string;
  severity: Severity;
}

export interface RecommendationItem {
  id: string;
  title: string;
  rationale: string;
  effort: "Rápido" | "Médio" | "Planejado";
  severity: Severity;
}

export interface TableSpec {
  columns: { key: string; label: string; align?: "left" | "right"; type?: "text" | "currency" | "date" | "status" | "number" }[];
  rows: Record<string, string | number>[];
}

export interface WidgetBlueprint {
  id: string;
  type: WidgetType;
  title: string;
  /** business question the widget answers */
  intent: string;
  datasetRef: string;
  dimension?: string;
  measure?: string;
  aggregation?: "count" | "sum" | "avg";
  format?: "integer" | "currency" | "percent";
  size: WidgetSize;
  priority: number;
  metric?: MetricValue;
  series?: SeriesPoint[];
  insights?: InsightItem[];
  recommendations?: RecommendationItem[];
  table?: TableSpec;
  emptyState?: { kind: "confirmed-empty" | "unconfirmed"; message: string };
}

export interface SectionBlueprint {
  id: string;
  title: string;
  description?: string;
  kind: "overview" | "flow" | "value" | "trend" | "editorial" | "actions" | "detail" | "custom";
  widgets: WidgetBlueprint[];
}

export interface DashboardBlueprint {
  id: string;
  title: string;
  subtitle: string;
  scope: string;
  executiveSummary: string;
  generatedAt: string;
  sections: SectionBlueprint[];
  followUps: string[];
  datasets: DatasetMeta[];
}

export interface DatasetMeta {
  ref: string;
  entity: string;
  label: string;
  records: number | null;
  confidence: DataConfidence;
  fingerprint: string;
  provenance: string;
  transport: string;
}

/** user overrides persisted locally — never part of the AI blueprint */
export interface WidgetOverride {
  span?: number;
  title?: string;
  locked?: boolean;
  hidden?: boolean;
  variant?: string;
}

export interface UserLayoutOverride {
  dashboardId: string;
  order: Record<string, string[]>;
  sectionOrder: string[];
  sectionTitles: Record<string, string>;
  extraSections: { id: string; title: string }[];
  widgets: Record<string, WidgetOverride>;
}

export interface SavedPanel {
  id: string;
  blueprint: DashboardBlueprint;
  savedAt: string;
  favorite: boolean;
  widgetCount: number;
}
