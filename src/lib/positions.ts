import { TrendingUp, Headphones, Code2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface Position {
  id: string
  icon: LucideIcon
  title: string
  subtitle: string
}

export const POSITIONS: Position[] = [
  {
    id: "gestor-trafego",
    icon: TrendingUp,
    title: "Gestor de Tráfego",
    subtitle: "Meta Ads, Google Ads, LinkedIn Ads",
  },
  {
    id: "cs-suporte",
    icon: Headphones,
    title: "CS / Suporte ao Cliente",
    subtitle: "Onboarding, troubleshooting, sucesso do cliente",
  },
  {
    id: "dev-senior-fullstack",
    icon: Code2,
    title: "Dev Sênior Full-Stack",
    subtitle: "Next.js, TypeScript, Python, Supabase",
  },
]
