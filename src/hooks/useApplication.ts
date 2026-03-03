import { useState, useEffect, useCallback } from "react"
import { fetchApplicationById } from "@/lib/admin-queries"
import type { HiringApplication } from "@/types"

export function useApplication(id: string) {
  const [application, setApplication] = useState<HiringApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await fetchApplicationById(id)
    setApplication(result.data)
    setError(result.error)
    setLoading(false)
  }, [id])

  useEffect(() => {
    let cancelled = false

    fetchApplicationById(id).then((result) => {
      if (cancelled) return
      setApplication(result.data)
      setError(result.error)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [id])

  return { application, loading, error, refetch: load } as const
}
