import { useMemo } from "react"
import { getDiscDescription } from "@/lib/disc-descriptions"
import type { DiscAnswers, DiscFactor, DiscResult, DiscScores } from "@/types"

const FACTORS: readonly DiscFactor[] = ["D", "I", "S", "C"]
const TOTAL_BLOCKS = 24

/**
 * DISC Scoring Algorithm (forced-choice, MOST/LEAST):
 *
 * 1. For each of the 24 blocks, the user selects one adjective as MOST
 *    like them and one as LEAST like them.
 *
 * 2. Each adjective maps to a DISC factor (D, I, S, or C).
 *
 * 3. Raw scoring per factor:
 *    - Each MOST selection: +1 to that factor's "most" tally
 *    - Each LEAST selection: +1 to that factor's "least" tally
 *
 * 4. Difference score = most_tally - least_tally (range: -24 to +24)
 *
 * 5. Normalize to 0-100: ((difference + 24) / 48) * 100
 *
 * 6. Profile = primary (highest) + secondary (second highest) factor.
 */

function computeRawTallies(answers: DiscAnswers): {
  most: Readonly<Record<DiscFactor, number>>
  least: Readonly<Record<DiscFactor, number>>
} {
  const most: Record<DiscFactor, number> = { D: 0, I: 0, S: 0, C: 0 }
  const least: Record<DiscFactor, number> = { D: 0, I: 0, S: 0, C: 0 }

  for (let blockId = 1; blockId <= TOTAL_BLOCKS; blockId++) {
    const answer = answers[blockId]
    if (!answer) continue
    most[answer.most] += 1
    least[answer.least] += 1
  }

  return { most, least }
}

function computeNormalizedScores(answers: DiscAnswers): DiscScores {
  const { most, least } = computeRawTallies(answers)

  const scores: Record<DiscFactor, number> = { D: 0, I: 0, S: 0, C: 0 }
  for (const factor of FACTORS) {
    const diff = most[factor] - least[factor]
    scores[factor] = Math.round(((diff + TOTAL_BLOCKS) / (TOTAL_BLOCKS * 2)) * 100)
  }

  return scores
}

function rankFactors(scores: DiscScores): readonly DiscFactor[] {
  return [...FACTORS].sort((a, b) => scores[b] - scores[a])
}

export function calculateDiscResult(answers: DiscAnswers): DiscResult {
  const scores = computeNormalizedScores(answers)
  const ranked = rankFactors(scores)
  const primary = ranked[0]
  const secondary = ranked[1]
  const profileCode = primary === secondary ? primary : `${primary}${secondary}`
  const description = getDiscDescription(primary, secondary)

  return { scores, primary, secondary, profileCode, description }
}

export function useDiscCalculator(answers: DiscAnswers): DiscResult | null {
  return useMemo(() => {
    const answeredCount = Object.keys(answers).length
    if (answeredCount < TOTAL_BLOCKS) return null
    return calculateDiscResult(answers)
  }, [answers])
}
