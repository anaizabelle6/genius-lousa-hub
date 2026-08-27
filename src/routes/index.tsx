import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { GeniusChat, type ChatMessage, type AgentStep } from "@/components/bi/Chat";
import { Lousa } from "@/components/bi/Lousa";
import type { DemoState } from "@/components/bi/DashboardHeader";
import { composeBlueprint } from "@/lib/bi/composer";
import type { DashboardBlueprint } from "@/lib/bi/types";
import {
  getLayout,
  hydrateStore,
  isPanelSaved,
  removePanel,
  savePanel,
  setWidgetOverride,
  updateLayout,
  useBiStore,
} from "@/lib/bi/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    panel: typeof search["panel"] === "string" ? (search["panel"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "ME Genius · Assistente de BI para compras" },
      {
        name: "description",
        content:
          "Converse com o Genius e gere painéis executivos de requisições, cotações e pedidos em segundos.",
      },
      { property: "og:title", content: "ME Genius · Assistente de BI para compras" },
      {
        property: "og:description",
        content: "Painéis de compras gerados por IA, com indicadores, análises e dados validados.",
      },
    ],
  }),
  component: Workspace,
});

const AGENT_LABELS = ["Requisições", "Cotações", "Pedidos", "Estruturando análise", "Painel criado"];
const REVEAL_PLAN: string[][] = [
  ["sec_overview"],
  ["sec_flow", "sec_value"],
  ["sec_trend"],
  ["sec_insights", "sec_actions", "sec_detail"],
];

