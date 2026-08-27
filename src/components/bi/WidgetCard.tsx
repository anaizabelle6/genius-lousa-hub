import { useEffect, useRef, useState } from "react";
import {
  Check,
  GripVertical,
  Lock,
  LockOpen,
  Pencil,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { WidgetBlueprint, WidgetOverride } from "@/lib/bi/types";
import { MAX_SPAN, MIN_SPAN, resolveHeight } from "@/lib/bi/layoutEngine";
import { WidgetContent, EmptyWidgetState } from "./widgets";

interface Props {
  widget: WidgetBlueprint;
  override: WidgetOverride | undefined;
  span: number;
  applying: boolean;
  onRename: (title: string) => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onResize: (span: number) => void;
  onAiEdit: (instruction: string) => void;
  onAsk?: ((text: string) => void) | undefined;
  dragHandlers: {
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
  isDragging: boolean;
  isDropTarget: boolean;
}

const AI_SUGGESTIONS = [
  "Troque para barras horizontais.",
  "Mostre percentual.",
  "Destaque os cancelados.",
  "Transforme em ranking.",
];

export function WidgetCard({
  widget,
  override,
  span,
  applying,
  onRename,
  onDelete,
  onToggleLock,
  onResize,
  onAiEdit,
  onAsk,
  dragHandlers,
  isDragging,
  isDropTarget,
}: Props) {
  const locked = override?.locked ?? false;
  const title = override?.title ?? widget.title;
  const [renaming, setRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [aiOpen, setAiOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const resizing = useRef<{ startX: number; startSpan: number; colWidth: number } | null>(null);

  useEffect(() => setDraftTitle(title), [title]);

  const height = resolveHeight(widget, span);
  const isMetric = widget.type === "metric";
  const isEditorial = widget.type === "insight-list" || widget.type === "recommendation-list";

  function beginResize(e: React.PointerEvent) {
    if (locked) return;
    const grid = cardRef.current?.parentElement?.parentElement;
    const gridWidth = grid?.clientWidth ?? 1200;
    resizing.current = { startX: e.clientX, startSpan: span, colWidth: gridWidth / 12 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function moveResize(e: React.PointerEvent) {
    const r = resizing.current;
    if (!r) return;
    const delta = Math.round((e.clientX - r.startX) / r.colWidth);
    const next = Math.max(MIN_SPAN, Math.min(MAX_SPAN, r.startSpan + delta));
    if (next !== span) onResize(next);
  }
  function endResize(e: React.PointerEvent) {
    if (resizing.current) {
      resizing.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }

  return (
    <div
      ref={cardRef}
      onDragOver={dragHandlers.onDragOver}
      onDrop={dragHandlers.onDrop}
      onDragEnd={dragHandlers.onDragEnd}
      className={cn(
        "group/widget relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-200",
        "hover:border-border-strong hover:shadow-raised",
        isDragging && "opacity-40",
        isDropTarget && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
        applying && "ring-1 ring-primary/40",
      )}
    >
      {/* header */}
      {!isMetric && (
        <div className="flex items-start justify-between gap-3 px-4 pb-2.5 pt-3.5">
          <div className="min-w-0">
            {renaming ? (
              <div className="flex items-center gap-1.5">
                <Input
                  autoFocus
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(draftTitle.trim() || widget.title);
                      setRenaming(false);
                    }
                    if (e.key === "Escape") {
                      setDraftTitle(title);
                      setRenaming(false);
                    }
                  }}
                  onBlur={() => {
                    onRename(draftTitle.trim() || widget.title);
                    setRenaming(false);
                  }}
                  className="h-7 w-56 text-[14px]"
                />
              </div>
            ) : (
              <h3
                className="truncate text-[14.5px] font-semibold leading-tight text-foreground"
                title={title}
              >
                {title}
              </h3>
            )}
            <p className="mt-0.5 truncate text-[12px] text-muted-foreground" title={widget.intent}>
              {widget.intent}
            </p>
          </div>
          <WidgetActions
            locked={locked}
            aiOpen={aiOpen}
            setAiOpen={setAiOpen}
            instruction={instruction}
            setInstruction={setInstruction}
            onAiEdit={onAiEdit}
            onRenameStart={() => setRenaming(true)}
            onToggleLock={onToggleLock}
            onDelete={onDelete}
            dragStart={dragHandlers.onDragStart}
          />
        </div>
      )}

      {isMetric && (
        <div className="absolute right-1.5 top-1.5 z-10 opacity-0 transition-opacity group-hover/widget:opacity-100 focus-within:opacity-100">
          <WidgetActions
            compact
            locked={locked}
            aiOpen={aiOpen}
            setAiOpen={setAiOpen}
            instruction={instruction}
            setInstruction={setInstruction}
            onAiEdit={onAiEdit}
            onRenameStart={() => setRenaming(true)}
            onToggleLock={onToggleLock}
            onDelete={onDelete}
            dragStart={dragHandlers.onDragStart}
          />
        </div>
      )}

      <div className={cn("relative flex-1", isEditorial && "pt-1")}>
        {widget.emptyState ? (
          <div className="px-4 pb-4">
            <EmptyWidgetState kind={widget.emptyState.kind} message={widget.emptyState.message} />
          </div>
        ) : (
          <WidgetContent widget={widget} variant={override?.variant} height={height} onAsk={onAsk} />
        )}

        {applying && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/70 backdrop-blur-[1px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] font-medium text-foreground shadow-card">
              <Sparkles className="size-3.5 animate-pulse text-primary" />
              Aplicando alteração...
            </span>
          </div>
        )}
      </div>

      {locked && (
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-surface-muted px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground">
          <Lock className="size-3" /> Fixo
        </span>
      )}

      {!locked && (
        <div
          onPointerDown={beginResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          title="Redimensionar"
          className="absolute bottom-0 right-0 z-20 flex h-6 w-6 cursor-ew-resize items-end justify-end p-1 opacity-0 transition-opacity group-hover/widget:opacity-100"
        >
          <span className="block size-2.5 rounded-br-[6px] border-b-2 border-r-2 border-border-strong" />
        </div>
      )}

      {isMetric && renaming && (
        <div className="absolute inset-x-3 bottom-2">
          <Input
            autoFocus
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRename(draftTitle.trim() || widget.title);
                setRenaming(false);
              }
              if (e.key === "Escape") setRenaming(false);
            }}
            onBlur={() => setRenaming(false)}
            className="h-7 text-[13px]"
          />
        </div>
      )}
    </div>
  );
}

function WidgetActions({
  locked,
  aiOpen,
  setAiOpen,
  instruction,
  setInstruction,
  onAiEdit,
  onRenameStart,
  onToggleLock,
  onDelete,
  dragStart,
  compact,
}: {
  locked: boolean;
  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;
  instruction: string;
  setInstruction: (v: string) => void;
  onAiEdit: (i: string) => void;
  onRenameStart: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  dragStart: (e: React.DragEvent) => void;
  compact?: boolean;
}) {
  const btn =
    "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-0.5 rounded-lg border border-transparent transition-all",
        !compact && "opacity-0 group-hover/widget:opacity-100 focus-within:opacity-100",
        compact && "border-border bg-surface/95 p-0.5 shadow-card",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            draggable={!locked}
            onDragStart={dragStart}
            className={cn(btn, locked ? "cursor-not-allowed opacity-40" : "cursor-grab active:cursor-grabbing")}
            aria-label="Mover widget"
          >
            <GripVertical className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Arrastar para reordenar</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className={btn} onClick={onRenameStart} aria-label="Renomear">
            <Pencil className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Renomear</TooltipContent>
      </Tooltip>

      <Popover open={aiOpen} onOpenChange={setAiOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button type="button" className={cn(btn, "text-primary hover:text-primary")} aria-label="Editar com IA">
                <Sparkles className="size-4" />
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Editar com Genius</TooltipContent>
        </Tooltip>
        <PopoverContent align="end" className="w-[340px] p-4">
          <p className="text-[13.5px] font-semibold text-foreground">Como você quer alterar este widget?</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            O Genius aplica um patch semântico apenas neste widget.
          </p>
          <Textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Ex.: Troque para barras horizontais."
            className="mt-3 min-h-[72px] text-[13px]"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {AI_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInstruction(s)}
                className="rounded-full border border-border px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAiOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={!instruction.trim()}
              onClick={() => {
                onAiEdit(instruction.trim());
                setInstruction("");
                setAiOpen(false);
              }}
            >
              <Check className="size-3.5" /> Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className={btn} onClick={onToggleLock} aria-label="Bloquear widget">
            {locked ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
          </button>
        </TooltipTrigger>
        <TooltipContent>{locked ? "Desbloquear" : "Bloquear posição"}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(btn, "hover:bg-destructive/10 hover:text-destructive")}
            onClick={onDelete}
            aria-label="Remover widget"
          >
            <Trash2 className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>Remover</TooltipContent>
      </Tooltip>
      <span className="sr-only">
        <X />
      </span>
    </div>
  );
}
