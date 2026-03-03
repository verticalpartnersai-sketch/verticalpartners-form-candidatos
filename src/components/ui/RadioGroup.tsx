import { cn } from "@/lib/utils"

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
}

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && (
        <span className="text-xs font-medium uppercase tracking-[0.05em] text-text-secondary">
          {label}
        </span>
      )}
      <div className="flex flex-col gap-2">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex flex-col gap-1 rounded-sm px-5 py-4 text-left",
                "border transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-gold/50 bg-gold/5 shadow-[0_0_20px_rgba(210,182,138,0.08)]"
                  : "border-border-silver bg-transparent hover:border-white/15",
              )}
            >
              <span
                className={cn(
                  "text-base font-medium",
                  isSelected ? "text-gold" : "text-text-primary",
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="text-sm text-text-muted">
                  {option.description}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
