import { AdminCard } from "@/components/admin/ui/AdminCard"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"
import { PositionBadge } from "@/components/admin/ui/PositionBadge"
import { StarRating } from "@/components/admin/ui/StarRating"
import { MiniDiscBars } from "@/components/admin/ui/MiniDiscBars"
import type { HiringApplication } from "@/types"

interface ComparisonTableProps {
  readonly applications: readonly HiringApplication[]
}

interface RowDef {
  readonly label: string
  readonly render: (app: HiringApplication) => React.ReactNode
}

const ROWS: readonly RowDef[] = [
  {
    label: "Nome",
    render: (app) => (
      <span className="font-medium text-white">{app.full_name}</span>
    ),
  },
  {
    label: "Cargo",
    render: (app) => <PositionBadge position={app.position} />,
  },
  {
    label: "Status",
    render: (app) => <StatusBadge status={app.status} />,
  },
  {
    label: "Rating",
    render: (app) => <StarRating value={app.admin_rating} size="sm" />,
  },
  {
    label: "D",
    render: (app) => (
      <span className="text-sm text-[#E74C3C]">
        {app.disc_scores?.D ?? "-"}
      </span>
    ),
  },
  {
    label: "I",
    render: (app) => (
      <span className="text-sm text-[#F1C40F]">
        {app.disc_scores?.I ?? "-"}
      </span>
    ),
  },
  {
    label: "S",
    render: (app) => (
      <span className="text-sm text-[#2ECC71]">
        {app.disc_scores?.S ?? "-"}
      </span>
    ),
  },
  {
    label: "C",
    render: (app) => (
      <span className="text-sm text-[#3498DB]">
        {app.disc_scores?.C ?? "-"}
      </span>
    ),
  },
  {
    label: "Perfil DISC",
    render: (app) => <MiniDiscBars scores={app.disc_scores} />,
  },
]

export function ComparisonTable({ applications }: ComparisonTableProps) {
  return (
    <AdminCard title="DADOS COMPARATIVOS">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.label}
                className="border-b border-[rgba(183,183,183,0.06)] last:border-b-0"
              >
                <td className="whitespace-nowrap py-3 pr-4 text-xs font-medium uppercase tracking-wider text-[#B7B7B7]">
                  {row.label}
                </td>
                {applications.map((app) => (
                  <td key={app.id} className="px-3 py-3">
                    {row.render(app)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  )
}
