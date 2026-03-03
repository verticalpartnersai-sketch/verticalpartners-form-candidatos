import { useState, useEffect, useCallback } from "react"
import { fetchApplications } from "@/lib/admin-queries"
import type { ApplicationFilters, HiringApplication } from "@/types"

export function useApplications(filters: ApplicationFilters) {
  const [applications, setApplications] = useState<
    readonly HiringApplication[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await fetchApplications(filters)
    setApplications(result.data)
    setError(result.error)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    let cancelled = false

    fetchApplications(filters).then((result) => {
      if (cancelled) return
      setApplications(result.data)
      setError(result.error)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [filters])

  return { applications, loading, error, refetch: load } as const
}
