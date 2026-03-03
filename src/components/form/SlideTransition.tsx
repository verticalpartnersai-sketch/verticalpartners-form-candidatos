import { AnimatePresence, motion } from "framer-motion"
import type { AnimationDirection } from "@/types"

interface SlideTransitionProps {
  children: React.ReactNode
  direction: AnimationDirection
  questionId: string
}

const SLIDE_OFFSET = 80

const slideVariants = {
  enter: (direction: AnimationDirection) => ({
    y: direction === "forward" ? SLIDE_OFFSET : -SLIDE_OFFSET,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: AnimationDirection) => ({
    y: direction === "forward" ? -SLIDE_OFFSET : SLIDE_OFFSET,
    opacity: 0,
  }),
}

const slideTransition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
}

export function SlideTransition({ children, direction, questionId }: SlideTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={questionId}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={slideTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
