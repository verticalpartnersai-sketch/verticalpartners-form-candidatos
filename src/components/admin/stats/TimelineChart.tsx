import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { AdminCard } from "@/components/admin/ui/AdminCard"

interface TimelineEntry {
  readonly date: string
  readonly count: number
}

interface TimelineChartProps {
  readonly data: readonly TimelineEntry[]
}

function formatDateLabel(date: string): string {
  const parts = date.split("-")
  return `${parts[2]}/${parts[1]}`
}

function filterTickLabels(
  _value: string,
  index: number,
  total: readonly string[],
): string {
  if (index % 5 === 0 || index === total.length - 1) {
    return formatDateLabel(_value)
  }
  return ""
}

export function TimelineChart({ data }: TimelineChartProps) {
  const chartData = data.map((entry) => ({
    ...entry,
    label: formatDateLabel(entry.date),
  }))

  const dates = chartData.map((d) => d.date)

  return (
    <AdminCard title="ULTIMOS 30 DIAS">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D2B68A" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#D2B68A" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
            tickFormatter={(value, index) =>
              filterTickLabels(value, index, dates)
            }
          />
          <YAxis
            allowDecimals={false}
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
            labelFormatter={(label) => formatDateLabel(String(label))}
            formatter={(value) => [value, "Candidaturas"]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#D2B68A"
            strokeWidth={2}
            fill="url(#goldGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </AdminCard>
  )
}