function Workspace() {
  const navigate = useNavigate();
  const { panel: panelParam } = Route.useSearch();
  const store = useBiStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [blueprint, setBlueprint] = useState<DashboardBlueprint | null>(null);
  const [lousaOpen, setLousaOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [tab, setTab] = useState<"painel" | "dados">("painel");
  const [generating, setGenerating] = useState(false);
  const [visibleSectionIds, setVisibleSectionIds] = useState<string[]>([]);
  const [pendingSections, setPendingSections] = useState(0);
  const [applyingWidgetId, setApplyingWidgetId] = useState<string | null>(null);
  const [demoState, setDemoState] = useState<DemoState>("ok");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("—");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    hydrateStore();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!panelParam) return;
    const saved = store.panels.find((p) => p.id === panelParam);
    if (saved) {
      setBlueprint(saved.blueprint);
      setLousaOpen(true);
      setUpdatedAt(new Date(saved.savedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      setVisibleSectionIds(saved.blueprint.sections.map((s) => s.id));
      setMessages((m) =>
        m.length
          ? m
          : [
              {
                id: "restored",
                role: "genius",
                text: `Reabri o painel salvo "${saved.blueprint.title}". Você pode continuar explorando na Lousa.`,
                result: {
                  dashboardId: saved.id,
                  widgetCount: saved.widgetCount,
                  title: "Dashboard atualizado",
                },
              },
            ],
      );
      void navigate({ to: "/", search: {}, replace: true });
    }
  }, [panelParam, store.panels, navigate]);

  const layout = blueprint ? getLayout(blueprint.id) : null;
  void store.layouts;

  const widgetCount = useMemo(() => {
    if (!blueprint || !layout) return 0;
    return blueprint.sections.reduce(
      (a, s) => a + s.widgets.filter((w) => !layout.widgets[w.id]?.hidden).length,
      0,
    );
  }, [blueprint, layout]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const runGeneration = useCallback(
    (prompt: string) => {
      const msgId = `g_${Date.now()}`;
      const bp = composeBlueprint("dash_conversa_1");
      setMessages((m) => [
        ...m,
        { id: `u_${Date.now()}`, role: "user", text: prompt },
        {
          id: msgId,
          role: "genius",
          text: "",
          steps: AGENT_LABELS.map((label, i) => ({
            label,
            state: i === 0 ? "running" : "pending",
          })) as AgentStep[],
        },
      ]);
      setGenerating(true);
      setDemoState("ok");
      setBlueprint(bp);
      setTab("painel");
      setVisibleSectionIds([]);
      setPendingSections(3);
      setLousaOpen(true);

      const setStep = (index: number) =>
        setMessages((m) =>
          m.map((msg) =>
            msg.id === msgId && msg.steps
              ? {
                  ...msg,
                  steps: msg.steps.map((s, i) => ({
                    ...s,
                    state: i < index ? "done" : i === index ? "running" : "pending",
                  })),
                }
              : msg,
          ),
        );

      [700, 1200, 1700, 2300].forEach((ms, i) => schedule(() => setStep(i + 1), ms));

      REVEAL_PLAN.forEach((ids, i) => {
        schedule(
          () => {
            setVisibleSectionIds((prev) => [...prev, ...ids]);
            setPendingSections(Math.max(0, 3 - i));
          },
          900 + i * 620,
        );
      });

      schedule(() => {
        setGenerating(false);
        setPendingSections(0);
        setUpdatedAt(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
        setMessages((m) =>
          m.map((msg) =>
            msg.id === msgId
              ? {
                  ...msg,
                  steps: msg.steps?.map((s) => ({ ...s, state: "done" as const })),
                  text: "Montei o painel com o panorama das suas requisições, cotações e pedidos. Você pode explorar os indicadores, análises e dados na Lousa.",
                  result: {
                    dashboardId: bp.id,
                    widgetCount: bp.sections.reduce((a, s) => a + s.widgets.length, 0),
                    title: "Dashboard atualizado",
                  },
                }
              : msg,
          ),
        );
      }, 3100);
    },
    [schedule],
  );

  const handleSend = useCallback(
    (text: string) => {
      setDraft("");
      const wantsDashboard = /painel|dashboard|indicad|gráfic|grafic|compar|analis|análise|evolu|detalh|revisar/i.test(
        text,
      );
      if (wantsDashboard) {
        runGeneration(text);
        return;
      }
      setMessages((m) => [
        ...m,
        { id: `u_${Date.now()}`, role: "user", text },
        {
          id: `a_${Date.now()}`,
          role: "genius",
          text: "Posso responder com um painel completo na Lousa. Peça, por exemplo, um panorama de requisições, cotações e pedidos do período.",
        },
      ]);
    },
    [runGeneration],
  );

  const askFromDashboard = useCallback(
    (text: string) => {
      setDraft(text);
      setChatCollapsed(false);
      setExpanded(false);
      handleSend(text);
    },
    [handleSend],
  );

  function refresh(silent = false) {
    if (!blueprint) return;
    setRefreshing(true);
    setDemoState("ok");
    setTimeout(() => {
      setRefreshing(false);
      setUpdatedAt(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      if (!silent) toast.success("Dados atualizados", { description: "Datasets revalidados no Dataset Registry." });
    }, 1400);
  }

  function toggleSave() {
    if (!blueprint) return;
    if (isPanelSaved(blueprint.id)) {
      removePanel(blueprint.id);
      toast("Removido dos painéis");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      savePanel(blueprint, widgetCount);
      setSaving(false);
      toast.success("Salvo em Painéis", { description: blueprint.title });
    }, 700);
  }

  const saved = blueprint ? store.panels.some((p) => p.id === blueprint.id) : false;

  // widget operations
  const widgetOps = blueprint && layout
    ? {
        rename: (id: string, title: string) => setWidgetOverride(blueprint.id, id, { title }),
        remove: (id: string) => {
          setWidgetOverride(blueprint.id, id, { hidden: true });
          toast("Widget removido", {
            action: { label: "Desfazer", onClick: () => setWidgetOverride(blueprint.id, id, { hidden: false }) },
          });
        },
        toggleLock: (id: string) =>
          setWidgetOverride(blueprint.id, id, { locked: !layout.widgets[id]?.locked }),
        resize: (id: string, span: number) => setWidgetOverride(blueprint.id, id, { span }),
        aiEdit: (id: string, instruction: string) => {
          setApplyingWidgetId(id);
          setTimeout(() => {
            setWidgetOverride(blueprint.id, id, { variant: variantFor(instruction, layout.widgets[id]?.variant) });
            setApplyingWidgetId(null);
            toast.success("Widget atualizado pelo Genius", { description: instruction });
          }, 1100);
        },
        reorder: (sectionId: string, fromId: string, toId: string) => {
          const section = blueprint.sections.find((s) => s.id === sectionId);
          if (!section) return;
          const base = layout.order[sectionId]?.length
            ? [...layout.order[sectionId]!]
            : section.widgets.map((w) => w.id);
          const from = base.indexOf(fromId);
          const to = base.indexOf(toId);
          if (from < 0 || to < 0) return;
          base.splice(to, 0, ...base.splice(from, 1));
          updateLayout(blueprint.id, { order: { ...layout.order, [sectionId]: base } });
        },
      }
    : null;

  return (
    <AppShell>
      <div className="flex h-full min-h-0">
        {!(expanded && lousaOpen) && !chatCollapsed && (
          <div
            className={cn(
              "h-full min-w-0 shrink-0 transition-all duration-300",
              lousaOpen ? "w-[38%] min-w-[380px]" : "w-full",
            )}
          >
            <GeniusChat
              messages={messages}
              generating={generating}
              draft={draft}
              onDraft={setDraft}
              onSend={handleSend}
              onOpenDashboard={() => {
                setLousaOpen(true);
                setChatCollapsed(false);
              }}
            />
          </div>
        )}

        {lousaOpen && blueprint && layout && widgetOps ? (
          <div className="relative h-full min-w-0 flex-1">
            {(expanded || chatCollapsed) && (
              <Button
                variant="outline"
                size="sm"
                className="absolute left-4 top-[74px] z-20 h-7 gap-1.5"
                onClick={() => {
                  setExpanded(false);
                  setChatCollapsed(false);
                }}
              >
                <PanelLeftOpen className="size-3.5" /> Conversa
              </Button>
            )}
            {!expanded && !chatCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-[74px] z-20 h-7 gap-1.5 text-muted-foreground"
                onClick={() => setChatCollapsed(true)}
              >
                <PanelLeftClose className="size-3.5" />
              </Button>
            )}
            <Lousa
              blueprint={blueprint}
              layout={layout}
              tab={tab}
              onTab={setTab}
              generating={generating}
              visibleSectionIds={visibleSectionIds}
              pendingSectionCount={pendingSections}
              applyingWidgetId={applyingWidgetId}
              demoState={demoState}
              updatedAt={updatedAt}
              onRetry={() => refresh()}
              headerProps={{
                saved,
                saving,
                refreshing,
                expanded,
                onChangeTitle: (title, subtitle) =>
                  setBlueprint((bp) => (bp ? { ...bp, title, subtitle } : bp)),
                onToggleSave: toggleSave,
                onRefresh: () => refresh(),
                onToggleExpand: () => setExpanded((e) => !e),
                onClose: () => {
                  setLousaOpen(false);
                  setExpanded(false);
                  setChatCollapsed(false);
                  toast("Lousa fechada", { description: "O painel continua disponível na conversa." });
                },
                onDemoState: (s) => {
                  setDemoState(s);
                  if (s === "error") toast.error("Falha temporária ao atualizar os dados");
                },
              }}
              canvasHandlers={{
                onWidget: widgetOps,
                onSectionTitle: (sectionId, title) =>
                  updateLayout(blueprint.id, {
                    sectionTitles: { ...layout.sectionTitles, [sectionId]: title },
                  }),
                onAddSection: () =>
                  updateLayout(blueprint.id, {
                    extraSections: [
                      ...layout.extraSections,
                      { id: `sec_custom_${Date.now()}`, title: "Nova seção" },
                    ],
                  }),
                onAsk: askFromDashboard,
              }}
            />
          </div>
        ) : (
          lousaOpen && (
            <div className="flex flex-1 items-center justify-center">
              <Sparkles className="size-5 animate-pulse text-primary" />
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}

function variantFor(instruction: string, current?: string): string {
  const t = instruction.toLowerCase();
  if (/percent|%/.test(t)) return "percent";
  if (/rosca|donut|pizza/.test(t)) return "donut";
  if (/horizont/.test(t)) return "horizontal";
  if (/vertical|coluna/.test(t)) return "vertical";
  if (/linha|line/.test(t)) return "line";
  if (/ranking|ordenar/.test(t)) return "horizontal";
  if (/barra/.test(t)) return "bars";
  return current === "percent" ? "horizontal" : "percent";
}
