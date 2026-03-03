import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import type { QuestionType } from "@/types"

interface FormNavigationBarProps {
  onPrev: () => void
  onNext: () => boolean
  isFirst: boolean
  isLast: boolean
  questionType: QuestionType
}

export function FormNavigationBar({
  onPrev,
  onNext,
  isFirst,
  isLast,
  questionType,
}: FormNavigationBarProps) {
  const showEnterHint =
    questionType !== "textarea" &&
    questionType !== "radio" &&
    questionType !== "disc_block"

  return (
    <div className="mt-10 w-full">
      <div className="flex items-center justify-between">
        <div>
          {!isFirst && (
            <Button variant="ghost" onClick={onPrev}>
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>
          )}
        </div>

        <Button variant="primary" onClick={() => onNext()}>
          {isLast ? (
            <>
              Concluir
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              Próxima
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {showEnterHint && (
        <p className="mt-4 text-center text-xs text-[rgba(255,255,255,0.4)]">
          Pressione Enter ↵
        </p>
      )}
    </div>
  )
}
