import { AdminCard } from "@/components/admin/ui/AdminCard"
import { PositionBadge } from "@/components/admin/ui/PositionBadge"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"
import { formatFullDate } from "@/lib/format-date"
import type { HiringApplication } from "@/types"

interface BasicDataSectionProps {
  readonly application: HiringApplication
}

interface DataFieldProps {
  readonly label: string
  readonly value: string | null
  readonly isLink?: boolean
}

function DataField({ label, value, isLink = false }: DataFieldProps) {
  if (!value) return null

  return (
    <div>
      <dt className="text-xs font-medium text-[#B7B7B7]">{label}</dt>
      <dd className="mt-0.5 text-sm text-white">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D2B68A] transition-opacity hover:opacity-80"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

export function BasicDataSection({ application }: BasicDataSectionProps) {
  return (
    <AdminCard>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">
          {application.full_name}
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <PositionBadge position={application.position} />
          <StatusBadge status={application.status} />
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DataField label="Email" value={application.email} />
        <DataField label="Telefone" value={application.phone} />
        <DataField label="LinkedIn" value={application.linkedin} isLink />
        <DataField label="Cidade" value={application.city} />
        <DataField
          label="Pretensao Salarial"
          value={application.salary_expectation}
        />
        <DataField label="GitHub" value={application.github} isLink />
        <DataField label="Portfolio" value={application.portfolio} isLink />
        <DataField
          label="Disponibilidade"
          value={application.availability}
        />
        <DataField
          label="Enviado em"
          value={formatFullDate(application.submitted_at)}
        />
      </dl>
    </AdminCard>
  )
}
