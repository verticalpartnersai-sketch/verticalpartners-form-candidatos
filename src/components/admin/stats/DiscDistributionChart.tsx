import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import { DISC_FACTOR_COLORS, POSITION_LABELS } from "@/lib/constants"
import type { PositionId, DiscScores } from "@/types"

interface PositionDiscAverage {
  readonly position: PositionId
  readonly scores: DiscScores
}

interface DiscDistributionChartProps {
  readonly data: readonly PositionDiscAverage[]
}

const FACTORS = ["D", "I", "S", "C"] as const

export function DiscDistributionChart({ data }: DiscDistributionChartProps) {
  const chartData = data.map((item) => ({
    position: POSITION_LABELS[item.position] ?? item.position,
    D: item.scores.D,
    I: item.scores.I,
    S: item.scores.S,
    C: item.scores.C,
  }))

  return (
    <AdminCard title="DISTRIBUICAO DISC POR CARGO">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="position"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#222052",
              border: "1px solid rgba(210, 182, 138, 0.2)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend
            wrapperStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
          {FACTORS.map((factor) => (
            <Bar
              key={factor}
              dataKey={factor}
              fill={DISC_FACTOR_COLORS[factor]}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </AdminCard>
  )
}
