import type { Question } from "@/types"
import { CS_QUESTIONS } from "@/data/questions-cs"
import { DEV_QUESTIONS } from "@/data/questions-dev"
import { TRAFFIC_QUESTIONS } from "@/data/questions-traffic"

const POSITION_QUESTIONS: Readonly<Record<string, readonly Question[]>> = {
  "gestor-trafego": TRAFFIC_QUESTIONS,
  "cs-suporte": CS_QUESTIONS,
  "dev-senior-fullstack": DEV_QUESTIONS,
}

export function getQuestionsForPosition(positionId: string): readonly Question[] {
  return POSITION_QUESTIONS[positionId] ?? CS_QUESTIONS
}
