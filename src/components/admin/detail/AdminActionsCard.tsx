import { useState, useEffect, useCallback } from "react"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import { StarRating } from "@/components/admin/ui/StarRating"
import { useDebounce } from "@/hooks/useDebounce"
import { useAuth } from "@/hooks/useAuth"
import {
  updateApplicationStatus,
  updateApplicationRating,
  updateApplicationNotes,
} from "@/lib/admin-queries"
import { formatFullDate } from "@/lib/format-date"
import type { ApplicationStatus, HiringApplication } from "@/types"

interface AdminActionsCardProps {
  readonly application: HiringApplication
  readonly onRefetch: () => void
}

type SaveStatus = "idle" | "saving" | "saved" | "error"

const STATUS_OPTIONS: readonly {
  readonly value: ApplicationStatus
  readonly label: string
}[] = [
  { value: "new", label: "Novo" },
  { value: "reviewed", label: "Revisado" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
  { value: "interview", label: "Entrevista" },
]

const SAVE_STATUS_LABELS: Readonly<Record<SaveStatus, string>> = {
  idle: "",
  saving: "Salvando...",
  saved: "Salvo",
  error: "Erro ao salvar",
}

const SAVE_STATUS_COLORS: Readonly<Record<SaveStatus, string>> = {
  idle: "",
  saving: "#B7B7B7",
  saved: "#2ECC71",
  error: "#E74C3C",
}

export function AdminActionsCard({
  application,
  onRefetch,
}: AdminActionsCardProps) {
  const { user } = useAuth()
  const [notes, setNotes] = useState(application.admin_notes ?? "")
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const debouncedNotes = useDebounce(notes, 1000)

  const [initialNotes] = useState(application.admin_notes ?? "")

  const handleStatusChange = useCallback(
    async (status: ApplicationStatus) => {
      try {
        const result = await updateApplicationStatus(
          application.id,
          status,
          user?.id ?? "",
        )
        if (result.success) {
          onRefetch()
        }
      } catch {
        // Status update failed
      }
    },
    [application.id, user?.id, onRefetch],
  )

  const handleRatingChange = useCallback(
    async (rating: number) => {
      try {
        const result = await updateApplicationRating(application.id, rating)
        if (result.success) {
          onRefetch()
        }
      } catch {
        // Rating update failed
      }
    },
    [application.id, onRefetch],
  )

  useEffect(() => {
    if (debouncedNotes === initialNotes) return

    let cancelled = false
    setSaveStatus("saving")

    updateApplicationNotes(application.id, debouncedNotes).then(
      (result) => {
        if (cancelled) return
        if (result.success) {
          setSaveStatus("saved")
          const timer = setTimeout(() => {
            if (!cancelled) setSaveStatus("idle")
          }, 2000)
          return () => clearTimeout(timer)
        } else {
          setSaveStatus("error")
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [debouncedNotes, application.id, initialNotes])

  return (
    <AdminCard title="Acoes do Admin">
      <div className="flex flex-col gap-5">
        {/* Status */}
        <div>
          <label
            htmlFor="status-select"
            className="mb-1 block text-xs font-medium text-[#B7B7B7]"
          >
            Status
          </label>
          <select
            id="status-select"
            value={application.status}
            onChange={(e) =>
              handleStatusChange(e.target.value as ApplicationStatus)
            }
            className="w-full rounded-md border border-[rgba(183,183,183,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[rgba(210,182,138,0.5)] appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[#B7B7B7]">
            Avaliacao
          </label>
          <StarRating
            value={application.admin_rating}
            onChange={handleRatingChange}
          />
        </div>

        {/* Notes */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="notes-textarea"
              className="text-xs font-medium text-[#B7B7B7]"
            >
              Notas
            </label>
            {saveStatus !== "idle" && (
              <span
                className="text-xs"
                style={{ color: SAVE_STATUS_COLORS[saveStatus] }}
              >
                {SAVE_STATUS_LABELS[saveStatus]}
              </span>
            )}
          </div>
          <textarea
            id="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Adicionar notas sobre o candidato..."
            className="w-full rounded-md border border-[rgba(183,183,183,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none transition-colors focus:border-[rgba(210,182,138,0.5)] resize-none"
          />
        </div>

        {/* Dates */}
        <div className="border-t border-[rgba(183,183,183,0.06)] pt-4">
          <dl className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <dt className="text-[#B7B7B7]">Enviado em</dt>
              <dd className="text-white">
                {formatFullDate(application.submitted_at)}
              </dd>
            </div>
            {application.reviewed_at && (
              <div className="flex justify-between">
                <dt className="text-[#B7B7B7]">Revisado em</dt>
                <dd className="text-white">
                  {formatFullDate(application.reviewed_at)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </AdminCard>
  )
}
