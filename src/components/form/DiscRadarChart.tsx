import { useState } from "react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts"
import type { DiscScores, DiscFactor } from "@/types"

interface DiscRadarChartProps {
  scores: DiscScores
}

const FACTOR_LABELS: Readonly<Record<DiscFactor, string>> = {
  D: "Dominância",
  I: "Influência",
  S: "Estabilidade",
  C: "Conformidade",
}

function buildChartData(scores: DiscScores) {
  return [
    { factor: FACTOR_LABELS.D, value: scores.D, fullMark: 100 },
    { factor: FACTOR_LABELS.I, value: scores.I, fullMark: 100 },
    { factor: FACTOR_LABELS.S, value: scores.S, fullMark: 100 },
    { factor: FACTOR_LABELS.C, value: scores.C, fullMark: 100 },
  ]
}

export function DiscRadarChart({ scores }: DiscRadarChartProps) {
  const [animated, setAnimated] = useState(false)
  const data = buildChartData(animated ? scores : { D: 0, I: 0, S: 0, C: 0 })

  // Trigger animation on mount
  useState(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  })

  return (
    <div className="mx-auto" style={{ width: 280, height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="factor"
            tick={{
              fill: "rgba(255, 255, 255, 0.6)",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <Radar
            name="DISC"
            dataKey="value"
            stroke="#D2B68A"
            strokeWidth={2}
            fill="url(#goldGradient)"
            fillOpacity={0.3}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <defs>
            <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D2B68A" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#D2B68A" stopOpacity={0.1} />
            </radialGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
