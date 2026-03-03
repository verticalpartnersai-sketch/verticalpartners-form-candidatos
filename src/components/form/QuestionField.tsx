import { Input } from "@/components/ui/Input"
import { TextArea } from "@/components/ui/TextArea"
import { RadioGroup } from "@/components/ui/RadioGroup"
import type { Question } from "@/types"

interface QuestionFieldProps {
  question: Question
  value: string
  onChange: (value: string) => void
  onAutoAdvance?: () => void
  validationError: string | null
}

export function QuestionField({
  question,
  value,
  onChange,
  onAutoAdvance,
  validationError,
}: QuestionFieldProps) {
  function handleRadioChange(newValue: string) {
    onChange(newValue)
    if (onAutoAdvance) {
      setTimeout(onAutoAdvance, 300)
    }
  }

  return (
    <div className="w-full">
      {renderField()}

      {validationError && (
        <p className="mt-3 text-sm text-red-400">{validationError}</p>
      )}
    </div>
  )

  function renderField() {
    switch (question.type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={onChange}
            placeholder={question.placeholder}
            type="text"
          />
        )

      case "email":
        return (
          <Input
            value={value}
            onChange={onChange}
            placeholder={question.placeholder}
            type="email"
          />
        )

      case "phone":
        return (
          <Input
            value={value}
            onChange={onChange}
            placeholder={question.placeholder}
            type="tel"
          />
        )

      case "url":
        return (
          <Input
            value={value}
            onChange={onChange}
            placeholder={question.placeholder}
            type="url"
          />
        )

      case "textarea":
        return (
          <TextArea
            value={value}
            onChange={onChange}
            placeholder={question.placeholder}
            rows={5}
          />
        )

      case "radio":
      case "select":
        return (
          <RadioGroup
            options={(question.options ?? []).map((opt) => ({
              value: opt.value,
              label: opt.label,
              description: opt.description,
            }))}
            value={value}
            onChange={handleRadioChange}
          />
        )

      case "disc_block":
        return (
          <div className="rounded-sm border border-border-silver px-5 py-8 text-center">
            <p className="text-sm text-text-muted">
              Bloco DISC — em breve.
            </p>
          </div>
        )

      default:
        return null
    }
  }
}
