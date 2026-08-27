import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-surface-muted", className)} />;
}

export function SectionSkeleton({ variant = "charts" }: { variant?: "kpi" | "charts" | "editorial" }) {
  return (
    <section className="animate-rise">
      <div className="flex items-end justify-between border-b border-border/70 pb-2">
        <Block className="h-3.5 w-40" />
        <Block className="h-3 w-16" />
      </div>
      <div className="mt-3.5 grid grid-cols-12 gap-3.5">
        {variant === "kpi" &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-span-12 sm:col-span-6 xl:col-span-3">
              <div className="surface-card h-[118px] p-4">
                <Block className="h-3 w-24" />
                <Block className="mt-4 h-7 w-20" />
                <Block className="mt-4 h-2.5 w-32" />
              </div>
            </div>
          ))}
        {variant === "charts" &&
          [6, 6, 4, 8].map((span, i) => (
            <div key={i} className={span === 6 ? "col-span-12 lg:col-span-6" : span === 4 ? "col-span-12 lg:col-span-4" : "col-span-12 lg:col-span-8"}>
              <div className="surface-card p-4">
                <Block className="h-3.5 w-40" />
                <Block className="mt-2 h-2.5 w-56" />
                <div className="mt-4 flex h-[210px] items-end gap-3">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Block key={j} className="flex-1" style={undefined} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        {variant === "editorial" &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="col-span-12">
              <div className="surface-card p-4">
                <Block className="h-3.5 w-64" />
                <Block className="mt-2 h-2.5 w-[70%]" />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-9">
      <SectionSkeleton variant="kpi" />
      <SectionSkeleton variant="charts" />
    </div>
  );
}
