import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useParams, useNavigate, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useFormEngine } from "@/hooks/useFormEngine"
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation"
import { useDiscEngine } from "@/hooks/useDiscEngine"
import { useDiscCalculator, calculateDiscResult } from "@/hooks/useDiscCalculator"
import { useRealtimeSync } from "@/hooks/useRealtimeSync"
import { getQuestionsForPosition } from "@/data/questions"
import { DISC_TOTAL_BLOCKS } from "@/data/disc-blocks"
import { buildPayload, submitApplication } from "@/lib/submit-application"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { SlideTransition } from "@/components/form/SlideTransition"
import { QuestionSlide } from "@/components/form/QuestionSlide"
import { DiscTransitionScreen } from "@/components/form/DiscTransitionScreen"
import { DiscQuestion } from "@/components/form/DiscQuestion"
import { CalculatingScreen } from "@/components/form/CalculatingScreen"
import { ResultScreen } from "@/components/form/ResultScreen"
import { POSITIONS } from "@/lib/positions"
import type { FormPhase, DiscResult, SubmissionPayload } from "@/types"

export function FormPage() {
  const { positionId = "" } = useParams<{ positionId: string }>()
  const navigate = useNavigate()

  const isValidPosition = POSITIONS.some((p) => p.id === positionId)

  const [phase, setPhase] = useState<FormPhase>("questions")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [finalResult, setFinalResult] = useState<DiscResult | null>(null)
  const pendingPayloadRef = useRef<SubmissionPayload | null>(null)

  const questions = getQuestionsForPosition(positionId)
  const formEngine = useFormEngine(questions)
  const discEngine = useDiscEngine()
  const discResult = useDiscCalculator(discEngine.answers)

  // Real-time sync to Supabase
  const realtimeSync = useRealtimeSync(positionId)

  const totalItems = questions.length + DISC_TOTAL_BLOCKS
  const globalProgress = useMemo(() => {
    switch (phase) {
      case "questions":
        return Math.round(((formEngine.currentIndex + 1) / totalItems) * 100)
      case "disc-transition":
        return Math.round((questions.length / totalItems) * 100)
      case "disc":
        return Math.round(
          ((questions.length + discEngine.currentIndex + 1) / totalItems) * 100,
        )
      case "loading":
      case "complete":
        return 100
    }
  }, [phase, formEngine.currentIndex, discEngine.currentIndex, questions.length, totalItems])

  // Wrap setAnswer to also sync personal fields in real-time
  const handleSetAnswer = useCallback(
    (questionId: string, value: string) => {
      formEngine.setAnswer(questionId, value)
      realtimeSync.syncAnswer(questionId, value)
    },
    [formEngine, realtimeSync],
  )

  // Override form engine completion to transition to DISC + sync answers
  const handleFormNext = useCallback((): boolean => {
    const isLastQuestion = formEngine.currentIndex === questions.length - 1
    if (isLastQuestion) {
      const success = formEngine.goNext()
      if (success) {
        realtimeSync.syncOnAdvance(formEngine.answers)
        setPhase("disc-transition")
      }
      return success
    }
    const success = formEngine.goNext()
    if (success) {
      realtimeSync.syncOnAdvance(formEngine.answers)
    }
    return success
  }, [formEngine, questions.length, realtimeSync])

  // Use keyboard nav only during questions phase
  useKeyboardNavigation(
    phase === "questions" ? formEngine.currentQuestion.type : "disc_block",
    phase === "questions" ? handleFormNext : discEngine.goNext,
  )

  const handleStartDisc = useCallback(() => {
    setPhase("disc")
  }, [])

  // Wrap DISC setBlockAnswer to also sync
  const handleSetBlockAnswer = useCallback(
    (blockId: number, answer: Parameters<typeof discEngine.setBlockAnswer>[1]) => {
      discEngine.setBlockAnswer(blockId, answer)
      // Sync after React state update
      const updatedAnswers = { ...discEngine.answers, [blockId]: answer }
      realtimeSync.syncDiscBlock(updatedAnswers)
    },
    [discEngine, realtimeSync],
  )

  // Fire-and-forget submission (fallback when draft sync fails)
  const doSubmit = useCallback(async (payload: SubmissionPayload) => {
    setSubmitError(null)
    const result = await submitApplication(payload)
    if (!result.success) {
      setSubmitError(result.error ?? "Erro ao enviar.")
      pendingPayloadRef.current = payload
    }
  }, [])

  // Handle retry
  const handleRetry = useCallback(() => {
    if (pendingPayloadRef.current) {
      doSubmit(pendingPayloadRef.current)
    }
  }, [doSubmit])

  // Override DISC engine completion → finalize draft + loading phase
  const handleDiscNext = useCallback((): boolean => {
    const isLastBlock = discEngine.currentIndex === DISC_TOTAL_BLOCKS - 1
    if (isLastBlock) {
      const success = discEngine.goNext()
      if (success) {
        const result = calculateDiscResult(discEngine.answers)
        setFinalResult(result)

        // Finalize draft (status draft → new)
        realtimeSync.finalize(result.scores, result.profileCode).then((ok) => {
          if (!ok) {
            // Fallback: full INSERT if draft finalization failed
            const payload = buildPayload(
              positionId,
              formEngine.answers,
              discEngine.answers,
              result,
            )
            doSubmit(payload)
            pendingPayloadRef.current = payload
          }
        })

        setPhase("loading")
      }
      return success
    }

    const success = discEngine.goNext()
    if (success) {
      realtimeSync.syncDiscBlock(discEngine.answers)
    }
    return success
  }, [discEngine, positionId, formEngine.answers, doSubmit, realtimeSync])

  // Loading → complete after 2.5s
  useEffect(() => {
    if (phase !== "loading") return
    const timer = setTimeout(() => setPhase("complete"), 2500)
    return () => clearTimeout(timer)
  }, [phase])

  const position = POSITIONS.find((p) => p.id === positionId)

  if (!isValidPosition) {
    return <Navigate to="/" replace />
  }

  if (phase === "loading") {
    return <CalculatingScreen />
  }

  if (phase === "complete" && (finalResult ?? discResult)) {
    return (
      <ResultScreen
        discResult={(finalResult ?? discResult)!}
        positionTitle={position?.title ?? ""}
        submitError={submitError}
        onRetry={handleRetry}
      />
    )
  }

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ProgressBar progress={globalProgress} />

      {/* Botão voltar para seleção */}
      <div className="fixed left-5 top-5 z-40">
        <Button variant="ghost" onClick={() => navigate("/")} className="text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </Button>
      </div>

      {phase === "questions" && (
        <SlideTransition
          direction={formEngine.direction}
          questionId={formEngine.currentQuestion.id}
        >
          <QuestionSlide
            question={formEngine.currentQuestion}
            questionNumber={formEngine.currentIndex + 1}
            value={formEngine.currentAnswer}
            onChange={(value) =>
              handleSetAnswer(formEngine.currentQuestion.id, value)
            }
            validationError={formEngine.validationError}
            onNext={handleFormNext}
            onPrev={formEngine.goPrev}
            isFirst={formEngine.currentIndex === 0}
            isLast={false}
          />
        </SlideTransition>
      )}

      {phase === "disc-transition" && (
        <DiscTransitionScreen onStart={handleStartDisc} />
      )}

      {phase === "disc" && (
        <SlideTransition
          direction={discEngine.direction}
          questionId={`disc-${discEngine.currentBlock.id}`}
        >
          <DiscQuestion
            block={discEngine.currentBlock}
            blockIndex={discEngine.currentIndex}
            totalBlocks={DISC_TOTAL_BLOCKS}
            answer={discEngine.currentAnswer}
            onAnswer={handleSetBlockAnswer}
            onClear={discEngine.clearBlockAnswer}
            onNext={handleDiscNext}
            onPrev={discEngine.goPrev}
            isFirst={discEngine.currentIndex === 0}
          />
        </SlideTransition>
      )}
    </motion.div>
  )
}
