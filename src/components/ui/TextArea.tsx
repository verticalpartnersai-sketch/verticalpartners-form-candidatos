import { cn } from "@/lib/utils"

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  className?: string
  label?: string
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  className,
  label,
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium uppercase tracking-[0.05em] text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn(
          "w-full bg-bg-input rounded-sm resize-none",
          "border border-border-silver",
          "px-4 py-4 text-lg text-text-primary",
          "placeholder:text-text-muted",
          "outline-none transition-colors duration-200",
          "focus:border-gold/50",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          className,
        )}
      />
    </div>
  )
}
