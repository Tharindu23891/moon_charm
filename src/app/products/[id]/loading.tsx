export default function ProductDetailsLoading() {
  return (
    <div className="mc-container py-8 md:py-12">
      <div className="h-5 w-48 animate-pulse rounded bg-surface" />

      <div className="mt-7 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="aspect-[4/5] animate-pulse rounded-[var(--r-xl)] bg-surface" />
          <div className="mt-3 grid grid-cols-5 gap-2.5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="aspect-square animate-pulse rounded-[var(--r)] bg-surface" />
            ))}
          </div>
        </div>

        <div>
          <div className="h-7 w-28 animate-pulse rounded-full bg-surface" />
          <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-surface" />
          <div className="mt-4 h-16 w-full animate-pulse rounded bg-surface" />
          <div className="mt-7 h-56 w-full animate-pulse rounded-[var(--r-lg)] bg-surface" />
        </div>
      </div>
    </div>
  );
}
