import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Filter,
  Rows3,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { brl, int, orderTable, quotationTable, requisitionTable } from "@/lib/bi/mockData";
import type { DatasetMeta, TableSpec } from "@/lib/bi/types";
import { StatusPill } from "./StatusPill";

const ENTITIES = [
  { key: "requisicoes", label: "Requisições", table: requisitionTable, title: "Detalhe das requisições" },
  { key: "cotacoes", label: "Cotações", table: quotationTable, title: "Detalhe das cotações" },
  { key: "pedidos", label: "Pedidos", table: orderTable, title: "Detalhe dos pedidos" },
] as const;

const FOLLOW_UPS = [
  "Detalhar requisições ainda em aprovação?",
  "Comparar fornecedores por concentração de valor?",
  "Revisar cotações aguardando resposta?",
  "Analisar evolução por categoria?",
];

export function DataExplorer({
  datasets,
  onAsk,
}: {
  datasets: DatasetMeta[];
  onAsk: (text: string) => void;
}) {
  const [entity, setEntity] = useState<(typeof ENTITIES)[number]["key"]>("requisicoes");
  const [query, setQuery] = useState("");
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(1);
  const [hiddenCols, setHiddenCols] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const active = ENTITIES.find((e) => e.key === entity)!;
  const meta = datasets.find((d) => d.entity === entity);
  const table: TableSpec = active.table;
  const pageSize = dense ? 14 : 8;

  const statuses = useMemo(
    () => Array.from(new Set(table.rows.map((r) => String(r["status"] ?? "")))).filter(Boolean),
    [table],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return table.rows.filter((r) => {
      const matchesQuery = !q || Object.values(r).some((v) => String(v).toLowerCase().includes(q));
      const matchesStatus = !statusFilter.length || statusFilter.includes(String(r["status"] ?? ""));
      return matchesQuery && matchesStatus;
    });
  }, [table, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, totalPages);
  const pageRows = rows.slice((current - 1) * pageSize, current * pageSize);
  const columns = table.columns.filter((c) => !hiddenCols.includes(c.key));

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h2 className="text-[17px] font-semibold text-foreground">Dados do painel</h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Datasets validados que sustentam cada widget deste painel.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ENTITIES.map((e) => {
            const m = datasets.find((d) => d.entity === e.key);
            const isActive = e.key === entity;
            return (
              <button
                key={e.key}
                type="button"
                onClick={() => {
                  setEntity(e.key);
                  setPage(1);
                  setStatusFilter([]);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[13.5px] font-medium transition-all",
                  isActive
                    ? "border-primary/40 bg-accent text-foreground shadow-card"
                    : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {e.label}
                <span
                  className={cn(
                    "num rounded-md px-1.5 py-0.5 text-[11.5px]",
                    m?.records === null ? "bg-warning/15 text-warning" : "bg-surface-muted text-muted-foreground",
                  )}
                >
                  {m?.records === null || m?.records === undefined ? "—" : int(m.records)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">{active.title}</h3>
            <p className="num text-[12px] text-muted-foreground">
              {meta?.records === null ? "Dados não confirmados nesta atualização" : `${int(rows.length)} registros no período`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar"
                className="h-8 w-52 pl-8 text-[13px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Columns3 className="size-3.5" /> Colunas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wide">Exibir colunas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table.columns.map((c) => (
                  <label
                    key={c.key}
                    className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-[13px] hover:bg-accent"
                  >
                    <Checkbox
                      checked={!hiddenCols.includes(c.key)}
                      onCheckedChange={(v) =>
                        setHiddenCols((prev) => (v ? prev.filter((k) => k !== c.key) : [...prev, c.key]))
                      }
                    />
                    {c.label}
                  </label>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Filter className="size-3.5" /> Filtros
                  {statusFilter.length > 0 && (
                    <span className="num rounded bg-primary/10 px-1 text-[11px] text-primary">{statusFilter.length}</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wide">Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statuses.length ? (
                  statuses.map((s) => (
                    <label key={s} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-[13px] hover:bg-accent">
                      <Checkbox
                        checked={statusFilter.includes(s)}
                        onCheckedChange={(v) =>
                          setStatusFilter((prev) => (v ? [...prev, s] : prev.filter((x) => x !== s)))
                        }
                      />
                      {s}
                    </label>
                  ))
                ) : (
                  <p className="px-2 py-2 text-[12.5px] text-muted-foreground">Sem status disponíveis.</p>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setDense((d) => !d)}>
              <Rows3 className="size-3.5" /> {dense ? "Densidade compacta" : "Densidade padrão"}
            </Button>
          </div>
        </div>

        {pageRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="text-[14px] font-medium text-foreground">
              {meta?.records === null ? "Não foi possível confirmar os dados nesta atualização." : "Sem resultados no recorte."}
            </p>
            <p className="max-w-md text-[13px] text-muted-foreground">
              {meta?.records === null
                ? "O dataset de pedidos não retornou validação completa. Atualize os dados para tentar novamente."
                : "Ajuste a busca ou os filtros para ver outros registros."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scroll-slim">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-surface-muted">
                  {columns.map((c, i) => (
                    <th
                      key={c.key}
                      className={cn(
                        "whitespace-nowrap px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                        c.align === "right" && "text-right",
                        i === 0 && "sticky left-0 z-10 bg-surface-muted",
                      )}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, ri) => (
                  <tr key={ri} className="border-t border-border/70 transition-colors hover:bg-surface-muted/50">
                    {columns.map((c, i) => {
                      const v = row[c.key];
                      return (
                        <td
                          key={c.key}
                          title={String(v ?? "")}
                          className={cn(
                            "max-w-[280px] truncate px-3.5 text-foreground/90",
                            dense ? "py-1.5" : "py-2.5",
                            c.align === "right" && "num text-right",
                            i === 0 && "num sticky left-0 z-10 bg-surface font-medium",
                          )}
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
        )}

        {pageRows.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <p className="num text-[12px] text-muted-foreground">
              {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, rows.length)} de {int(rows.length)}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="num px-2 text-[12.5px] text-muted-foreground">
                {current} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                disabled={current === totalPages}
                onClick={() => setPage(current + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {meta && (
        <Collapsible className="rounded-xl border border-border bg-surface">
          <CollapsibleTrigger className="group flex w-full items-center justify-between px-4 py-3 text-left">
            <span className="text-[13px] font-medium text-muted-foreground">Detalhes técnicos</span>
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border px-4 py-3 text-[12.5px] md:grid-cols-4">
              {[
                ["dataset_ref", meta.ref],
                ["fingerprint", meta.fingerprint],
                ["provenance", meta.provenance],
                ["transport", meta.transport],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] uppercase tracking-wide text-muted-foreground/70">{k}</dt>
                  <dd className="num mt-0.5 break-words text-foreground/80">{v}</dd>
                </div>
              ))}
            </dl>
          </CollapsibleContent>
        </Collapsible>
      )}

      <div>
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Continuar a análise
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {FOLLOW_UPS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onAsk(f)}
              className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left text-[13.5px] text-foreground transition-all hover:border-primary/40 hover:bg-accent/50 hover:shadow-card"
            >
              {f}
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
