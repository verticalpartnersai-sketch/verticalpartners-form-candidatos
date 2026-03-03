import { DISC_FACTOR_COLORS } from "@/lib/constants"
import type { DiscScores } from "@/types"

interface MiniDiscBarsProps {
  readonly scores: DiscScores | null
}

const FACTORS = ["D", "I", "S", "C"] as const

export function MiniDiscBars({ scores }: MiniDiscBarsProps) {
  if (!scores) {
    return <span className="text-xs text-[rgba(255,255,255,0.5)]">&mdash;</span>
  }

  return (
    <div className="flex flex-col gap-0.5">
      {FACTORS.map((factor) => (
        <div key={factor} className="flex items-center gap-1">
          <span className="w-3 text-[9px] font-medium text-[#B7B7B7]">
            {factor}
          </span>
          <div className="h-[3px] w-[50px] rounded-full bg-[rgba(255,255,255,0.05)]">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${scores[factor]}%`,
                backgroundColor: DISC_FACTOR_COLORS[factor],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
