import { AdminCard } from "@/components/admin/ui/AdminCard"

interface TotalApplicationsCardProps {
  readonly total: number
}

export function TotalApplicationsCard({ total }: TotalApplicationsCardProps) {
  return (
    <AdminCard title="TOTAL CANDIDATURAS">
      <div className="flex flex-col items-center justify-center py-6">
        <span className="text-5xl font-bold text-[#D2B68A]">{total}</span>
        <span className="mt-2 text-xs text-[rgba(255,255,255,0.5)]">
          candidaturas recebidas
        </span>
      </div>
    </AdminCard>
  )
}
