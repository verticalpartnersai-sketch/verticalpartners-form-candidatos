import { motion } from "framer-motion"

type CardSelection = "most" | "least" | null

interface DiscBlockCardProps {
  label: string
  selection: CardSelection
  onClick: () => void
}

const SELECTION_STYLES: Record<string, { border: string; badge: string; badgeText: string; badgeLabel: string }> = {
  most: {
    border: "rgba(210, 182, 138, 0.6)",
    badge: "#D2B68A",
    badgeText: "#000000",
    badgeLabel: "MAIS",
  },
  least: {
    border: "rgba(34, 32, 82, 0.8)",
    badge: "#222052",
    badgeText: "#FFFFFF",
    badgeLabel: "MENOS",
  },
}

export function DiscBlockCard({ label, selection, onClick }: DiscBlockCardProps) {
  const isSelected = selection !== null
  const style = selection ? SELECTION_STYLES[selection] : null

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative flex min-h-[80px] w-full cursor-pointer items-center justify-center rounded-xl px-4 py-5 text-center transition-colors"
      style={{
        background: isSelected
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(255, 255, 255, 0.02)",
        border: `1px solid ${style?.border ?? "rgba(255, 255, 255, 0.08)"}`,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <span
        className="text-base font-medium"
        style={{
          color: isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
        }}
      >
        {label}
      </span>

      {style && (
        <motion.span
          className="absolute right-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{
            background: style.badge,
            color: style.badgeText,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {style.badgeLabel}
        </motion.span>
      )}
    </motion.button>
  )
}
