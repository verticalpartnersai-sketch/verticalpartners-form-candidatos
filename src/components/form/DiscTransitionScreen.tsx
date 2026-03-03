import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { GlowCard } from "@/components/ui/GlowCard"

interface DiscTransitionScreenProps {
  onStart: () => void
}

export function DiscTransitionScreen({ onStart }: DiscTransitionScreenProps) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center px-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlowCard className="w-full max-w-lg">
        <div className="p-8 text-center">
          <div
            className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(210, 182, 138, 0.1)",
              border: "1px solid rgba(210, 182, 138, 0.2)",
            }}
          >
            <Brain className="h-6 w-6 text-gold" />
          </div>

          <h2 className="mb-2 text-2xl font-semibold text-text-primary">
            Quase lá! Agora vamos conhecer seu perfil comportamental.
          </h2>

          <p className="mb-6 text-sm text-text-secondary">
            São 24 perguntas rápidas — leva cerca de 5 minutos.
          </p>

          <p className="mb-8 text-sm leading-relaxed text-text-muted">
            Em cada pergunta, você verá 4 palavras. Escolha a que{" "}
            <span className="font-semibold text-gold">MAIS</span> representa
            você e a que{" "}
            <span className="font-semibold text-electric-blue">MENOS</span>{" "}
            representa você.
          </p>

          <Button variant="primary" onClick={onStart}>
            Começar
          </Button>
        </div>
      </GlowCard>
    </motion.div>
  )
}
