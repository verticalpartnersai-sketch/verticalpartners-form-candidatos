import { useState, useMemo, useCallback, useRef } from "react"
import { validateAnswer } from "@/lib/validators"
import type { Question, Answers, AnimationDirection, UseFormEngineReturn } from "@/types"

export function useFormEngine(questions: readonly Question[]): UseFormEngineReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [direction, setDirection] = useState<AnimationDirection>("forward")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestion = questions[currentIndex] ?? questions[0]
  const currentAnswer = answers[currentQuestion.id] ?? ""
  const progress = useMemo(
    () => Math.round(((currentIndex + 1) / questions.length) * 100),
    [currentIndex, questions.length],
  )

  // Ref para evitar stale closure no goNext (necessário para auto-advance do radio)
  const answersRef = useRef(answers)
  answersRef.current = answers

  const setAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    setValidationError(null)
  }, [])

  const goNext = useCallback((): boolean => {
    const latestAnswer = answersRef.current[currentQuestion.id] ?? ""
    const error = validateAnswer(currentQuestion, latestAnswer)
    if (error) {
      setValidationError(error)
      return false
    }

    if (currentIndex >= questions.length - 1) {
      setIsComplete(true)
      return true
    }

    setDirection("forward")
    setCurrentIndex((prev) => prev + 1)
    setValidationError(null)
    return true
  }, [currentQuestion, currentIndex, questions.length])

  const goPrev = useCallback(() => {
    if (currentIndex <= 0) return
    setDirection("backward")
    setCurrentIndex((prev) => prev - 1)
    setValidationError(null)
  }, [currentIndex])

  return {
    questions,
    currentIndex,
    answers,
    direction,
    progress,
    validationError,
    isComplete,
    goNext,
    goPrev,
    setAnswer,
    currentQuestion,
    currentAnswer,
  }
}
