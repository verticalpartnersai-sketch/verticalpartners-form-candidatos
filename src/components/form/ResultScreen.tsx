import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { GlowCard } from "@/components/ui/GlowCard"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { DiscRadarChart } from "@/components/form/DiscRadarChart"
import { GoldConfetti } from "@/components/form/GoldConfetti"
import { getFactorLabel } from "@/lib/disc-descriptions"
import { DISC_FACTOR_COLORS } from "@/lib/constants"
import type { DiscResult, DiscFactor } from "@/types"

interface ResultScreenProps {
  discResult: DiscResult
  positionTitle: string
  submitError: string | null
  onRetry: () => void
}

const FACTORS: readonly DiscFactor[] = ["D", "I", "S", "C"]

const PROFILE_NAMES: Readonly<Record<string, string>> = {
  D: "Dominante",
  I: "Influente",
  S: "Estável",
  C: "Conforme",
  DI: "Dominante-Influente",
  DC: "Dominante-Conforme",
  DS: "Dominante-Estável",
  ID: "Influente-Dominante",
  IS: "Influente-Estável",
  IC: "Influente-Conforme",
  SI: "Estável-Influente",
  SD: "Estável-Dominante",
  SC: "Estável-Conforme",
  CI: "Conforme-Influente",
  CD: "Conforme-Dominante",
  CS: "Conforme-Estável",
}

export function ResultScreen({
  discResult,
  positionTitle,
  submitError,
  onRetry,
}: ResultScreenProps) {
  const profileName = PROFILE_NAMES[discResult.profileCode] ?? discResult.profileCode

  return (
    <>
      <GoldConfetti />
      <ProgressBar progress={100} />

      <motion.div
        className="flex min-h-screen flex-col items-center px-5 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-[640px]">
          {/* Celebração */}
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="mb-3 text-[28px] font-semibold leading-tight text-text-primary">
              Parabéns por chegar até aqui!
            </h1>

            <p className="text-base leading-relaxed text-text-secondary">
              Seu formulário para{" "}
              <span className="font-medium text-gold">{positionTitle}</span>{" "}
              foi enviado com sucesso. Vamos analisar tudo com carinho e
              retornaremos em breve.
            </p>
          </motion.div>

          {/* Toast de erro discreto */}
          {submitError && (
            <motion.div
              className="mb-6 flex items-center justify-between rounded-lg px-4 py-3"
              style={{
                background: "rgba(231, 76, 60, 0.1)",
                border: "1px solid rgba(231, 76, 60, 0.2)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-[#E74C3C]">
                Erro ao enviar. Seus dados não foram perdidos.
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="ml-4 text-sm font-medium text-gold underline underline-offset-2 transition-opacity hover:opacity-80"
              >
                Tentar novamente
              </button>
            </motion.div>
          )}

          {/* Card DISC */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <GlowCard className="w-full">
              <div className="p-6 sm:p-8">
                <p className="mb-6 text-center text-lg font-semibold text-gold">
                  Seu Perfil Comportamental DISC
                </p>

                {/* Radar Chart */}
                <DiscRadarChart scores={discResult.scores} />

                {/* Score bars grid 2x2 */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {FACTORS.map((factor, i) => (
                    <motion.div
                      key={factor}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.2 }}
                    >
                      <div className="mb-1 flex items-baseline justify-between">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: DISC_FACTOR_COLORS[factor] }}
                        >
                          {factor}
                        </span>
                        <span className="text-xs text-text-muted">
                          {discResult.scores[factor]}%
                        </span>
                      </div>
                      <div className="mb-1 h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: DISC_FACTOR_COLORS[factor],
                          }}
                          initial={{ width: 0 }}
                          animate={{
                            width: `${discResult.scores[factor]}%`,
                          }}
                          transition={{
                            duration: 0.8,
                            delay: 0.8 + i * 0.2,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                      <p className="text-xs text-text-muted">
                        {getFactorLabel(factor)}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Perfil predominante */}
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <span
                      className="inline-block rounded-lg px-3 py-1 text-sm font-semibold"
                      style={{
                        background: "rgba(210, 182, 138, 0.12)",
                        border: "1px solid rgba(210, 182, 138, 0.2)",
                        color: "#D2B68A",
                      }}
                    >
                      Perfil: {discResult.profileCode} — {profileName}
                    </span>
                  </div>

                  <p className="text-center text-sm leading-relaxed text-text-secondary">
                    {discResult.description}
                  </p>
                </motion.div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p className="mb-3 text-xs text-text-muted">
              Vertical Partners &copy; 2026
            </p>
            <a
              href="https://iafoursales.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-opacity hover:opacity-80"
            >
              Conhecer o IA Four Sales
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </motion.footer>
        </div>
      </motion.div>
    </>
  )
}
