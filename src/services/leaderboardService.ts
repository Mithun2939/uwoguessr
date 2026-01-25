import { supabase } from '../lib/supabase'
import type { LeaderboardEntry } from '../types/database'

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
 * - daily: scores where challenge_date = today (resets each calendar day), top 100
 * - weekly: scores from the last 7 days by created_at, top 100
 * - all-time: every entry ever (paginated to fetch all)
 */
export const getLeaderboard = async (
  period: 'daily' | 'weekly' | 'all-time' = 'daily',
  limit: number = 100
): Promise<LeaderboardEntry[]> => {
  const PAGE_SIZE = 1000 // Supabase/PostgREST default max per request

  if (period === 'all-time') {
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

  let query = supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })

  if (period === 'daily') {
    const today = new Date().toISOString().split('T')[0]
    query = query.eq('challenge_date', today).limit(limit)
  } else if (period === 'weekly') {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    query = query.gte('created_at', weekAgo.toISOString()).limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }

  return data || []
}
