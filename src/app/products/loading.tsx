export default function ProductsLoading() {
  return (
    <div className="mc-container py-10">
      <div className="h-10 w-48 animate-pulse rounded bg-zinc-200/70" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-zinc-200/60" />

      <div className="mc-card mt-6 grid gap-3 p-4 md:grid-cols-12">
        <div className="h-10 animate-pulse rounded bg-zinc-200/70 md:col-span-4" />
        <div className="h-10 animate-pulse rounded bg-zinc-200/70 md:col-span-3" />
        <div className="h-10 animate-pulse rounded bg-zinc-200/60 md:col-span-2" />
        <div className="h-10 animate-pulse rounded bg-zinc-200/60 md:col-span-2" />
        <div className="h-10 animate-pulse rounded bg-zinc-200/70 md:col-span-1" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="mc-card p-4">
            <div className="h-44 animate-pulse rounded-2xl bg-zinc-200/70" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-zinc-200/70" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-zinc-200/60" />
            <div className="mt-4 h-9 w-full animate-pulse rounded bg-zinc-200/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
