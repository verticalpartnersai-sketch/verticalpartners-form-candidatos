import { useEffect } from "react"
import type { QuestionType } from "@/types"

export function useKeyboardNavigation(
  questionType: QuestionType,
  goNext: () => boolean,
): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter") return
      if (questionType === "textarea") return
      if (event.shiftKey || event.metaKey || event.ctrlKey) return

      event.preventDefault()
      goNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [questionType, goNext])
}
