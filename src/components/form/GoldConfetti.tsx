import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Particle {
  readonly id: number
  readonly x: number
  readonly delay: number
  readonly duration: number
  readonly size: number
  readonly opacity: number
  readonly rotation: number
}

function createParticles(count: number): readonly Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 3 + Math.random() * 5,
    opacity: 0.4 + Math.random() * 0.5,
    rotation: Math.random() * 360,
  }))
}

export function GoldConfetti() {
  const [visible, setVisible] = useState(true)
  const [particles] = useState(() => createParticles(30))

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: -10,
                width: p.size,
                height: p.size,
                background:
                  p.id % 3 === 0
                    ? "#D2B68A"
                    : p.id % 3 === 1
                      ? "#EEE5D3"
                      : "rgba(210, 182, 138, 0.6)",
                borderRadius: p.id % 2 === 0 ? "50%" : "1px",
                rotate: p.rotation,
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: typeof window !== "undefined" ? window.innerHeight + 20 : 900,
                opacity: [0, p.opacity, p.opacity, 0],
                rotate: p.rotation + 360,
                x: (Math.random() - 0.5) * 100,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
