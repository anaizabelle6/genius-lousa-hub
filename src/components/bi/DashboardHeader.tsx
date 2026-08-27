import { useEffect, useState } from "react";
import {
  Check,
  ChevronsLeftRight,
  Loader2,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type DemoState = "ok" | "error" | "empty" | "unconfirmed";

interface Props {
  title: string;
  subtitle: string;
  scope: string;
  updatedAt: string;
  saved: boolean;
  saving: boolean;
  refreshing: boolean;
  expanded: boolean;
  onChangeTitle: (title: string, subtitle: string) => void;
  onToggleSave: () => void;
  onRefresh: () => void;
  onToggleExpand: () => void;
  onClose: () => void;
  onDemoState: (s: DemoState) => void;
}

export function DashboardHeader({
  title,
  subtitle,
  scope,
  updatedAt,
  saved,
  saving,
  refreshing,
  expanded,
  onChangeTitle,
  onToggleSave,
  onRefresh,
  onToggleExpand,
  onClose,
  onDemoState,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [t, setT] = useState(title);
  const [s, setS] = useState(subtitle);

  useEffect(() => {
    setT(title);
    setS(subtitle);
  }, [title, subtitle]);

  function commit() {
    onChangeTitle(t.trim() || title, s.trim());
    setEditing(false);
  }
  function cancel() {
    setT(title);
    setS(subtitle);
    setEditing(false);
  }

  const iconBtn =
    "inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <header className="border-b border-border bg-surface/80 px-6 py-4 backdrop-blur">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="max-w-xl space-y-2">
              <Input
                autoFocus
                value={t}
                onChange={(e) => setT(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") cancel();
                }}
                className="h-9 text-[19px] font-semibold"
              />
              <Input
                value={s}
                onChange={(e) => setS(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") cancel();
                }}
                onBlur={commit}
                placeholder="Adicionar subtítulo..."
                className="h-8 text-[13px]"
              />
            </div>
          ) : (
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="group/title flex max-w-full items-center gap-2 text-left"
              >
                <h1 className="truncate text-[21px] font-semibold leading-tight text-foreground">{title}</h1>
                <Pencil className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/title:opacity-100" />
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className={cn(
                  "mt-0.5 block max-w-full truncate text-left text-[13px]",
                  subtitle ? "text-muted-foreground" : "text-muted-foreground/60 italic",
                )}
              >
                {subtitle || "Adicionar subtítulo..."}
              </button>
            </div>
          )}
          <p className="num mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-muted-foreground/80">
            <span>{scope}</span>
            <span className="text-border-strong">•</span>
            <span>Atualizado {updatedAt}</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className={iconBtn} onClick={() => setEditing(true)} aria-label="Editar título">
                <Pencil className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Editar título e subtítulo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(iconBtn, saved && "text-warning hover:text-warning")}
                onClick={onToggleSave}
                aria-label={saved ? "Remover dos painéis" : "Salvar nos painéis"}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Star className={cn("size-4", saved && "fill-current")} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{saved ? "Remover dos painéis" : "Salvar nos painéis"}</TooltipContent>
          </Tooltip>

          <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing} className="h-8 gap-1.5">
            <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
            {refreshing ? "Atualizando..." : "Atualizar dados"}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className={iconBtn} onClick={onToggleExpand} aria-label="Expandir">
                {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>{expanded ? "Voltar ao modo dividido" : "Expandir painel"}</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={iconBtn} aria-label="Mais opções">
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Estados de dados (demo)
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onDemoState("ok")}>
                <Check className="size-3.5" /> Dados completos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDemoState("empty")}>
                <ChevronsLeftRight className="size-3.5" /> Recorte vazio confirmado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDemoState("unconfirmed")}>
                <RefreshCw className="size-3.5" /> Dados não confirmados
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDemoState("error")} className="text-destructive">
                <X className="size-3.5" /> Simular erro de atualização
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className={iconBtn} onClick={onClose} aria-label="Fechar Lousa">
                <X className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Fechar Lousa (o painel continua salvo na conversa)</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
