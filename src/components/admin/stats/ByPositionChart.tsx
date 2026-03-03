import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import { COLORS, POSITION_LABELS } from "@/lib/constants"
import type { PositionId } from "@/types"

interface PositionCount {
  readonly position: PositionId
  readonly count: number
}

interface ByPositionChartProps {
  readonly data: readonly PositionCount[]
}

const POSITION_COLORS: Record<string, string> = COLORS.position

function formatLabel(props: {
  name?: string
  percent?: number
}) {
  const name = props.name ?? ""
  const pct = props.percent ?? 0
  return `${name} ${(pct * 100).toFixed(0)}%`
}

export function ByPositionChart({ data }: ByPositionChartProps) {
  const chartData = data.map((item) => ({
    name: POSITION_LABELS[item.position] ?? item.position,
    value: item.count,
    position: item.position,
  }))

  return (
    <AdminCard title="POR CARGO">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={formatLabel}
            labelLine={false}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.position}
                fill={POSITION_COLORS[entry.position] ?? "#888"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#222052",
              border: "1px solid rgba(210, 182, 138, 0.2)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </AdminCard>
  )
}
