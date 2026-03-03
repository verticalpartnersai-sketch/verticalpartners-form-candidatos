import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type {
  HiringApplication,
  PositionId,
  ApplicationStatus,
  DiscScores,
} from "@/types"

interface PositionCount {
  readonly position: PositionId
  readonly count: number
}

interface StatusCount {
  readonly status: ApplicationStatus
  readonly count: number
}

interface PositionDiscAverage {
  readonly position: PositionId
  readonly scores: DiscScores
}

interface PositionRatingAverage {
  readonly position: PositionId
  readonly average: number
}

interface TimelineEntry {
  readonly date: string
  readonly count: number
}

export interface AdminStatistics {
  readonly total: number
  readonly byPosition: readonly PositionCount[]
  readonly byStatus: readonly StatusCount[]
  readonly discAverages: readonly PositionDiscAverage[]
  readonly ratingAverages: readonly PositionRatingAverage[]
  readonly timeline: readonly TimelineEntry[]
}

function groupBy<T>(items: readonly T[], key: (item: T) => string) {
  const groups: Record<string, T[]> = {}
  for (const item of items) {
    const k = key(item)
    if (!groups[k]) groups[k] = []
    groups[k].push(item)
  }
  return groups
}

function computeDiscAverages(
  grouped: Record<string, HiringApplication[]>,
): readonly PositionDiscAverage[] {
  return Object.entries(grouped).map(([position, apps]) => {
    const withScores = apps.filter(
      (a): a is HiringApplication & { disc_scores: DiscScores } =>
        a.disc_scores !== null,
    )

    const count = withScores.length
    if (count === 0) {
      return {
        position: position as PositionId,
        scores: { D: 0, I: 0, S: 0, C: 0 },
      }
    }

    const totals = withScores.reduce(
      (acc, a) => ({
        D: acc.D + a.disc_scores.D,
        I: acc.I + a.disc_scores.I,
        S: acc.S + a.disc_scores.S,
        C: acc.C + a.disc_scores.C,
      }),
      { D: 0, I: 0, S: 0, C: 0 },
    )

    return {
      position: position as PositionId,
      scores: {
        D: Math.round(totals.D / count),
        I: Math.round(totals.I / count),
        S: Math.round(totals.S / count),
        C: Math.round(totals.C / count),
      },
    }
  })
}

function computeRatingAverages(
  grouped: Record<string, HiringApplication[]>,
): readonly PositionRatingAverage[] {
  return Object.entries(grouped).map(([position, apps]) => {
    const rated = apps.filter((a) => a.admin_rating !== null)
    const average =
      rated.length === 0
        ? 0
        : rated.reduce((sum, a) => sum + (a.admin_rating ?? 0), 0) /
          rated.length

    return {
      position: position as PositionId,
      average: Math.round(average * 10) / 10,
    }
  })
}

function computeTimeline(
  apps: readonly HiringApplication[],
): readonly TimelineEntry[] {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const dayMap: Record<string, number> = {}
  for (let d = 0; d < 30; d++) {
    const date = new Date(thirtyDaysAgo.getTime() + d * 24 * 60 * 60 * 1000)
    dayMap[date.toISOString().split("T")[0]] = 0
  }

  for (const app of apps) {
    const day = app.created_at.split("T")[0]
    if (day in dayMap) {
      dayMap[day] = dayMap[day] + 1
    }
  }

  return Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}

function computeStatistics(
  apps: readonly HiringApplication[],
): AdminStatistics {
  const byPositionGrouped = groupBy(apps, (a) => a.position)
  const byStatusGrouped = groupBy(apps, (a) => a.status)

  return {
    total: apps.length,
    byPosition: Object.entries(byPositionGrouped).map(([position, items]) => ({
      position: position as PositionId,
      count: items.length,
    })),
    byStatus: Object.entries(byStatusGrouped).map(([status, items]) => ({
      status: status as ApplicationStatus,
      count: items.length,
    })),
    discAverages: computeDiscAverages(byPositionGrouped),
    ratingAverages: computeRatingAverages(byPositionGrouped),
    timeline: computeTimeline(apps),
  }
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!supabase) {
        setError("Supabase nao configurado.")
        setLoading(false)
        return
      }

      const { data, error: queryError } = await supabase
        .from("hiring_applications")
        .select("*")

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setLoading(false)
        return
      }

      const apps = (data ?? []) as unknown as HiringApplication[]
      setStatistics(computeStatistics(apps))
      setError(null)
      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { statistics, loading, error } as const
}
