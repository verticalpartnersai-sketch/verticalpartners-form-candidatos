import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { PositionCard } from "@/components/form/PositionCard"
import { InfoModal } from "@/components/form/InfoModal"
import { POSITIONS } from "@/lib/positions"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    transition: { duration: 0.4, ease: "easeIn" as const },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export function SelectPosition() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<"ia4sales" | "vertical" | null>(null)

  function handleSelect(positionId: string) {
    setSelectedId(positionId)
    setTimeout(() => navigate(`/form/${positionId}`), 600)
  }

  return (
    <AnimatePresence mode="wait">
      {selectedId === null ? (
        <motion.div
          key="selection"
          className="flex min-h-screen flex-col items-center justify-center px-5 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="w-full max-w-[900px]">
            {/* Hero */}
            <motion.div className="mb-16 text-center" variants={itemVariants}>
              {/* Marca */}
              <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-text-secondary">
                VERTICAL PARTNERS
              </p>

              {/* Linha decorativa */}
              <div className="mx-auto mb-10 h-px w-20 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

              {/* Título */}
              <h1 className="mb-4 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-text-primary sm:text-[40px]">
                Para qual vaga você deseja se candidatar?
              </h1>

              {/* Subtítulo */}
              <p className="mx-auto max-w-lg text-base text-text-secondary">
                Selecione a posição e preencha o formulário completo.
                Leva cerca de 15–20 minutos.
              </p>
            </motion.div>

            {/* Cards de vagas */}
            <motion.div
              className="mb-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
            >
              {POSITIONS.map((position) => (
                <motion.div key={position.id} variants={cardVariants}>
                  <PositionCard
                    position={position}
                    onClick={() => handleSelect(position.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Botões de informação */}
            <motion.div
              className="mb-16 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
              variants={itemVariants}
            >
              <button
                type="button"
                onClick={() => setModalOpen("ia4sales")}
                className="rounded-sm border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-gold/30 hover:bg-white/[0.07] hover:text-gold"
              >
                Conhecer IA Four Sales
              </button>
              <button
                type="button"
                onClick={() => setModalOpen("vertical")}
                className="rounded-sm border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-gold/30 hover:bg-white/[0.07] hover:text-gold"
              >
                Sobre Vertical Partners
              </button>
            </motion.div>

            {/* Modais */}
            <InfoModal
              open={modalOpen === "ia4sales"}
              onClose={() => setModalOpen(null)}
              title="IA Four Sales"
            >
              <p className="mb-3">
                O IA Four Sales é um CRM inteligente com agentes de IA integrados
                para vendas, atendimento ao cliente e suporte, operando diretamente
                via WhatsApp e Instagram.
              </p>
              <p className="mb-4">
                Desenvolvido pela Vertical Partners, o produto automatiza a captação
                de leads, qualificação, follow-up e atendimento, permitindo que
                empresas escalem suas operações comerciais sem aumentar
                proporcionalmente a equipe.
              </p>
              <p className="text-xs text-gray-500">
                <a
                  href="https://iafoursales.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors hover:text-gray-700"
                >
                  iafoursales.com
                </a>
              </p>
            </InfoModal>

            <InfoModal
              open={modalOpen === "vertical"}
              onClose={() => setModalOpen(null)}
              title="Vertical Partners"
            >
              <p className="mb-3">
                A Vertical Partners é uma startup brasileira de tecnologia focada em
                desenvolvimento de softwares com inteligência artificial. Fundada por
                Mateus Paz e José Júnior, a empresa desenvolve softwares que utilizam
                inteligência artificial para alcançar proporções significativamente
                maiores.
              </p>
              <p className="mb-3">
                Um dos nossos produtos é o IA Four Sales, que estamos lançando para o
                mercado atualmente. Em breve, estaremos lançando outros produtos com o
                intuito de resolver problemas reais de empresas por meio de automação
                inteligente e tecnologia de ponta.
              </p>
              <p className="mb-4 text-gray-600">
                <strong className="text-gray-800">Cultura:</strong> Startup enxuta,
                autonomia total, velocidade, IA-first e comunicação direta.
              </p>
              <p className="text-xs text-gray-500">
                <a
                  href="https://verticalpartners.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline transition-colors hover:text-gray-700"
                >
                  verticalpartners.com.br
                </a>
              </p>
            </InfoModal>

            {/* Rodapé */}
            <motion.footer
              className="text-center"
              variants={itemVariants}
            >
              <p className="text-xs text-text-muted">
                Vertical Partners &copy; 2026
              </p>
            </motion.footer>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="transitioning"
          className="flex min-h-screen flex-col items-center justify-center px-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SelectedTransition positionId={selectedId} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SelectedTransition({ positionId }: { positionId: string }) {
  const position = POSITIONS.find((p) => p.id === positionId)
  if (!position) return null

  const Icon = position.icon

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "rgba(210,182,138,0.1)",
          border: "1px solid rgba(210,182,138,0.2)",
        }}
      >
        <Icon className="h-7 w-7 text-gold" strokeWidth={1.5} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-2 text-2xl font-semibold text-text-primary"
      >
        {position.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-sm text-text-muted"
      >
        Preparando formulário...
      </motion.p>
    </div>
  )
}
