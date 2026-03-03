import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, FileText } from "lucide-react"
import { useApplication } from "@/hooks/useApplication"
import { AdminLoadingScreen } from "@/components/admin/ui/AdminLoadingScreen"
import { BasicDataSection } from "@/components/admin/detail/BasicDataSection"
import { AnswerSections } from "@/components/admin/detail/AnswerSections"
import { DiscCard } from "@/components/admin/detail/DiscCard"
import { AdminActionsCard } from "@/components/admin/detail/AdminActionsCard"

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { application, loading, error, refetch } = useApplication(id ?? "")

  function handleGoBack() {
    navigate("/admin/dashboard")
  }

  if (loading) {
    return <AdminLoadingScreen />
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[#E74C3C]">Erro ao carregar candidatura</p>
          <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-md bg-[rgba(210,182,138,0.1)] px-4 py-2 text-sm font-medium text-[#D2B68A] transition-colors hover:bg-[rgba(210,182,138,0.2)]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[#B7B7B7]">Candidatura nao encontrada</p>
          <button
            type="button"
            onClick={handleGoBack}
            className="mt-4 rounded-md bg-[rgba(210,182,138,0.1)] px-4 py-2 text-sm font-medium text-[#D2B68A] transition-colors hover:bg-[rgba(210,182,138,0.2)]"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleGoBack}
          className="rounded p-1.5 text-[#B7B7B7] transition-colors hover:bg-white/[0.05] hover:text-white"
          title="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <FileText className="h-5 w-5 text-[#D2B68A]" />
        <h1 className="text-xl font-semibold text-white">
          Detalhes da Candidatura
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:w-3/5">
          <BasicDataSection application={application} />
          <AnswerSections application={application} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 lg:w-2/5">
          <DiscCard
            discScores={application.disc_scores}
            discProfile={application.disc_profile}
          />
          <AdminActionsCard
            application={application}
            onRefetch={refetch}
          />
        </div>
      </div>
    </motion.div>
  )
}
