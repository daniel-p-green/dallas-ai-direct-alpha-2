export default function AdminPage() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Demo Controls
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Use this panel to rehearse fallback paths without privileged backend
        actions.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius)] border border-border bg-card px-4 text-sm font-semibold text-card-foreground"
        >
          Demo mode: on
        </button>
        <button
          type="button"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius)] border border-border bg-card px-4 text-sm font-semibold text-card-foreground"
        >
          Seed dataset: off
        </button>
        <button
          type="button"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius)] border border-border bg-card px-4 text-sm font-semibold text-card-foreground"
        >
          Polling: 5s
        </button>
      </div>
    </div>
  )
}
