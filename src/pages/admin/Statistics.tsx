import { motion } from "framer-motion"
import { BarChart3, AlertCircle } from "lucide-react"
import { useStatistics } from "@/hooks/useStatistics"
import { AdminLoadingScreen } from "@/components/admin/ui/AdminLoadingScreen"
import { TotalApplicationsCard } from "@/components/admin/stats/TotalApplicationsCard"
import { ByPositionChart } from "@/components/admin/stats/ByPositionChart"
import { ByStatusChart } from "@/components/admin/stats/ByStatusChart"
import { DiscDistributionChart } from "@/components/admin/stats/DiscDistributionChart"
import { AverageRatingChart } from "@/components/admin/stats/AverageRatingChart"
import { TimelineChart } from "@/components/admin/stats/TimelineChart"

export function Statistics() {
  const { statistics, loading, error } = useStatistics()

  if (loading) {
    return <AdminLoadingScreen />
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-[#E74C3C]" />
          <p className="text-sm text-[#B7B7B7]">
            Erro ao carregar estatisticas: {error}
          </p>
        </div>
      </div>
    )
  }

  if (!statistics) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center gap-3">
        <BarChart3 className="h-5 w-5 text-[#D2B68A]" />
        <h1 className="text-xl font-semibold text-white">Estatisticas</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <TotalApplicationsCard total={statistics.total} />
        <ByPositionChart data={statistics.byPosition} />
        <ByStatusChart data={statistics.byStatus} />
        <DiscDistributionChart data={statistics.discAverages} />
        <AverageRatingChart data={statistics.ratingAverages} />
        <TimelineChart data={statistics.timeline} />
      </div>
    </motion.div>
  )
}
