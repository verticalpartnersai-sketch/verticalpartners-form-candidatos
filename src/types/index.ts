export type ButtonVariant = "primary" | "secondary" | "ghost"

// --- DISC Types ---

export type DiscFactor = "D" | "I" | "S" | "C"

export interface DiscOption {
  readonly factor: DiscFactor
  readonly label: string
}

export interface DiscBlock {
  readonly id: number
  readonly options: readonly [DiscOption, DiscOption, DiscOption, DiscOption]
}

export interface DiscBlockAnswer {
  readonly most: DiscFactor
  readonly least: DiscFactor
}

export type DiscAnswers = Readonly<Record<number, DiscBlockAnswer>>

export interface DiscScores {
  readonly D: number
  readonly I: number
  readonly S: number
  readonly C: number
}

export interface DiscResult {
  readonly scores: DiscScores
  readonly primary: DiscFactor
  readonly secondary: DiscFactor
  readonly profileCode: string
  readonly description: string
}

export type FormPhase =
  | "questions"
  | "disc-transition"
  | "disc"
  | "loading"
  | "complete"

// --- Submission Types ---

export interface SubmissionPayload {
  readonly position: string
  readonly full_name: string
  readonly email: string
  readonly phone: string
  readonly linkedin: string
  readonly city: string
  readonly salary_expectation: string
  readonly github: string | null
  readonly portfolio: string | null
  readonly availability: string | null
  readonly answers: Readonly<Record<string, string>>
  readonly disc_responses: readonly DiscBlockAnswer[]
  readonly disc_scores: DiscScores
  readonly disc_profile: string
  readonly submitted_at: string
  readonly user_agent: string
}

// --- Form Engine Types ---

export type QuestionType =
  | "text"
  | "email"
  | "phone"
  | "url"
  | "textarea"
  | "select"
  | "radio"
  | "disc_block"

export interface QuestionOption {
  readonly value: string
  readonly label: string
  readonly description?: string
}

export interface Question {
  readonly id: string
  readonly type: QuestionType
  readonly section: string
  readonly sectionLabel: string
  readonly question: string
  readonly hint?: string
  readonly placeholder?: string
  readonly required: boolean
  readonly options?: readonly QuestionOption[]
  readonly minLength?: number
}

export type Answers = Readonly<Record<string, string>>

export type AnimationDirection = "forward" | "backward"

export interface FormEngineState {
  readonly questions: readonly Question[]
  readonly currentIndex: number
  readonly answers: Answers
  readonly direction: AnimationDirection
  readonly progress: number
  readonly validationError: string | null
  readonly isComplete: boolean
}

export interface FormEngineActions {
  readonly goNext: () => boolean
  readonly goPrev: () => void
  readonly setAnswer: (questionId: string, value: string) => void
  readonly currentQuestion: Question
  readonly currentAnswer: string
}

export type UseFormEngineReturn = FormEngineState & FormEngineActions

// --- Admin Types ---

export type ApplicationStatus = "draft" | "new" | "reviewed" | "approved" | "rejected" | "interview"

export type PositionId = "gestor-trafego" | "cs-suporte" | "dev-senior-fullstack"

export interface HiringApplication {
  readonly id: string
  readonly created_at: string
  readonly position: PositionId
  readonly status: ApplicationStatus
  readonly full_name: string
  readonly email: string
  readonly phone: string
  readonly linkedin: string
  readonly city: string
  readonly salary_expectation: string
  readonly github: string | null
  readonly portfolio: string | null
  readonly availability: string | null
  readonly answers: Readonly<Record<string, string>>
  readonly disc_responses: readonly DiscBlockAnswer[]
  readonly disc_scores: DiscScores | null
  readonly disc_profile: string | null
  readonly admin_notes: string | null
  readonly admin_rating: number | null
  readonly reviewed_at: string | null
  readonly reviewed_by: string | null
  readonly submitted_at: string
  readonly user_agent: string | null
}

export interface ApplicationFilters {
  readonly position: PositionId | "all"
  readonly status: ApplicationStatus | "all"
  readonly search: string
  readonly sortBy: "date" | "rating" | "name"
  readonly sortDirection: "asc" | "desc"
}

export interface AdminUser {
  readonly id: string
  readonly email: string
}
