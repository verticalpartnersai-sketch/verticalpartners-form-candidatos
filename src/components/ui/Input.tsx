import { cn } from "@/lib/utils"

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "email" | "tel" | "url" | "password"
  disabled?: boolean
  className?: string
  label?: string
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className,
  label,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium uppercase tracking-[0.05em] text-text-secondary">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full bg-bg-input rounded-sm",
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
