import { useState, useMemo } from "react"
import { X, UserPlus } from "lucide-react"
import { SearchInput } from "@/components/admin/ui/SearchInput"
import { PositionBadge } from "@/components/admin/ui/PositionBadge"
import type { HiringApplication } from "@/types"

interface CandidateSelectorProps {
  readonly applications: readonly HiringApplication[]
  readonly selectedIds: readonly string[]
  readonly onChange: (ids: readonly string[]) => void
}

const MAX_SELECTED = 4

export function CandidateSelector({
  applications,
  selectedIds,
  onChange,
}: CandidateSelectorProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const selectedApps = useMemo(
    () => applications.filter((app) => selectedIds.includes(app.id)),
    [applications, selectedIds],
  )

  const filteredApps = useMemo(() => {
    if (!search.trim()) return []
    const query = search.toLowerCase()
    return applications
      .filter(
        (app) =>
          !selectedIds.includes(app.id) &&
          app.full_name.toLowerCase().includes(query),
      )
      .slice(0, 8)
  }, [applications, selectedIds, search])

  function handleAdd(id: string) {
    if (selectedIds.length >= MAX_SELECTED) return
    onChange([...selectedIds, id])
    setSearch("")
    setIsOpen(false)
  }

  function handleRemove(id: string) {
    onChange(selectedIds.filter((sid) => sid !== id))
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setIsOpen(value.trim().length > 0)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-[#B7B7B7]">
        <UserPlus className="h-4 w-4" />
        <span>
          Selecione de 2 a {MAX_SELECTED} candidatos para comparar
        </span>
      </div>

      {selectedApps.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedApps.map((app) => (
            <span
              key={app.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(210,182,138,0.2)] bg-[rgba(210,182,138,0.1)] px-3 py-1 text-sm text-white"
            >
              {app.full_name}
              <button
                type="button"
                onClick={() => handleRemove(app.id)}
                className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[rgba(255,255,255,0.1)]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {selectedIds.length < MAX_SELECTED && (
        <div className="relative">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar candidato por nome..."
          />

          {isOpen && filteredApps.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-[rgba(183,183,183,0.1)] bg-[#222052] shadow-lg">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleAdd(app.id)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                >
                  <span>{app.full_name}</span>
                  <PositionBadge position={app.position} />
                </button>
              ))}
            </div>
          )}

          {isOpen && search.trim().length > 0 && filteredApps.length === 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-[rgba(183,183,183,0.1)] bg-[#222052] px-3 py-3 text-center text-sm text-[rgba(255,255,255,0.5)] shadow-lg">
              Nenhum candidato encontrado
            </div>
          )}
        </div>
      )}
    </div>
  )
}
