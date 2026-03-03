import type { Question } from "@/types"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateRequired(answer: string): string | null {
  return answer.trim().length === 0 ? "Este campo é obrigatório." : null
}

function validateEmail(answer: string): string | null {
  if (answer.trim().length === 0) return "Este campo é obrigatório."
  return EMAIL_REGEX.test(answer.trim()) ? null : "Insira um e-mail válido."
}

function validatePhone(answer: string): string | null {
  if (answer.trim().length === 0) return "Este campo é obrigatório."
  const cleaned = answer.replace(/\D/g, "")
  return cleaned.length >= 10 && cleaned.length <= 11
    ? null
    : "Insira um telefone válido. Ex: (11) 99999-9999"
}

function validateUrl(answer: string): string | null {
  if (answer.trim().length === 0) return "Este campo é obrigatório."
  try {
    new URL(answer.startsWith("http") ? answer : `https://${answer}`)
    return null
  } catch {
    return "Insira uma URL válida."
  }
}

function validateTextarea(answer: string, minLength: number): string | null {
  if (answer.trim().length === 0) return "Este campo é obrigatório."
  if (answer.trim().length < minLength) {
    return `Mínimo de ${minLength} caracteres (${answer.trim().length}/${minLength}).`
  }
  return null
}

export function validateAnswer(question: Question, answer: string): string | null {
  if (!question.required && answer.trim().length === 0) {
    return null
  }

  switch (question.type) {
    case "email":
      return validateEmail(answer)
    case "phone":
      return validatePhone(answer)
    case "url":
      return question.required ? validateUrl(answer) : null
    case "textarea":
      return validateTextarea(answer, question.minLength ?? 50)
    case "disc_block":
      return null
    default:
      return question.required ? validateRequired(answer) : null
  }
}
