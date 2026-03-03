import { supabase } from "@/lib/supabase"
import type {
  ApplicationFilters,
  ApplicationStatus,
  HiringApplication,
} from "@/types"

export async function fetchApplications(
  filters: ApplicationFilters,
): Promise<{ data: readonly HiringApplication[]; error: string | null }> {
  if (!supabase) return { data: [], error: "Supabase nao configurado." }

  let query = supabase.from("hiring_applications").select("*")

  if (filters.position !== "all") {
    query = query.eq("position", filters.position)
  }
  if (filters.status !== "all") {
    query = query.eq("status", filters.status)
  }
  if (filters.search) {
    query = query.or(
      `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
    )
  }

  const column =
    filters.sortBy === "date"
      ? "created_at"
      : filters.sortBy === "rating"
        ? "admin_rating"
        : "full_name"

  query = query.order(column, {
    ascending: filters.sortDirection === "asc",
    nullsFirst: false,
  })

  const { data, error } = await query
  if (error) return { data: [], error: error.message }
  return { data: (data ?? []) as unknown as HiringApplication[], error: null }
}

export async function fetchApplicationById(
  id: string,
): Promise<{ data: HiringApplication | null; error: string | null }> {
  if (!supabase) return { data: null, error: "Supabase nao configurado." }

  const { data, error } = await supabase
    .from("hiring_applications")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as unknown as HiringApplication, error: null }
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  reviewedBy: string,
): Promise<{ success: boolean; error: string | null }> {
  if (!supabase) return { success: false, error: "Supabase nao configurado." }

  const { error } = await supabase
    .from("hiring_applications")
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { success: false, error: error.message }
  return { success: true, error: null }
}

export async function updateApplicationRating(
  id: string,
  rating: number,
): Promise<{ success: boolean; error: string | null }> {
  if (!supabase) return { success: false, error: "Supabase nao configurado." }

  const { error } = await supabase
    .from("hiring_applications")
    .update({ admin_rating: rating })
    .eq("id", id)

  if (error) return { success: false, error: error.message }
  return { success: true, error: null }
}

export async function updateApplicationNotes(
  id: string,
  notes: string,
): Promise<{ success: boolean; error: string | null }> {
  if (!supabase) return { success: false, error: "Supabase nao configurado." }

  const { error } = await supabase
    .from("hiring_applications")
    .update({ admin_notes: notes })
    .eq("id", id)

  if (error) return { success: false, error: error.message }
  return { success: true, error: null }
}
