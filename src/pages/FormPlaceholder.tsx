import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { GlowCard } from "@/components/ui/GlowCard"
import { POSITIONS } from "@/lib/positions"

interface FormPlaceholderProps {
  positionId: string
  onBack: () => void
}

export function FormPlaceholder({ positionId, onBack }: FormPlaceholderProps) {
  const position = POSITIONS.find((p) => p.id === positionId)

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ProgressBar progress={5} />

      <div className="mx-auto flex min-h-screen max-w-[900px] flex-col items-center justify-center px-5 py-16">
        <GlowCard className="w-full max-w-lg">
          <div className="p-8 text-center">
            {position && (
              <div
                className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(210,182,138,0.1)",
                  border: "1px solid rgba(210,182,138,0.2)",
                }}
              >
                <position.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              </div>
            )}

            <h2 className="mb-2 text-2xl font-semibold text-text-primary">
              {position?.title ?? "Vaga"}
            </h2>

            <p className="mb-8 text-sm text-text-muted">
              Formulário em construção. Em breve você poderá preencher
              suas informações aqui.
            </p>

            <Button variant="secondary" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              Voltar para seleção
            </Button>
          </div>
        </GlowCard>

        {/* Rodapé */}
        <footer className="mt-16 text-center">
          <p className="text-xs text-text-muted">
            Vertical Partners &copy; 2026
          </p>
        </footer>
      </div>
    </motion.div>
  )
}
