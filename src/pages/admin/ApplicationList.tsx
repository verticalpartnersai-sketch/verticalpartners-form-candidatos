import { useState, useMemo, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Users, Download } from "lucide-react"
import { useApplications } from "@/hooks/useApplications"
import { useDebounce } from "@/hooks/useDebounce"
import { ApplicationListFilters } from "@/components/admin/ApplicationListFilters"
import { ApplicationTable } from "@/components/admin/ApplicationTable"
import { AdminLoadingScreen } from "@/components/admin/ui/AdminLoadingScreen"
import { EmptyState } from "@/components/admin/ui/EmptyState"
import { exportApplicationsToCSV } from "@/lib/export-csv"
import type { ApplicationFilters } from "@/types"

function parseFiltersFromParams(
  params: URLSearchParams,
): ApplicationFilters {
  return {
    position: (params.get("position") ?? "all") as ApplicationFilters["position"],
    status: (params.get("status") ?? "all") as ApplicationFilters["status"],
    search: params.get("search") ?? "",
    sortBy: (params.get("sortBy") ?? "date") as ApplicationFilters["sortBy"],
    sortDirection: (params.get("sortDirection") ?? "desc") as ApplicationFilters["sortDirection"],
  }
}

function buildSearchParams(
  filters: ApplicationFilters,
): Record<string, string> {
  const params: Record<string, string> = {}

  if (filters.position !== "all") params.position = filters.position
  if (filters.status !== "all") params.status = filters.status
  if (filters.search) params.search = filters.search
  if (filters.sortBy !== "date") params.sortBy = filters.sortBy
  if (filters.sortDirection !== "desc") params.sortDirection = filters.sortDirection

  return params
}

export function ApplicationList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filtersFromUrl = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams],
  )

  const [searchInput, setSearchInput] = useState(filtersFromUrl.search)
  const debouncedSearch = useDebounce(searchInput, 300)

  const filters = useMemo<ApplicationFilters>(
    () => ({
      ...filtersFromUrl,
      search: debouncedSearch,
    }),
    [filtersFromUrl, debouncedSearch],
  )

  const { applications, loading, error, refetch } = useApplications(filters)

  const handleFilterChange = useCallback(
    (key: keyof ApplicationFilters, value: string) => {
      const updated = { ...filtersFromUrl, [key]: value }
      if (key === "search") {
        setSearchInput(value)
      }
      setSearchParams(buildSearchParams(updated))
    },
    [filtersFromUrl, setSearchParams],
  )

  const handleToggleSortDirection = useCallback(() => {
    const nextDirection =
      filtersFromUrl.sortDirection === "desc" ? "asc" : "desc"
    const updated = { ...filtersFromUrl, sortDirection: nextDirection } as ApplicationFilters
    setSearchParams(buildSearchParams(updated))
  }, [filtersFromUrl, setSearchParams])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value)
      const updated = { ...filtersFromUrl, search: value }
      setSearchParams(buildSearchParams(updated))
    },
    [filtersFromUrl, setSearchParams],
  )

  const handleExport = useCallback(() => {
    if (applications.length > 0) {
      exportApplicationsToCSV(applications)
    }
  }, [applications])

  if (loading) {
    return <AdminLoadingScreen />
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[#E74C3C]">Erro ao carregar candidaturas</p>
          <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-md bg-[rgba(210,182,138,0.1)] px-4 py-2 text-sm font-medium text-[#D2B68A] transition-colors hover:bg-[rgba(210,182,138,0.2)]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-[#D2B68A]" />
          <h1 className="text-xl font-semibold text-white">
            Candidaturas
          </h1>
          <span className="rounded-full bg-[rgba(210,182,138,0.1)] px-2 py-0.5 text-xs font-medium text-[#D2B68A]">
            {applications.length}
          </span>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={applications.length === 0}
          className="flex items-center gap-2 rounded-md bg-[rgba(210,182,138,0.1)] px-3 py-2 text-sm font-medium text-[#D2B68A] transition-colors hover:bg-[rgba(210,182,138,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar CSV</span>
        </button>
      </div>

      <ApplicationListFilters
        filters={filters}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onToggleSortDirection={handleToggleSortDirection}
      />

      {applications.length === 0 ? (
        <EmptyState
          title="Nenhuma candidatura encontrada"
          description="Tente ajustar os filtros ou aguarde novas candidaturas."
        />
      ) : (
        <ApplicationTable
          applications={applications}
          onRefetch={refetch}
        />
      )}
    </motion.div>
  )
}
