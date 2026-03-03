import { Search } from "lucide-react"

interface SearchInputProps {
  readonly value: string
  readonly onChange: (value: string) => void
  readonly placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B7B7B7]" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar candidaturas"
        className="w-full rounded-md border border-[rgba(183,183,183,0.1)] bg-[rgba(0,0,0,0.3)] py-2 pl-9 pr-3 text-sm text-white placeholder:text-[rgba(255,255,255,0.5)] outline-none transition-colors focus:border-[rgba(210,182,138,0.5)] focus-visible:ring-2 focus-visible:ring-[#D2B68A]"
      />
    </div>
  )
}
