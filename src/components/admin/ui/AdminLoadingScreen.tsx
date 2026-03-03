function SkeletonLine({ className }: { readonly className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-white/[0.06] ${className ?? ""}`}
    />
  )
}

export function AdminLoadingScreen() {
  return (
    <div className="space-y-6" role="status" aria-label="Carregando conteudo">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonLine className="h-5 w-5 rounded-md" />
          <SkeletonLine className="h-6 w-40" />
          <SkeletonLine className="h-5 w-10 rounded-full" />
        </div>
        <SkeletonLine className="h-9 w-28 rounded-md" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-3">
        <SkeletonLine className="h-9 w-48" />
        <SkeletonLine className="h-9 w-32" />
        <SkeletonLine className="h-9 w-32" />
      </div>

      {/* Table skeleton */}
      <div className="space-y-0">
        {/* Header row */}
        <div className="flex gap-4 border-b border-white/[0.04] py-3">
          <SkeletonLine className="h-4 w-32" />
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-20" />
          <SkeletonLine className="h-4 w-20" />
          <SkeletonLine className="h-4 w-16" />
        </div>

        {/* Data rows */}
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-white/[0.02] py-4"
          >
            <div className="flex flex-col gap-1.5">
              <SkeletonLine className="h-4 w-36" />
              <SkeletonLine className="h-3 w-44" />
            </div>
            <SkeletonLine className="h-5 w-24 rounded-full" />
            <SkeletonLine className="h-3.5 w-16" />
            <SkeletonLine className="h-5 w-16 rounded-full" />
            <div className="flex gap-0.5">
              {Array.from({ length: 4 }, (_, j) => (
                <SkeletonLine key={j} className="h-3 w-6 rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">Carregando...</span>
    </div>
  )
}
