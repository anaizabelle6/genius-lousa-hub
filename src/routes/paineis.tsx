import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BarChart3, Star, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { hydrateStore, removePanel, useBiStore } from "@/lib/bi/store";

export const Route = createFileRoute("/paineis")({
  head: () => ({
    meta: [
      { title: "Painéis salvos · ME Genius" },
      { name: "description", content: "Todos os painéis de compras que você salvou no ME Genius." },
      { property: "og:title", content: "Painéis salvos · ME Genius" },
      {
        property: "og:description",
        content: "Reabra painéis executivos de requisições, cotações e pedidos gerados pelo Genius.",
      },
    ],
  }),
  component: PaineisPage,
});

function PaineisPage() {
  const store = useBiStore();
  const navigate = useNavigate();

  useEffect(() => {
    hydrateStore();
  }, []);

  return (
    <AppShell>
      <div className="h-full overflow-y-auto scroll-slim px-10 py-10">
        <header className="mb-8">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Painéis</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Painéis marcados como favoritos ficam salvos neste navegador.
          </p>
        </header>

        {store.panels.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-24 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl bg-surface-muted">
              <Star className="size-5 text-muted-foreground" />
            </div>
            <h2 className="text-[16px] font-semibold text-foreground">Nenhum painel salvo</h2>
            <p className="max-w-sm text-[13.5px] text-muted-foreground">
              Gere um painel na conversa com o Genius e clique na estrela para salvá-lo aqui.
            </p>
            <Button size="sm" className="mt-1" onClick={() => navigate({ to: "/", search: () => ({}) })}>
              Ir para a conversa
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {store.panels.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-raised"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="size-4 text-primary" />
                  </span>
                  <button
                    type="button"
                    onClick={() => removePanel(p.id)}
                    className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    aria-label="Remover painel"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <h2 className="mt-3.5 text-[15px] font-semibold leading-snug text-foreground">{p.blueprint.title}</h2>
                <p className="mt-1 line-clamp-2 text-[12.5px] text-muted-foreground">{p.blueprint.subtitle}</p>
                <p className="num mt-3 text-[11.5px] text-muted-foreground">
                  {p.widgetCount} widgets · salvo em{" "}
                  {new Date(p.savedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => navigate({ to: "/", search: () => ({ panel: p.id }) })}
                >
                  Abrir painel
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
