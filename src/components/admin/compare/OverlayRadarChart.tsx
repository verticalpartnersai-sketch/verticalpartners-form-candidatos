import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import type { DiscScores } from "@/types"

interface CandidateRadar {
  readonly name: string
  readonly scores: DiscScores
  readonly color: string
}

interface OverlayRadarChartProps {
  readonly candidates: readonly CandidateRadar[]
}

const DISC_LABELS = [
  "Dominancia",
  "Influencia",
  "Estabilidade",
  "Conformidade",
] as const

const DISC_KEYS: readonly (keyof DiscScores)[] = ["D", "I", "S", "C"]

function buildRadarData(
  candidates: readonly CandidateRadar[],
): readonly Record<string, string | number>[] {
  return DISC_LABELS.map((label, index) => {
    const entry: Record<string, string | number> = { factor: label }
    for (const candidate of candidates) {
      entry[candidate.name] = candidate.scores[DISC_KEYS[index]]
    }
    return entry
  })
}

export function OverlayRadarChart({ candidates }: OverlayRadarChartProps) {
  const data = buildRadarData(candidates)

  return (
    <AdminCard title="COMPARATIVO DISC">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid
            stroke="rgba(255,255,255,0.1)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="factor"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
            axisLine={false}
          />
          {candidates.map((candidate) => (
            <Radar
              key={candidate.name}
              name={candidate.name}
              dataKey={candidate.name}
              stroke={candidate.color}
              fill={candidate.color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          ))}
          <Legend
            wrapperStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </AdminCard>
  )
}
