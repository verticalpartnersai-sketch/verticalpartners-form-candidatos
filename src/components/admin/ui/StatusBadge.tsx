import { STATUS_LABELS, COLORS } from "@/lib/constants"

interface StatusBadgeProps {
  readonly status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status
  const color =
    COLORS.status[status as keyof typeof COLORS.status] ?? COLORS.text.secondary

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${color}26`,
        color,
      }}
    >
      {label}
    </span>
  )
}
