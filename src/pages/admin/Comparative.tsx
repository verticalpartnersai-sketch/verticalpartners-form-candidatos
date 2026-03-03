import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { GitCompareArrows } from "lucide-react"
import { useApplications } from "@/hooks/useApplications"
import { AdminLoadingScreen } from "@/components/admin/ui/AdminLoadingScreen"
import { CandidateSelector } from "@/components/admin/compare/CandidateSelector"
import { OverlayRadarChart } from "@/components/admin/compare/OverlayRadarChart"
import { ComparisonTable } from "@/components/admin/compare/ComparisonTable"
import type { ApplicationFilters } from "@/types"

const DEFAULT_FILTERS: ApplicationFilters = {
  position: "all",
  status: "all",
  search: "",
  sortBy: "name",
  sortDirection: "asc",
}

const CANDIDATE_COLORS = ["#D2B68A", "#2B7FFF", "#2ECC71", "#E74C3C"] as const

const MIN_FOR_COMPARISON = 2

export function Comparative() {
  const [selectedIds, setSelectedIds] = useState<readonly string[]>([])
  const { applications, loading } = useApplications(DEFAULT_FILTERS)

  const selectedApps = useMemo(
    () => applications.filter((app) => selectedIds.includes(app.id)),
    [applications, selectedIds],
  )

  const radarCandidates = useMemo(
    () =>
      selectedApps
        .filter((app) => app.disc_scores !== null)
        .map((app, index) => ({
          name: app.full_name,
          scores: app.disc_scores!,
          color: CANDIDATE_COLORS[index % CANDIDATE_COLORS.length],
        })),
    [selectedApps],
  )

  const canCompare = selectedIds.length >= MIN_FOR_COMPARISON

  if (loading) {
    return <AdminLoadingScreen />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center gap-3">
        <GitCompareArrows className="h-5 w-5 text-[#D2B68A]" />
        <h1 className="text-xl font-semibold text-white">Comparativo</h1>
      </div>

      <div className="mb-6 rounded-lg border border-[rgba(183,183,183,0.08)] bg-[#222052] p-5">
        <CandidateSelector
          applications={applications}
          selectedIds={selectedIds}
          onChange={setSelectedIds}
        />
      </div>

      {canCompare && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {radarCandidates.length >= MIN_FOR_COMPARISON && (
            <OverlayRadarChart candidates={radarCandidates} />
          )}
          <ComparisonTable applications={selectedApps} />
        </div>
      )}

      {!canCompare && selectedIds.length > 0 && (
        <div className="rounded-lg border border-[rgba(183,183,183,0.08)] p-8 text-center">
          <p className="text-sm text-[rgba(255,255,255,0.5)]">
            Selecione pelo menos {MIN_FOR_COMPARISON} candidatos para ver a
            comparacao.
          </p>
        </div>
      )}
    </motion.div>
  )
}
