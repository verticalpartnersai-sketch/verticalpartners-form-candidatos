import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { GlowCard } from "@/components/ui/GlowCard"
import type { Position } from "@/lib/positions"

interface PositionCardProps {
  position: Position
  onClick: () => void
  className?: string
}

export function PositionCard({ position, onClick, className }: PositionCardProps) {
  const Icon = position.icon

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn("cursor-pointer text-left w-full", className)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" as const }}
    >
      <GlowCard className="h-full">
        <div className="flex h-full flex-col p-6">
          {/* \u00CDcone */}
          <div className="mb-5">
            <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
          </div>

          {/* T\u00EDtulo */}
          <h3 className="mb-2 text-lg font-semibold tracking-[-0.02em] text-text-primary">
            {position.title}
          </h3>

          {/* Subt\u00EDtulo */}
          <p className="text-sm leading-relaxed text-text-secondary">
            {position.subtitle}
          </p>
        </div>
      </GlowCard>
    </motion.button>
  )
}
