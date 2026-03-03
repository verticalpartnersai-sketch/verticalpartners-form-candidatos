interface SelectOption {
  readonly value: string
  readonly label: string
}

interface SelectFilterProps {
  readonly value: string
  readonly onChange: (value: string) => void
  readonly options: readonly SelectOption[]
  readonly label?: string
}

export function SelectFilter({
  value,
  onChange,
  options,
  label,
}: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-[#B7B7B7]">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="rounded-md border border-[rgba(183,183,183,0.1)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[rgba(210,182,138,0.5)] focus-visible:ring-2 focus-visible:ring-[#D2B68A] appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
