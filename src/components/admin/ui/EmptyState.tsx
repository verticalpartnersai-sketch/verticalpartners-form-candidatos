interface EmptyStateProps {
  readonly title: string
  readonly description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <h3 className="text-sm font-medium text-[#B7B7B7]">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
