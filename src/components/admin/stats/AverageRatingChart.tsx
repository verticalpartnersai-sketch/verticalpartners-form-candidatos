import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import { COLORS, POSITION_LABELS } from "@/lib/constants"
import type { PositionId } from "@/types"

interface PositionRatingAverage {
  readonly position: PositionId
  readonly average: number
}

interface AverageRatingChartProps {
  readonly data: readonly PositionRatingAverage[]
}

const POSITION_COLORS: Record<string, string> = COLORS.position

export function AverageRatingChart({ data }: AverageRatingChartProps) {
  const chartData = data.map((item) => ({
    name: POSITION_LABELS[item.position] ?? item.position,
    value: item.average,
    position: item.position,
  }))

  return (
    <AdminCard title="MEDIA RATING POR CARGO">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 5]}
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
            formatter={(value: number | string | undefined) => [
              typeof value === "number" ? value.toFixed(1) : String(value ?? 0),
              "Rating",
            ]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.position}
                fill={POSITION_COLORS[entry.position] ?? "#888"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AdminCard>
  )
}
