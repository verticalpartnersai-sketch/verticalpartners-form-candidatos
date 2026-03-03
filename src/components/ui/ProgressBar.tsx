import { motion } from "framer-motion"
import { TRANSITIONS } from "@/lib/constants"

interface ProgressBarProps {
  progress: number
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress))

  return (
    <div className="fixed top-0 left-0 z-50 h-[3px] w-full bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-electric-blue/80 to-electric-blue/0"
        initial={{ width: "0%" }}
        animate={{ width: `${clamped}%` }}
        transition={TRANSITIONS.slow}
      />
    </div>
  )
}
