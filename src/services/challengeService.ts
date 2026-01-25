import { supabase } from '../lib/supabase'
import type { Location, DailyChallenge } from '../types/database'

/** Shuffle array (Fisher–Yates). Used to randomize which locations are picked for the daily challenge. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Get yesterday's date as YYYY-MM-DD (same timezone as toISOString). */
function getYesterdayDateString(): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().split('T')[0]
}

/**
 * Get today's daily challenge
 * Creates a new challenge if one doesn't exist for today.
 * Picks 5 random locations from the active pool, excluding locations used in
 * yesterday's challenge so each day gets 5 new pictures. Falls back to the
 * full pool if fewer than 5 locations remain after excluding.
 */
export const getTodayChallenge = async (): Promise<DailyChallenge | null> => {
  const today = new Date().toISOString().split('T')[0]
  
  // Check if challenge exists for today
  const { data: existingChallenge, error: fetchError } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('date', today)
    .single()
  
  if (existingChallenge && !fetchError) {
    return existingChallenge
  }
  
  // Fetch yesterday's challenge so we can exclude those locations (5 new pictures each day)
  const yesterday = getYesterdayDateString()
  const { data: yesterdayChallenge } = await supabase
    .from('daily_challenges')
    .select('location_ids')
    .eq('date', yesterday)
    .single()
  const yesterdayIds: string[] = yesterdayChallenge?.location_ids ?? []
  
  // Fetch active locations
  const { data: locations, error: locationsError } = await supabase
    .from('locations')
    .select('id')
    .eq('is_active', true)
    .limit(500)
  
  if (locationsError || !locations || locations.length < 5) {
    console.error('Error fetching locations for challenge:', locationsError)
    return null
  }
  
  // Prefer locations not used yesterday; fall back to full pool if fewer than 5
  const excludeYesterday = locations.filter(loc => !yesterdayIds.includes(loc.id))
  const pool = excludeYesterday.length >= 5 ? excludeYesterday : locations
  const locationIds = shuffle(pool).slice(0, 5).map(loc => loc.id)
  
  // Increment usage count for selected locations
  // Note: Supabase doesn't support raw SQL in update, so we'll fetch and update
  const { data: locationsToUpdate } = await supabase
    .from('locations')
    .select('id, usage_count')
    .in('id', locationIds)
  
  if (locationsToUpdate) {
    for (const loc of locationsToUpdate) {
      await supabase
        .from('locations')
        .update({ usage_count: (loc.usage_count || 0) + 1 })
        .eq('id', loc.id)
    }
  }
  
  const { data: newChallenge, error: createError } = await supabase
    .from('daily_challenges')
    .insert({
      date: today,
      location_ids: locationIds
    })
    .select()
    .single()
  
  if (createError) {
    console.error('Error creating challenge:', createError)
    return null
  }
  
  return newChallenge
}

/**
 * Get locations for a challenge.
 * Shuffles the 5 so round order (1–5) is random each time you load the game.
 */
export const getChallengeLocations = async (challenge: DailyChallenge): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .in('id', challenge.location_ids)
  
  if (error) {
    console.error('Error fetching challenge locations:', error)
    return []
  }
  
  const ordered = challenge.location_ids
    .map(id => data.find(loc => loc.id === id))
    .filter((loc): loc is Location => loc !== undefined)
  
  return shuffle(ordered)
}

/**
 * Get 5 random locations for Classic mode.
 * Does not use daily_challenges or increment usage_count. Play as much as you want.
 */
export const getRandomClassicLocations = async (): Promise<Location[]> => {
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .limit(500)

  if (error || !locations || locations.length < 5) {
    return []
  }
  return shuffle(locations).slice(0, 5)
}
