import { AlertTriangle, BarChart3, Database, RotateCw } from "lucide-react";
import type { DashboardBlueprint, UserLayoutOverride } from "@/lib/bi/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardCanvas } from "./DashboardCanvas";
import { DashboardHeader, type DemoState } from "./DashboardHeader";
import { DataExplorer } from "./DataExplorer";
import { DashboardSkeleton } from "./skeletons";

interface Props {
  blueprint: DashboardBlueprint;
  layout: UserLayoutOverride;
  tab: "painel" | "dados";
  onTab: (t: "painel" | "dados") => void;
  generating: boolean;
  visibleSectionIds: string[];
  pendingSectionCount: number;
  applyingWidgetId: string | null;
  demoState: DemoState;
  headerProps: Omit<
    React.ComponentProps<typeof DashboardHeader>,
    "title" | "subtitle" | "scope" | "updatedAt"
  >;
  updatedAt: string;
  onRetry: () => void;
  canvasHandlers: Omit<
    React.ComponentProps<typeof DashboardCanvas>,
    "blueprint" | "layout" | "visibleSectionIds" | "pendingSectionCount" | "applyingWidgetId"
  >;
}

export function Lousa({
  blueprint,
  layout,
  tab,
  onTab,
  generating,
  visibleSectionIds,
  pendingSectionCount,
  applyingWidgetId,
  demoState,
  headerProps,
  updatedAt,
  onRetry,
  canvasHandlers,
}: Props) {
  const showFullSkeleton = generating && visibleSectionIds.length === 0;

  return (
    <section className="flex h-full min-w-0 flex-col overflow-hidden bg-background">
      <DashboardHeader
        {...headerProps}
        title={blueprint.title}
        subtitle={blueprint.subtitle}
        scope={blueprint.scope}
        updatedAt={updatedAt}
      />

      <div className="flex items-center justify-between gap-4 border-b border-border bg-surface/60 px-6 py-2.5">
        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-0.5">
          {(
            [
              { key: "painel", label: "Painel", icon: BarChart3 },
              { key: "dados", label: "Dados", icon: Database },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => onTab(key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all",
                tab === key
                  ? "bg-accent text-accent-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
        <p className="num hidden text-[11.5px] text-muted-foreground md:block">
          {blueprint.sections.reduce((a, s) => a + s.widgets.length, 0)} widgets ·{" "}
          {blueprint.datasets.length} datasets
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-slim px-6 py-5">
        {demoState === "error" && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/8 px-4 py-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
            <div className="flex-1">
              <p className="text-[13.5px] font-medium text-foreground">
                Não foi possível atualizar os dados agora.
              </p>
              <p className="text-[12.5px] text-muted-foreground">
                Exibindo a última versão válida do painel, gerada às {updatedAt}.
              </p>
            </div>
            <Button variant="outline" size="sm" className="h-7 gap-1.5" onClick={onRetry}>
              <RotateCw className="size-3.5" /> Tentar novamente
            </Button>
          </div>
        )}

        {tab === "painel" ? (
          <>
            <p className="mb-6 max-w-4xl border-l-2 border-primary/40 pl-4 text-[14px] leading-relaxed text-foreground/85">
              {demoState === "empty"
                ? "Sem resultados no recorte selecionado. Nenhuma requisição, cotação ou pedido foi encontrado entre 01/08 e 26/08."
                : demoState === "unconfirmed"
                  ? "Não foi possível confirmar os dados nesta atualização. Os indicadores abaixo permanecem com a última leitura validada."
                  : blueprint.executiveSummary}
            </p>

            {demoState === "empty" ? (
              <EmptyDashboard
                title="Sem resultados no recorte."
                description="Amplie o período ou remova filtros para o Genius encontrar documentos."
                onRetry={onRetry}
              />
            ) : showFullSkeleton ? (
              <DashboardSkeleton />
            ) : (
              <DashboardCanvas
                {...canvasHandlers}
                blueprint={blueprint}
                layout={layout}
                visibleSectionIds={visibleSectionIds}
                pendingSectionCount={pendingSectionCount}
                applyingWidgetId={applyingWidgetId}
              />
            )}
          </>
        ) : (
          <DataExplorer datasets={blueprint.datasets} onAsk={canvasHandlers.onAsk} />
        )}
      </div>
    </section>
  );
}

function EmptyDashboard({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-24 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-surface-muted">
        <BarChart3 className="size-5 text-muted-foreground" />
      </div>
      <h3 className="text-[16px] font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-[13.5px] text-muted-foreground">{description}</p>
      <Button variant="outline" size="sm" className="mt-1 gap-1.5" onClick={onRetry}>
        <RotateCw className="size-3.5" /> Recarregar recorte
      </Button>
    </div>
  );
}
