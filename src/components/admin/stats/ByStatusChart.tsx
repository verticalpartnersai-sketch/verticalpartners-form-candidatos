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
import { COLORS, STATUS_LABELS } from "@/lib/constants"
import type { ApplicationStatus } from "@/types"

interface StatusCount {
  readonly status: ApplicationStatus
  readonly count: number
}

interface ByStatusChartProps {
  readonly data: readonly StatusCount[]
}

const STATUS_COLORS: Record<string, string> = COLORS.status

export function ByStatusChart({ data }: ByStatusChartProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] ?? item.status,
    value: item.count,
    status: item.status,
  }))

  return (
    <AdminCard title="POR STATUS">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <XAxis
            type="number"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#222052",
              border: "1px solid rgba(210, 182, 138, 0.2)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] ?? "#888"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AdminCard>
  )
}
