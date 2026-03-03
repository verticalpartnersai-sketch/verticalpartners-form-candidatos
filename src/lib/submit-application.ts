import { supabase } from "@/lib/supabase"
import type { Answers, DiscAnswers, DiscResult, SubmissionPayload } from "@/types"

const TABLE_NAME = "hiring_applications"
const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000

const FIELD_MAP: Readonly<
  Record<string, Record<string, keyof SubmissionPayload>>
> = {
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

function extractStructuredFields(
  positionId: string,
  answers: Answers,
): Partial<SubmissionPayload> {
  const map = FIELD_MAP[positionId] ?? {}
  const fields: Record<string, string> = {}

  for (const [questionId, payloadField] of Object.entries(map)) {
    fields[payloadField] = answers[questionId] ?? ""
  }

  return fields
}

function buildDiscResponses(discAnswers: DiscAnswers): SubmissionPayload["disc_responses"] {
  const responses: SubmissionPayload["disc_responses"][number][] = []
  for (let i = 1; i <= 24; i++) {
    const answer = discAnswers[i]
    if (answer) {
      responses.push({ most: answer.most, least: answer.least })
    }
  }
  return responses
}

function buildRemainingAnswers(
  positionId: string,
  answers: Answers,
): Record<string, string> {
  const knownFields = new Set(Object.keys(FIELD_MAP[positionId] ?? {}))
  const remaining: Record<string, string> = {}

  for (const [key, value] of Object.entries(answers)) {
    if (!knownFields.has(key) && value) {
      remaining[key] = value
    }
  }

  return remaining
}

export function buildPayload(
  positionId: string,
  answers: Answers,
  discAnswers: DiscAnswers,
  discResult: DiscResult,
): SubmissionPayload {
  const structured = extractStructuredFields(positionId, answers)
  const dissertativeAnswers = buildRemainingAnswers(positionId, answers)

  return {
    position: positionId,
    full_name: "",
    email: "",
    phone: "",
    linkedin: "",
    city: "",
    salary_expectation: "",
    github: null,
    portfolio: null,
    availability: null,
    ...structured,
    answers: dissertativeAnswers,
    disc_responses: buildDiscResponses(discAnswers),
    disc_scores: discResult.scores,
    disc_profile: discResult.profileCode,
    submitted_at: new Date().toISOString(),
    user_agent: navigator.userAgent,
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function submitApplication(
  payload: SubmissionPayload,
): Promise<{ readonly success: boolean; readonly error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase nao configurado." }
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .insert([payload])

      if (!error) {
        return { success: true }
      }

      if (attempt === MAX_RETRIES - 1) {
        return { success: false, error: error.message }
      }

      await wait(BASE_DELAY_MS * Math.pow(2, attempt))
    } catch (err) {
      if (attempt === MAX_RETRIES - 1) {
        const message = err instanceof Error ? err.message : "Erro desconhecido."
        return { success: false, error: message }
      }

      await wait(BASE_DELAY_MS * Math.pow(2, attempt))
    }
  }

  return { success: false, error: "Falha apos tentativas." }
}
