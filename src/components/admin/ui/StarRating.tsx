import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  readonly value: number | null
  readonly onChange?: (rating: number) => void
  readonly size?: "sm" | "md"
}

const STAR_SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
} as const

const ACTIVE_COLOR = "#D2B68A"
const INACTIVE_COLOR = "rgba(255, 255, 255, 0.15)"

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const isInteractive = onChange !== undefined
  const displayValue = hovered ?? value ?? 0
  const sizeClass = STAR_SIZES[size]

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role="group"
      aria-label={`Avaliacao: ${value ?? 0} de 5 estrelas`}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!isInteractive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => isInteractive && setHovered(star)}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
          aria-pressed={value !== null && star <= value}
          className={[
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2B68A] rounded-sm",
            isInteractive
              ? "cursor-pointer hover:scale-110"
              : "cursor-default",
          ].join(" ")}
        >
          <Star
            className={sizeClass}
            fill={star <= displayValue ? ACTIVE_COLOR : "transparent"}
            stroke={star <= displayValue ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
        </button>
      ))}
    </div>
  )
}
