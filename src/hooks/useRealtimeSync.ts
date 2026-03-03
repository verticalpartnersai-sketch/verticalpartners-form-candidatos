import { useEffect, useRef, useCallback, useMemo } from "react"
import {
  createDraftRecord,
  updateDraftFields,
  finalizeDraft,
} from "@/lib/draft-sync"
import type { Answers, DiscAnswers, DiscScores } from "@/types"

const PERSONAL_FIELD_MAP: Readonly<Record<string, Record<string, string>>> = {
  "cs-suporte": {
    cs_nome: "full_name",
    cs_email: "email",
    cs_telefone: "phone",
    cs_linkedin: "linkedin",
    cs_cidade: "city",
    cs_pretensao: "salary_expectation",
  },
  "dev-senior-fullstack": {
    dev_nome: "full_name",
    dev_email: "email",
    dev_telefone: "phone",
    dev_linkedin: "linkedin",
    dev_github: "github",
    dev_cidade: "city",
    dev_pretensao: "salary_expectation",
  },
  "gestor-trafego": {
    traffic_nome: "full_name",
    traffic_email: "email",
    traffic_telefone: "phone",
    traffic_linkedin: "linkedin",
    traffic_portfolio: "portfolio",
    traffic_cidade: "city",
    traffic_pretensao: "salary_expectation",
  },
}

function isPersonalField(positionId: string, questionId: string): string | null {
  const map = PERSONAL_FIELD_MAP[positionId]
  if (!map) return null
  return map[questionId] ?? null
}

function buildRemainingAnswers(
  positionId: string,
  answers: Answers,
): Record<string, string> {
  const knownFields = new Set(Object.keys(PERSONAL_FIELD_MAP[positionId] ?? {}))
  const remaining: Record<string, string> = {}
  for (const [key, value] of Object.entries(answers)) {
    if (!knownFields.has(key) && value) {
      remaining[key] = value
    }
  }
  return remaining
}

function buildDiscResponsesArray(
  discAnswers: DiscAnswers,
): readonly { most: string; least: string }[] {
  const responses: { most: string; least: string }[] = []
  for (let i = 1; i <= 24; i++) {
    const answer = discAnswers[i]
    if (answer) {
      responses.push({ most: answer.most, least: answer.least })
    }
  }
  return responses
}

export interface UseRealtimeSyncReturn {
  readonly syncAnswer: (questionId: string, value: string) => void
  readonly syncOnAdvance: (answers: Answers) => void
  readonly syncDiscBlock: (discAnswers: DiscAnswers) => void
  readonly finalize: (
    discScores: DiscScores,
    discProfile: string,
  ) => Promise<boolean>
  readonly hasDraft: boolean
}

export function useRealtimeSync(positionId: string): UseRealtimeSyncReturn {
  const draftIdRef = useRef<string | null>(null)
  const debounceTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const hasDraftRef = useRef(false)
  const initCalledRef = useRef(false)

  // Create draft on mount (guard against React Strict Mode double-invoke)
  useEffect(() => {
    if (!positionId || initCalledRef.current) return
    initCalledRef.current = true

    createDraftRecord(positionId).then((id) => {
      if (id) {
        draftIdRef.current = id
        hasDraftRef.current = true
      }
    })

    return () => {
      // Clear all debounce timers on unmount
      for (const timer of Object.values(debounceTimersRef.current)) {
        clearTimeout(timer)
      }
    }
  }, [positionId])

  // Sync a single answer change (debounced 1s for personal fields, immediate for others)
  const syncAnswer = useCallback(
    (questionId: string, value: string) => {
      if (!draftIdRef.current) return

      const dbColumn = isPersonalField(positionId, questionId)
      if (!dbColumn) return // Non-personal fields sync on advance

      // Clear previous timer for this field
      const existing = debounceTimersRef.current[questionId]
      if (existing) clearTimeout(existing)

      const draftId = draftIdRef.current
      debounceTimersRef.current[questionId] = setTimeout(() => {
        updateDraftFields(draftId, { [dbColumn]: value })
      }, 1000)
    },
    [positionId],
  )

  // Sync all answers on question advance (immediate)
  const syncOnAdvance = useCallback(
    (answers: Answers) => {
      if (!draftIdRef.current) return

      const map = PERSONAL_FIELD_MAP[positionId] ?? {}
      const personalFields: Record<string, string> = {}
      for (const [questionId, dbColumn] of Object.entries(map)) {
        if (answers[questionId] !== undefined) {
          personalFields[dbColumn] = answers[questionId]
        }
      }

      const dissertative = buildRemainingAnswers(positionId, answers)

      updateDraftFields(draftIdRef.current, {
        ...personalFields,
        answers: dissertative,
      })
    },
    [positionId],
  )

  // Sync DISC answers (immediate, on each block)
  const syncDiscBlock = useCallback((discAnswers: DiscAnswers) => {
    if (!draftIdRef.current) return

    const responses = buildDiscResponsesArray(discAnswers)
    updateDraftFields(draftIdRef.current, {
      disc_responses: responses,
    })
  }, [])

  // Finalize: change status draft → new + add scores
  const finalize = useCallback(
    async (
      discScores: DiscScores,
      discProfile: string,
    ): Promise<boolean> => {
      if (!draftIdRef.current) return false
      return finalizeDraft(draftIdRef.current, discScores, discProfile)
    },
    [],
  )

  const hasDraft = useMemo(() => hasDraftRef.current, [])

  return { syncAnswer, syncOnAdvance, syncDiscBlock, finalize, hasDraft }
}
