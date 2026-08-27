import { useState } from "react";
import { Plus } from "lucide-react";
import type { DashboardBlueprint, SectionBlueprint, UserLayoutOverride } from "@/lib/bi/types";
import { resolveSpan, spanClass } from "@/lib/bi/layoutEngine";
import { cn } from "@/lib/utils";
import { WidgetCard } from "./WidgetCard";
import { SectionSkeleton } from "./skeletons";
import { Input } from "@/components/ui/input";

interface Props {
  blueprint: DashboardBlueprint;
  layout: UserLayoutOverride;
  visibleSectionIds: string[];
  pendingSectionCount: number;
  applyingWidgetId: string | null;
  onWidget: {
    rename: (id: string, title: string) => void;
    remove: (id: string) => void;
    toggleLock: (id: string) => void;
    resize: (id: string, span: number) => void;
    aiEdit: (id: string, instruction: string) => void;
    reorder: (sectionId: string, fromId: string, toId: string) => void;
  };
  onSectionTitle: (sectionId: string, title: string) => void;
  onAddSection: () => void;
  onAsk: (text: string) => void;
}

export function DashboardCanvas({
  blueprint,
  layout,
  visibleSectionIds,
  pendingSectionCount,
  applyingWidgetId,
  onWidget,
  onSectionTitle,
  onAddSection,
  onAsk,
}: Props) {
  const [dragging, setDragging] = useState<{ sectionId: string; widgetId: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const sections = orderSections(blueprint, layout).filter((s) => visibleSectionIds.includes(s.id));

  return (
    <div className="flex flex-col gap-9 pb-10">
      {sections.map((section) => {
        const widgets = orderWidgets(section, layout).filter((w) => !layout.widgets[w.id]?.hidden);
        if (!widgets.length && section.kind !== "custom") return null;
        return (
          <section key={section.id} className="animate-rise">
            <SectionHeader
              title={layout.sectionTitles[section.id] ?? section.title}
              description={section.description}
              count={widgets.length}
              onTitle={(t) => onSectionTitle(section.id, t)}
            />
            <div className="mt-3.5 grid grid-cols-12 gap-3.5">
              {widgets.map((widget) => {
                const override = layout.widgets[widget.id];
                const span = resolveSpan(widget, override);
                return (
                  <div key={widget.id} className={cn(spanClass(span), "min-w-0")}>
                    <WidgetCard
                      widget={widget}
                      override={override}
                      span={span}
                      applying={applyingWidgetId === widget.id}
                      onRename={(t) => onWidget.rename(widget.id, t)}
                      onDelete={() => onWidget.remove(widget.id)}
                      onToggleLock={() => onWidget.toggleLock(widget.id)}
                      onResize={(s) => onWidget.resize(widget.id, s)}
                      onAiEdit={(i) => onWidget.aiEdit(widget.id, i)}
                      onAsk={onAsk}
                      isDragging={dragging?.widgetId === widget.id}
                      isDropTarget={dropTarget === widget.id && dragging?.widgetId !== widget.id}
                      dragHandlers={{
                        onDragStart: (e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", widget.id);
                          setDragging({ sectionId: section.id, widgetId: widget.id });
                        },
                        onDragOver: (e) => {
                          if (!dragging || dragging.sectionId !== section.id) return;
                          e.preventDefault();
                          setDropTarget(widget.id);
                        },
                        onDrop: (e) => {
                          e.preventDefault();
                          if (dragging && dragging.widgetId !== widget.id) {
                            onWidget.reorder(section.id, dragging.widgetId, widget.id);
                          }
                          setDragging(null);
                          setDropTarget(null);
                        },
                        onDragEnd: () => {
                          setDragging(null);
                          setDropTarget(null);
                        },
                      }}
                    />
                  </div>
                );
              })}
              {!widgets.length && (
                <div className="col-span-12 rounded-xl border border-dashed border-border bg-surface-muted/40 px-5 py-8 text-center text-[13px] text-muted-foreground">
                  Seção vazia. Peça ao Genius um novo widget ou arraste um existente para cá.
                </div>
              )}
            </div>
          </section>
        );
      })}

      {Array.from({ length: pendingSectionCount }).map((_, i) => (
        <SectionSkeleton key={`sk-${i}`} variant={i === 0 ? "charts" : "editorial"} />
      ))}

      {pendingSectionCount === 0 && (
        <button
          type="button"
          onClick={onAddSection}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/40 py-4 text-[13.5px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent/40 hover:text-foreground"
        >
          <Plus className="size-4" /> Nova seção
        </button>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  count,
  onTitle,
}: {
  title: string;
  description?: string | undefined;
  count: number;
  onTitle: (t: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border/70 pb-2">
      <div className="min-w-0">
        {editing ? (
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onTitle(draft.trim() || title);
                setEditing(false);
              }
              if (e.key === "Escape") {
                setDraft(title);
                setEditing(false);
              }
            }}
            onBlur={() => {
              onTitle(draft.trim() || title);
              setEditing(false);
            }}
            className="h-7 w-64 text-[12px] font-semibold uppercase tracking-[0.12em]"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(title);
              setEditing(true);
            }}
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {title}
          </button>
        )}
        {description && <p className="mt-1 text-[13px] text-muted-foreground/90">{description}</p>}
      </div>
      <span className="num shrink-0 text-[11.5px] text-muted-foreground/70">
        {count} {count === 1 ? "widget" : "widgets"}
      </span>
    </div>
  );
}

function orderSections(bp: DashboardBlueprint, layout: UserLayoutOverride): SectionBlueprint[] {
  const extra: SectionBlueprint[] = layout.extraSections.map((s) => ({
    id: s.id,
    title: layout.sectionTitles[s.id] ?? s.title,
    kind: "custom",
    widgets: [],
  }));
  const all = [...bp.sections, ...extra];
  if (!layout.sectionOrder.length) return all;
  const byId = new Map(all.map((s) => [s.id, s]));
  const ordered = layout.sectionOrder.map((id) => byId.get(id)).filter(Boolean) as SectionBlueprint[];
  const rest = all.filter((s) => !layout.sectionOrder.includes(s.id));
  return [...ordered, ...rest];
}

function orderWidgets(section: SectionBlueprint, layout: UserLayoutOverride) {
  const order = layout.order[section.id];
  if (!order?.length) return section.widgets;
  const byId = new Map(section.widgets.map((w) => [w.id, w]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean) as typeof section.widgets;
  const rest = section.widgets.filter((w) => !order.includes(w.id));
  return [...ordered, ...rest];
}
