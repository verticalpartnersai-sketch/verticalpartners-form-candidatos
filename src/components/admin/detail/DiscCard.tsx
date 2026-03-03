import { AdminCard } from "@/components/admin/ui/AdminCard"
import { DiscRadarChart } from "@/components/form/DiscRadarChart"
import { getFactorLabel } from "@/lib/disc-descriptions"
import { DISC_FACTOR_COLORS } from "@/lib/constants"
import type { DiscScores, DiscFactor } from "@/types"

interface DiscCardProps {
  readonly discScores: DiscScores | null
  readonly discProfile: string | null
}

const FACTORS: readonly DiscFactor[] = ["D", "I", "S", "C"]

const PROFILE_NAMES: Readonly<Record<string, string>> = {
  D: "Dominante",
  I: "Influente",
  S: "Estavel",
  C: "Conforme",
  DI: "Dominante-Influente",
  DC: "Dominante-Conforme",
  DS: "Dominante-Estavel",
  ID: "Influente-Dominante",
  IS: "Influente-Estavel",
  IC: "Influente-Conforme",
  SI: "Estavel-Influente",
  SD: "Estavel-Dominante",
  SC: "Estavel-Conforme",
  CI: "Conforme-Influente",
  CD: "Conforme-Dominante",
  CS: "Conforme-Estavel",
}

export function DiscCard({ discScores, discProfile }: DiscCardProps) {
  if (!discScores) {
    return (
      <AdminCard title="Perfil Comportamental DISC">
        <p className="text-sm text-[rgba(255,255,255,0.5)]">
          DISC nao completado
        </p>
      </AdminCard>
    )
  }

  const profileName = discProfile
    ? PROFILE_NAMES[discProfile] ?? discProfile
    : null

  return (
    <AdminCard title="Perfil Comportamental DISC">
      <DiscRadarChart scores={discScores} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        {FACTORS.map((factor) => (
          <div key={factor}>
            <div className="mb-1 flex items-baseline justify-between">
              <span
                className="text-lg font-bold"
                style={{ color: DISC_FACTOR_COLORS[factor] }}
              >
                {factor}
              </span>
              <span className="text-xs text-[rgba(255,255,255,0.5)]">
                {discScores[factor]}%
              </span>
            </div>
            <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${discScores[factor]}%`,
                  backgroundColor: DISC_FACTOR_COLORS[factor],
                }}
              />
            </div>
            <p className="text-xs text-[rgba(255,255,255,0.5)]">
              {getFactorLabel(factor)}
            </p>
          </div>
        ))}
      </div>

      {discProfile && (
        <div className="mt-5 flex justify-center">
          <span
            className="inline-block rounded-lg px-3 py-1 text-sm font-semibold"
            style={{
              background: "rgba(210, 182, 138, 0.12)",
              border: "1px solid rgba(210, 182, 138, 0.2)",
              color: "#D2B68A",
            }}
          >
            {discProfile}
            {profileName ? ` — ${profileName}` : ""}
          </span>
        </div>
      )}
    </AdminCard>
  )
}
