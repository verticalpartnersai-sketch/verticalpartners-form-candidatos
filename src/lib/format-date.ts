const MINUTE_MS = 60_000
const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000
const MONTH_THRESHOLD_DAYS = 30

function padTwo(n: number): string {
  return n.toString().padStart(2, "0")
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  if (diffMs < 0) {
    return formatAbsoluteDate(date)
  }

  if (diffMs < MINUTE_MS) {
    return "agora"
  }

  const diffMinutes = Math.floor(diffMs / MINUTE_MS)
  if (diffMinutes < 60) {
    return `ha ${diffMinutes} min`
  }

  const diffHours = Math.floor(diffMs / HOUR_MS)
  if (diffHours < 24) {
    return `ha ${diffHours} hora${diffHours > 1 ? "s" : ""}`
  }

  const diffDays = Math.floor(diffMs / DAY_MS)
  if (diffDays < MONTH_THRESHOLD_DAYS) {
    return `ha ${diffDays} dia${diffDays > 1 ? "s" : ""}`
  }

  return formatAbsoluteDate(date)
}

function formatAbsoluteDate(date: Date): string {
  const day = padTwo(date.getDate())
  const month = padTwo(date.getMonth() + 1)
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString)
  const day = padTwo(date.getDate())
  const month = padTwo(date.getMonth() + 1)
  const year = date.getFullYear()
  const hours = padTwo(date.getHours())
  const minutes = padTwo(date.getMinutes())
  return `${day}/${month}/${year} as ${hours}:${minutes}`
}
