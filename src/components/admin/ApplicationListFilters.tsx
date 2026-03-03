import { SelectFilter } from "@/components/admin/ui/SelectFilter"
import { SearchInput } from "@/components/admin/ui/SearchInput"
import { ArrowUpDown } from "lucide-react"
import type { ApplicationFilters } from "@/types"

interface ApplicationListFiltersProps {
  readonly filters: ApplicationFilters
  readonly searchInput: string
  readonly onSearchChange: (value: string) => void
  readonly onFilterChange: (
    key: keyof ApplicationFilters,
    value: string,
  ) => void
  readonly onToggleSortDirection: () => void
}

const POSITION_OPTIONS = [
  { value: "all", label: "Todos os Cargos" },
  { value: "gestor-trafego", label: "Gestor de Trafego" },
  { value: "cs-suporte", label: "CS / Suporte" },
  { value: "dev-senior-fullstack", label: "Dev Full-Stack" },
] as const

const STATUS_OPTIONS = [
  { value: "all", label: "Todos os Status" },
  { value: "new", label: "Novo" },
  { value: "reviewed", label: "Revisado" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
  { value: "interview", label: "Entrevista" },
] as const

export function ApplicationListFilters({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onToggleSortDirection,
}: ApplicationListFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <SearchInput
          value={searchInput}
          onChange={onSearchChange}
          placeholder="Buscar por nome ou email..."
        />
      </div>

      <SelectFilter
        value={filters.position}
        onChange={(value) => onFilterChange("position", value)}
        options={[...POSITION_OPTIONS]}
        label="Cargo"
      />

      <SelectFilter
        value={filters.status}
        onChange={(value) => onFilterChange("status", value)}
        options={[...STATUS_OPTIONS]}
        label="Status"
      />

      <button
        type="button"
        onClick={onToggleSortDirection}
        className="flex items-center gap-1.5 rounded-md border border-[rgba(183,183,183,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-sm text-[#B7B7B7] transition-colors hover:border-[rgba(210,182,138,0.3)] hover:text-white"
        title={
          filters.sortDirection === "desc"
            ? "Mais recentes primeiro"
            : "Mais antigos primeiro"
        }
      >
        <ArrowUpDown className="h-4 w-4" />
        <span className="hidden sm:inline">
          {filters.sortDirection === "desc" ? "Recentes" : "Antigos"}
        </span>
      </button>
    </div>
  )
}
