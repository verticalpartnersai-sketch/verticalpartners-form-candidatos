import { QuestionField } from "@/components/form/QuestionField"
import { FormNavigationBar } from "@/components/form/FormNavigationBar"
import type { Question } from "@/types"

interface QuestionSlideProps {
  question: Question
  questionNumber: number
  value: string
  onChange: (value: string) => void
  validationError: string | null
  onNext: () => boolean
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
}

export function QuestionSlide({
  question,
  questionNumber,
  value,
  onChange,
  validationError,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: QuestionSlideProps) {
  const formattedNumber = String(questionNumber).padStart(2, "0")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="relative w-full max-w-[640px]">
        {/* Número decorativo */}
        <span
          className="pointer-events-none absolute -left-4 -top-12 select-none text-[80px] font-bold leading-none"
          style={{ color: "rgba(255,255,255,0.04)" }}
        >
          {formattedNumber}
        </span>

        {/* Seção */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-gold">
          {question.sectionLabel}
        </p>

        {/* Pergunta */}
        <h2 className="mb-2 text-2xl font-medium leading-snug text-text-primary sm:text-[28px]">
          {question.question}
        </h2>

        {/* Hint */}
        {question.hint && (
          <p className="mb-8 text-sm italic text-text-secondary">
            {question.hint}
          </p>
        )}

        {/* Espaço quando não há hint */}
        {!question.hint && <div className="mb-8" />}

        {/* Campo de resposta */}
        <div className="w-full max-w-[480px]">
          <QuestionField
            question={question}
            value={value}
            onChange={onChange}
            onAutoAdvance={onNext}
            validationError={validationError}
          />

          {/* Navegação */}
          <FormNavigationBar
            onPrev={onPrev}
            onNext={onNext}
            isFirst={isFirst}
            isLast={isLast}
            questionType={question.type}
          />
        </div>
      </div>
    </div>
  )
}
