export function DashboardSkeleton() {
  return (
    <main className="mx-auto max-w-3xl animate-pulse px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="bg-accent h-8 w-40 rounded" />
        <div className="bg-accent h-8 w-48 rounded" />
      </div>
      <div className="bg-accent mb-8 h-28 rounded-lg" />
      <div className="mb-8 space-y-2">
        <div className="bg-accent h-10 rounded" />
        <div className="bg-accent h-10 w-3/4 rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-border h-20 rounded border" />
        ))}
      </div>
    </main>
  );
}

export function InsightsSkeleton() {
  return (
    <main className="mx-auto max-w-3xl animate-pulse px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="bg-accent h-8 w-32 rounded" />
        <div className="bg-accent h-8 w-48 rounded" />
      </div>
      <div className="space-y-10">
        <div className="bg-accent h-52 rounded-lg" />
        <div className="bg-accent h-40 rounded-lg" />
        <div className="bg-accent h-56 rounded-lg" />
      </div>
    </main>
  );
}
