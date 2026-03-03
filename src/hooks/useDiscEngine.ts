import { useState, useCallback } from "react"
import { DISC_BLOCKS, DISC_TOTAL_BLOCKS } from "@/data/disc-blocks"
import type { DiscAnswers, DiscBlock, DiscBlockAnswer, AnimationDirection } from "@/types"

export interface UseDiscEngineReturn {
  readonly currentIndex: number
  readonly currentBlock: DiscBlock
  readonly answers: DiscAnswers
  readonly direction: AnimationDirection
  readonly isComplete: boolean
  readonly currentAnswer: DiscBlockAnswer | null
  readonly setBlockAnswer: (blockId: number, answer: DiscBlockAnswer) => void
  readonly clearBlockAnswer: (blockId: number) => void
  readonly goNext: () => boolean
  readonly goPrev: () => void
}

export function useDiscEngine(): UseDiscEngineReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<DiscAnswers>({})
  const [direction, setDirection] = useState<AnimationDirection>("forward")
  const [isComplete, setIsComplete] = useState(false)

  const currentBlock = DISC_BLOCKS[currentIndex] ?? DISC_BLOCKS[0]
  const currentAnswer = answers[currentBlock.id] ?? null

  const setBlockAnswer = useCallback((blockId: number, answer: DiscBlockAnswer) => {
    setAnswers((prev) => ({ ...prev, [blockId]: answer }))
  }, [])

  const clearBlockAnswer = useCallback((blockId: number) => {
    setAnswers((prev) => {
      const next = { ...prev }
      delete (next as Record<number, DiscBlockAnswer>)[blockId]
      return next
    })
  }, [])

  const goNext = useCallback((): boolean => {
    if (!answers[currentBlock.id]) return false

    if (currentIndex >= DISC_TOTAL_BLOCKS - 1) {
      setIsComplete(true)
      return true
    }

    setDirection("forward")
    setCurrentIndex((prev) => prev + 1)
    return true
  }, [currentBlock.id, currentIndex, answers])

  const goPrev = useCallback(() => {
    if (currentIndex <= 0) return
    setDirection("backward")
    setCurrentIndex((prev) => prev - 1)
  }, [currentIndex])

  return {
    currentIndex,
    currentBlock,
    answers,
    direction,
    isComplete,
    currentAnswer,
    setBlockAnswer,
    clearBlockAnswer,
    goNext,
    goPrev,
  }
}
