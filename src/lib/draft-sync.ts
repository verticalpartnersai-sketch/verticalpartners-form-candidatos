import { supabase } from "@/lib/supabase"
import type { DiscScores } from "@/types"

const TABLE = "hiring_applications"

export async function createDraftRecord(
  positionId: string,
): Promise<string | null> {
  if (!supabase) return null

  try {
    // Generate UUID client-side to avoid needing .select() (anon has no SELECT policy)
    const id = crypto.randomUUID()

    const { error } = await supabase
      .from(TABLE)
      .insert({
        id,
        position: positionId,
        status: "draft",
        user_agent: navigator.userAgent,
      })

    if (error) return null
    return id
  } catch {
    return null
  }
}

export async function updateDraftFields(
  draftId: string,
  fields: Record<string, unknown>,
): Promise<boolean> {
  if (!supabase || !draftId) return false

  try {
    const { error } = await supabase
      .from(TABLE)
      .update(fields)
      .eq("id", draftId)

    return !error
  } catch {
    return false
  }
}

export async function finalizeDraft(
  draftId: string,
  discScores: DiscScores,
  discProfile: string,
): Promise<boolean> {
  if (!supabase || !draftId) return false

  try {
    const { error } = await supabase
      .from(TABLE)
      .update({
        status: "new",
        disc_scores: discScores,
        disc_profile: discProfile,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", draftId)

    return !error
  } catch {
    return false
  }
}
