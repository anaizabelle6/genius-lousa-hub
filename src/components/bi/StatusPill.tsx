import { cn } from "@/lib/utils";

const MAP: Record<string, string> = {
  "Em Aprovação": "bg-warning/12 text-warning-foreground dark:text-warning border-warning/30",
  Aprovado: "bg-success/12 text-success border-success/30",
  Cancelado: "bg-destructive/10 text-destructive border-destructive/25",
  "Aguardando Resposta": "bg-warning/12 text-warning-foreground dark:text-warning border-warning/30",
  Finalizado: "bg-success/12 text-success border-success/30",
  "Em Análise de Negociação": "bg-info/10 text-info border-info/25",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
        MAP[status] ?? "border-border bg-surface-muted text-muted-foreground",
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
