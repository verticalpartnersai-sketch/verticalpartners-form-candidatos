import type { HiringApplication } from "@/types"
import { POSITION_LABELS, STATUS_LABELS } from "@/lib/constants"
import { formatFullDate } from "@/lib/format-date"

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function collectAnswerKeys(
  applications: readonly HiringApplication[],
): readonly string[] {
  const keysSet = new Set<string>()

  for (const app of applications) {
    if (app.answers) {
      for (const key of Object.keys(app.answers)) {
        keysSet.add(key)
      }
    }
  }

  return [...keysSet].sort()
}

function buildRow(
  app: HiringApplication,
  answerKeys: readonly string[],
): string {
  const baseFields = [
    app.full_name,
    app.email,
    app.phone,
    POSITION_LABELS[app.position] ?? app.position,
    STATUS_LABELS[app.status] ?? app.status,
    app.disc_scores?.D?.toString() ?? "",
    app.disc_scores?.I?.toString() ?? "",
    app.disc_scores?.S?.toString() ?? "",
    app.disc_scores?.C?.toString() ?? "",
    app.disc_profile ?? "",
    app.admin_rating?.toString() ?? "",
    app.admin_notes ?? "",
    formatFullDate(app.submitted_at),
  ]

  const answerFields = answerKeys.map((key) => app.answers[key] ?? "")

  return [...baseFields, ...answerFields].map(escapeCsvField).join(",")
}

export function exportApplicationsToCSV(
  applications: readonly HiringApplication[],
): void {
  const answerKeys = collectAnswerKeys(applications)

  const baseHeaders = [
    "Nome",
    "Email",
    "Telefone",
    "Cargo",
    "Status",
    "D",
    "I",
    "S",
    "C",
    "Perfil DISC",
    "Rating",
    "Notas",
    "Data",
  ]

  const headers = [...baseHeaders, ...answerKeys]

  const rows = applications.map((app) => buildRow(app, answerKeys))

  const csvContent = [headers.join(","), ...rows].join("\n")

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `candidaturas-${new Date().toISOString().slice(0, 10)}.csv`
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
