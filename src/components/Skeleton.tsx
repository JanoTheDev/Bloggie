function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-neutral-800 rounded ${className || ""}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
      {/* Image placeholder */}
      <Shimmer className="aspect-[3/2] w-full rounded-none" />

      <div className="p-4 space-y-3">
        {/* Tags */}
        <div className="flex gap-2">
          <Shimmer className="h-5 w-16 rounded-full" />
          <Shimmer className="h-5 w-20 rounded-full" />
        </div>

        {/* Author */}
        <div className="flex items-center gap-2">
          <Shimmer className="h-6 w-6 rounded-full" />
          <Shimmer className="h-4 w-24" />
        </div>

        {/* Title */}
        <Shimmer className="h-6 w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-5/6" />
        </div>

        {/* Stats */}
        <div className="flex gap-4 pt-1">
          <Shimmer className="h-4 w-12" />
          <Shimmer className="h-4 w-12" />
          <Shimmer className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonUserCard() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
      {/* Avatar */}
      <Shimmer className="h-12 w-12 shrink-0 rounded-full" />

      {/* Text lines */}
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-3 w-48" />
      </div>

      {/* Button */}
      <Shimmer className="h-9 w-20 shrink-0 rounded-lg" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
