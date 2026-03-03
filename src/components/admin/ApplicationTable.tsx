import { Link, useNavigate } from "react-router-dom"
import { Eye, Check, X } from "lucide-react"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"
import { PositionBadge } from "@/components/admin/ui/PositionBadge"
import { StarRating } from "@/components/admin/ui/StarRating"
import { MiniDiscBars } from "@/components/admin/ui/MiniDiscBars"
import { formatRelativeDate } from "@/lib/format-date"
import {
  updateApplicationStatus,
  updateApplicationRating,
} from "@/lib/admin-queries"
import { useAuth } from "@/hooks/useAuth"
import type { HiringApplication } from "@/types"

interface ApplicationTableProps {
  readonly applications: readonly HiringApplication[]
  readonly onRefetch: () => void
}

export function ApplicationTable({
  applications,
  onRefetch,
}: ApplicationTableProps) {
  return (
    <>
      <DesktopTable applications={applications} onRefetch={onRefetch} />
      <MobileCards applications={applications} onRefetch={onRefetch} />
    </>
  )
}

function DesktopTable({
  applications,
  onRefetch,
}: ApplicationTableProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleStatusChange(
    id: string,
    status: "approved" | "rejected",
  ) {
    try {
      const result = await updateApplicationStatus(
        id,
        status,
        user?.id ?? "",
      )
      if (result.success) {
        onRefetch()
      }
    } catch {
      // Status change failed silently - user can retry
    }
  }

  async function handleRatingChange(id: string, rating: number) {
    try {
      const result = await updateApplicationRating(id, rating)
      if (result.success) {
        onRefetch()
      }
    } catch {
      // Rating change failed silently - user can retry
    }
  }

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[rgba(183,183,183,0.08)]">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#B7B7B7]">
              Nome
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#B7B7B7]">
              Cargo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#B7B7B7]">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#B7B7B7]">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#B7B7B7]">
              DISC
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#B7B7B7]">
              Rating
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#B7B7B7]">
              Acoes
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr
              key={app.id}
              className={[
                "border-b border-[rgba(183,183,183,0.04)] transition-colors hover:bg-white/[0.03]",
                index % 2 === 0 ? "bg-white/[0.02]" : "",
              ].join(" ")}
            >
              <td className="px-4 py-3">
                <Link
                  to={`/admin/candidate/${app.id}`}
                  className="font-medium text-white transition-colors hover:text-[#D2B68A]"
                >
                  {app.full_name}
                </Link>
                <p className="mt-0.5 text-xs text-[rgba(255,255,255,0.5)]">
                  {app.email}
                </p>
              </td>
              <td className="px-4 py-3">
                <PositionBadge position={app.position} />
              </td>
              <td className="px-4 py-3 text-xs text-[#B7B7B7]">
                {formatRelativeDate(app.created_at)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3">
                <MiniDiscBars scores={app.disc_scores} />
              </td>
              <td className="px-4 py-3">
                <StarRating
                  value={app.admin_rating}
                  onChange={(rating) => handleRatingChange(app.id, rating)}
                  size="sm"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/admin/candidate/${app.id}`)
                    }
                    className="rounded p-1.5 text-[#B7B7B7] transition-colors hover:bg-white/[0.05] hover:text-white"
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(app.id, "approved")
                    }
                    className="rounded p-1.5 text-[#B7B7B7] transition-colors hover:bg-[rgba(46,204,113,0.1)] hover:text-[#2ECC71]"
                    title="Aprovar"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(app.id, "rejected")
                    }
                    className="rounded p-1.5 text-[#B7B7B7] transition-colors hover:bg-[rgba(231,76,60,0.1)] hover:text-[#E74C3C]"
                    title="Rejeitar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MobileCards({
  applications,
  onRefetch,
}: ApplicationTableProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleStatusChange(
    id: string,
    status: "approved" | "rejected",
  ) {
    try {
      const result = await updateApplicationStatus(
        id,
        status,
        user?.id ?? "",
      )
      if (result.success) {
        onRefetch()
      }
    } catch {
      // Status change failed silently
    }
  }

  async function handleRatingChange(id: string, rating: number) {
    try {
      const result = await updateApplicationRating(id, rating)
      if (result.success) {
        onRefetch()
      }
    } catch {
      // Rating change failed silently
    }
  }

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {applications.map((app) => (
        <div
          key={app.id}
          className="rounded-lg border border-[rgba(183,183,183,0.08)] bg-[#222052] p-4"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <Link
                to={`/admin/candidate/${app.id}`}
                className="font-medium text-white transition-colors hover:text-[#D2B68A]"
              >
                {app.full_name}
              </Link>
              <p className="mt-0.5 text-xs text-[rgba(255,255,255,0.5)]">
                {app.email}
              </p>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className="mb-3 flex items-center gap-2">
            <PositionBadge position={app.position} />
            <span className="text-xs text-[#B7B7B7]">
              {formatRelativeDate(app.created_at)}
            </span>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <MiniDiscBars scores={app.disc_scores} />
            <StarRating
              value={app.admin_rating}
              onChange={(rating) => handleRatingChange(app.id, rating)}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-1 border-t border-[rgba(183,183,183,0.06)] pt-3">
            <button
              type="button"
              onClick={() =>
                navigate(`/admin/candidate/${app.id}`)
              }
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#B7B7B7] transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              Ver
            </button>
            <button
              type="button"
              onClick={() =>
                handleStatusChange(app.id, "approved")
              }
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#B7B7B7] transition-colors hover:bg-[rgba(46,204,113,0.1)] hover:text-[#2ECC71]"
            >
              <Check className="h-3.5 w-3.5" />
              Aprovar
            </button>
            <button
              type="button"
              onClick={() =>
                handleStatusChange(app.id, "rejected")
              }
              className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#B7B7B7] transition-colors hover:bg-[rgba(231,76,60,0.1)] hover:text-[#E74C3C]"
            >
              <X className="h-3.5 w-3.5" />
              Rejeitar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
