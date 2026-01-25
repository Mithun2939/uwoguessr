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
 * - daily: scores where challenge_date = today (resets each calendar day)
 * - weekly: scores from the last 7 days by created_at
 * - all-time: all scores
 */
export const getLeaderboard = async (
  period: 'daily' | 'weekly' | 'all-time' = 'daily',
  limit: number = 100
): Promise<LeaderboardEntry[]> => {
  let query = supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit)
  
  if (period === 'daily') {
    const today = new Date().toISOString().split('T')[0]
    query = query.eq('challenge_date', today)
  } else if (period === 'weekly') {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    query = query.gte('created_at', weekAgo.toISOString())
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
  
  return data || []
}
