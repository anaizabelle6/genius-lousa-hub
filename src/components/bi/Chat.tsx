import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  BarChart3,
  Check,
  ChevronDown,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface AgentStep {
  label: string;
  state: "pending" | "running" | "done";
}

export interface ChatMessage {
  id: string;
  role: "user" | "genius";
  text: string;
  steps?: AgentStep[];
  result?: { dashboardId: string; widgetCount: number; title: string };
}

interface Props {
  messages: ChatMessage[];
  generating: boolean;
  draft: string;
  onDraft: (v: string) => void;
  onSend: (text: string) => void;
  onOpenDashboard: (id: string) => void;
}

const QUICK_PROMPTS = [
  "Gere um painel das minhas requisições, cotações e pedidos de 01/08/2026 a 26/08/2026 com indicadores, gráficos e tabelas.",
  "Quais requisições estão paradas em aprovação?",
  "Compare fornecedores por valor cotado.",
];

export function GeniusChat({ messages, generating, draft, onDraft, onSend, onOpenDashboard }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, generating]);

  function submit() {
    const text = draft.trim();
    if (!text || generating) return;
    onSend(text);
  }

  return (
    <section className="flex h-full min-w-0 flex-col border-r border-border bg-surface">
      <header className="flex items-center gap-3 border-b border-border px-5 py-3.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[14.5px] font-semibold leading-tight text-foreground">Genius</h2>
          <p className="truncate text-[12px] text-muted-foreground">Assistente de compras · BI Studio</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto scroll-slim px-5 py-5">
        {messages.length === 0 && (
          <div className="pt-6">
            <h3 className="text-[17px] font-semibold text-foreground">Como posso ajudar hoje?</h3>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
              Peça em linguagem natural. Se a pergunta pedir uma análise, eu monto o painel na Lousa ao lado.
            </p>
            <div className="mt-4 space-y-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onSend(p)}
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-[13px] leading-snug text-foreground/85 transition-all hover:border-primary/40 hover:bg-accent/50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onOpenDashboard={onOpenDashboard} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="rounded-xl border border-border bg-surface transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/20">
          <Textarea
            ref={taRef}
            value={draft}
            onChange={(e) => onDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Pergunte ao Genius em linguagem natural..."
            className="min-h-[76px] resize-none border-0 bg-transparent text-[13.5px] shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between px-3 pb-2.5">
            <span className="text-[11.5px] text-muted-foreground/80">
              Enter envia · Shift + Enter quebra linha
            </span>
            <button
              type="button"
              onClick={submit}
              disabled={!draft.trim() || generating}
              className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              aria-label="Enviar"
            >
              {generating ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MessageBubble({
  message,
  onOpenDashboard,
}: {
  message: ChatMessage;
  onOpenDashboard: (id: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end gap-2.5">
        <div className="max-w-[86%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-[13.5px] leading-relaxed text-accent-foreground">
          {message.text}
        </div>
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
          <User className="size-3.5 text-muted-foreground" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Sparkles className="size-3.5 text-primary" />
      </span>
      <div className="min-w-0 flex-1 space-y-2.5">
        {message.steps && <AgentProgress steps={message.steps} />}
        {message.text && (
          <p className="text-[13.5px] leading-relaxed text-foreground/90">{message.text}</p>
        )}
        {message.result && (
          <button
            type="button"
            onClick={() => onOpenDashboard(message.result!.dashboardId)}
            className="group flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-left transition-all hover:border-primary/40 hover:shadow-raised"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="size-4 text-primary" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-foreground">
                {message.result.title}
              </span>
              <span className="num block text-[12px] text-muted-foreground">
                {message.result.widgetCount} widgets
              </span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-[12.5px] font-medium text-primary">
              Ver painel ›
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function AgentProgress({ steps }: { steps: AgentStep[] }) {
  const [open, setOpen] = useState(true);
  const done = steps.filter((s) => s.state === "done").length;
  const running = steps.some((s) => s.state === "running");

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-xl border border-border bg-surface-muted/50">
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-left">
        {running ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
        ) : (
          <Check className="size-3.5 shrink-0 text-success" />
        )}
        <span className="flex-1 text-[12.5px] font-medium text-foreground">
          Agente de BI Studio
          <span className="num ml-1.5 font-normal text-muted-foreground">
            {done}/{steps.length}
          </span>
        </span>
        <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="space-y-1.5 border-t border-border/70 px-3 py-2.5">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-[12.5px]">
              {s.state === "done" ? (
                <Check className="size-3.5 shrink-0 text-success" />
              ) : s.state === "running" ? (
                <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
              ) : (
                <span className="size-3.5 shrink-0 rounded-full border border-border" />
              )}
              <span className={cn(s.state === "pending" ? "text-muted-foreground/60" : "text-foreground/85")}>
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
