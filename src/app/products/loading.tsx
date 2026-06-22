export default function ProductsLoading() {
  return (
    <div className="mc-container py-12 md:py-16">
      <div className="h-9 w-64 animate-pulse rounded bg-surface" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-surface" />

      <div className="mt-8 h-24 animate-pulse rounded-[var(--r-lg)] border border-line bg-surface" />

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item}>
            <div className="aspect-[4/5] animate-pulse rounded-[var(--r-lg)] bg-surface" />
            <div className="mt-3.5 h-4 w-3/4 animate-pulse rounded bg-surface" />
            <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
