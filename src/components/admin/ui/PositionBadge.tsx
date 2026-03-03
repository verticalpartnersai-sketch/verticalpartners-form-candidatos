import { POSITION_LABELS, COLORS } from "@/lib/constants"

interface PositionBadgeProps {
  readonly position: string
}

export function PositionBadge({ position }: PositionBadgeProps) {
  const label = POSITION_LABELS[position] ?? position
  const color =
    COLORS.position[position as keyof typeof COLORS.position] ??
    COLORS.text.secondary

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
