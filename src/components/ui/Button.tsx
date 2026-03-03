import { cn } from "@/lib/utils"
import type { ButtonVariant } from "@/types"

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-gold text-bg-primary font-semibold",
    "shadow-[0_0_20px_rgba(210,182,138,0.15)]",
    "hover:shadow-[0_0_30px_rgba(210,182,138,0.3)]",
  ].join(" "),
  secondary: [
    "bg-transparent text-gold font-medium",
    "border border-gold/30",
    "hover:border-gold/60 hover:bg-gold/5",
  ].join(" "),
  ghost: [
    "bg-transparent text-text-secondary font-medium",
    "hover:text-text-primary hover:bg-white/5",
  ].join(" "),
}

export function Button({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  type = "button",
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "rounded-sm px-7 py-3.5 text-sm tracking-wide",
        "transition-all duration-200",
        "cursor-pointer select-none",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}
