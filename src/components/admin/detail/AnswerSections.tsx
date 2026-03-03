import { useMemo } from "react"
import { AdminCard } from "@/components/admin/ui/AdminCard"
import { getQuestionsForPosition } from "@/data/questions"
import type { HiringApplication, Question } from "@/types"

interface AnswerSectionsProps {
  readonly application: HiringApplication
}

interface AnswerGroup {
  readonly sectionLabel: string
  readonly items: readonly {
    readonly question: Question
    readonly answer: string
  }[]
}

function groupAnswersBySection(
  questions: readonly Question[],
  answers: Readonly<Record<string, string>>,
): readonly AnswerGroup[] {
  const groupMap = new Map<string, AnswerGroup["items"][number][]>()
  const order: string[] = []

  for (const question of questions) {
    const answer = answers[question.id]
    if (answer === undefined || answer === "") continue

    const existing = groupMap.get(question.sectionLabel)
    const item = { question, answer }

    if (existing) {
      existing.push(item)
    } else {
      groupMap.set(question.sectionLabel, [item])
      order.push(question.sectionLabel)
    }
  }

  return order.map((sectionLabel) => ({
    sectionLabel,
    items: groupMap.get(sectionLabel) ?? [],
  }))
}

export function AnswerSections({ application }: AnswerSectionsProps) {
  const groups = useMemo(() => {
    const questions = getQuestionsForPosition(application.position)
    return groupAnswersBySection(questions, application.answers)
  }, [application.position, application.answers])

  if (groups.length === 0) {
    return (
      <AdminCard title="Respostas">
        <p className="text-sm text-[rgba(255,255,255,0.5)]">
          Nenhuma resposta registrada.
        </p>
      </AdminCard>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <AdminCard key={group.sectionLabel}>
          <details open>
            <summary className="mb-4 cursor-pointer text-sm font-semibold uppercase tracking-wider text-[#B7B7B7] transition-colors hover:text-white">
              {group.sectionLabel}
            </summary>
            <div className="flex flex-col gap-5">
              {group.items.map((item) => (
                <div key={item.question.id}>
                  <p className="mb-1 text-sm text-[#B7B7B7]">
                    {item.question.question}
                  </p>
                  <p className="text-base leading-relaxed text-white whitespace-pre-wrap">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </details>
        </AdminCard>
      ))}
    </div>
  )
}
