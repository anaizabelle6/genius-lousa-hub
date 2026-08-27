import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, MessagesSquare, Sparkles } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="flex w-[60px] shrink-0 flex-col items-center gap-1 border-r border-border bg-surface py-4">
        <span className="mb-4 flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <NavIcon to="/" label="Conversa" icon={<MessagesSquare className="size-4" />} />
        <NavIcon to="/paineis" label="Painéis" icon={<LayoutGrid className="size-4" />} />
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

function NavIcon({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <Link
      to={to}
      search={{}}
      title={label}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
    >
      {icon}
    </Link>
  );
}
