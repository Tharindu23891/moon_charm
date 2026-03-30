export default function ProductDetailsLoading() {
  return (
    <div className="mc-container py-10">
      <div className="h-6 w-40 animate-pulse rounded bg-zinc-200/70" />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <div className="mc-card aspect-4/3 animate-pulse p-0">
            <div className="h-full w-full rounded-2xl bg-zinc-200/70" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="mc-card aspect-square animate-pulse p-0">
                <div className="h-full w-full rounded-xl bg-zinc-200/70" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200/70" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200/60" />
          <div className="h-20 w-full animate-pulse rounded bg-zinc-200/60" />
          <div className="mc-card p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200/70" />
            <div className="mt-3 h-5 w-28 animate-pulse rounded bg-zinc-200/60" />
            <div className="mt-4 h-10 w-full animate-pulse rounded bg-zinc-200/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
