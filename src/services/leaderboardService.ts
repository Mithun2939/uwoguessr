import { supabase } from '../lib/supabase'
import type { LeaderboardEntry } from '../types/database'

/**
 * Get today's date in local timezone as YYYY-MM-DD
 * This ensures the date matches the user's calendar day, not UTC
 */
export function getTodayLocalDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Submit a score to the leaderboard
 */
export const submitScore = async (
  playerName: string,
  score: number,
  challengeDate: string
): Promise<LeaderboardEntry | null> => {
  const { data, error } = await supabase
    .from('leaderboard')
    .insert({
      player_name: playerName,
      score,
      challenge_date: challengeDate
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error submitting score:', error)
    return null
  }
  
  return data
}

/**
 * Get leaderboard entries
 * @param period - 'daily' (today only) | 'weekly' | 'all-time'
 * - daily: scores where challenge_date = today (resets each calendar day)
 * - weekly: scores from the last 7 days by created_at
 * - all-time: all scores
 */
export const getLeaderboard = async (
  period: 'daily' | 'weekly' | 'all-time' = 'daily',
  limit: number = 100
): Promise<LeaderboardEntry[]> => {
  const PAGE_SIZE = 1000 // Supabase/PostgREST default max per request

  let query = supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
  
  if (period === 'daily') {
    // Use local date to ensure it matches the user's calendar day
    const today = getTodayLocalDate()
    query = query.eq('challenge_date', today).limit(limit)
  } else if (period === 'weekly') {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    query = query.gte('created_at', weekAgo.toISOString()).limit(limit)
  } else if (period === 'all-time') {
    // Fetch every entry: paginate until no more rows
    const all: LeaderboardEntry[] = []
    let offset = 0
    let hasMore = true
    while (hasMore) {
      const { data: page, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1)
      if (error) {
        console.error('Error fetching leaderboard:', error)
        return all
      }
      const rows = page || []
      all.push(...rows)
      hasMore = rows.length === PAGE_SIZE
      offset += PAGE_SIZE
    }
    return all
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
  
  return data || []
}
