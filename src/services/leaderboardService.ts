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
 * Daily score submission payload (for Edge Function)
 */
export interface Guess {
  location_id: string
  guess_lat: number
  guess_lng: number
}

export interface SubmitScoreResult {
  success: boolean
  entry?: LeaderboardEntry
  calculatedScore?: number
  error?: string
}

const DEVICE_TOKEN_STORAGE_KEY = 'uwoguessr_device_token_v1'

function decodeDeviceIdForDebug(token: string): string | null {
  try {
    const [payloadB64] = token.split('.')
    if (!payloadB64) return null
    const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
    const json = atob(b64 + pad)
    const parsed = JSON.parse(json) as { device_id?: unknown }
    return typeof parsed.device_id === 'string' ? parsed.device_id : null
  } catch {
    return null
  }
}

async function getOrCreateDeviceToken(): Promise<string> {
  const existing = localStorage.getItem(DEVICE_TOKEN_STORAGE_KEY)
  if (existing) return existing

  const { data, error } = await supabase.functions.invoke('issue_device_token', {
    body: {}
  })

  if (error) {
    // Surface details if available
    const ctx = (error as unknown as { context?: unknown }).context as
      | { status?: number; statusText?: string; body?: unknown }
      | undefined
    let detailed = error.message || 'Failed to get device token'
    if (ctx?.status) detailed += ` (HTTP ${ctx.status}${ctx.statusText ? ` ${ctx.statusText}` : ''})`
    throw new Error(detailed)
  }

  const token = (data as { token?: unknown } | null)?.token
  if (typeof token !== 'string' || token.length < 20) {
    throw new Error('Device token response was invalid')
  }

  localStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, token)
  const deviceId = decodeDeviceIdForDebug(token)
  if (deviceId) console.log('[device-token] issued new device_id:', deviceId)
  return token
}

/**
 * Submit a daily challenge score via Edge Function (secure).
 * The server recalculates score; client cannot spoof points.
 */
export const submitScore = async (
  playerName: string,
  challengeDate: string,
  guesses: Guess[]
): Promise<SubmitScoreResult> => {
  try {
    const deviceToken = await getOrCreateDeviceToken()
    const deviceId = decodeDeviceIdForDebug(deviceToken)
    if (deviceId) console.log('[device-token] submitting as device_id:', deviceId)

    const { data, error } = await supabase.functions.invoke('submit_daily_score', {
      headers: {
        'x-device-token': deviceToken
      },
      body: {
        player_name: playerName,
        challenge_date: challengeDate,
        guesses
      }
    })

    if (error) {
      // Supabase returns a generic message for non-2xx. Try to surface the real JSON body.
      const ctx = (error as unknown as { context?: unknown }).context as
        | { status?: number; statusText?: string; body?: unknown }
        | undefined

      let detailed = error.message || 'Failed to submit score'
      if (ctx?.status) detailed += ` (HTTP ${ctx.status}${ctx.statusText ? ` ${ctx.statusText}` : ''})`

      if (ctx?.body != null) {
        // ctx.body can be a string OR a ReadableStream in the browser.
        let bodyText: string | undefined
        try {
          if (typeof ctx.body === 'string') {
            bodyText = ctx.body
          } else if (ctx.body instanceof ReadableStream) {
            bodyText = await new Response(ctx.body).text()
          } else {
            bodyText = String(ctx.body)
          }
        } catch {
          bodyText = undefined
        }

        if (bodyText) {
          try {
            const parsed = JSON.parse(bodyText)
            if (parsed?.error) detailed = String(parsed.error)
            else detailed = bodyText
          } catch {
            detailed = bodyText
          }
        }
      }

      console.error('Error calling submit_daily_score:', error)
      return { success: false, error: detailed }
    }

    if (data?.error) {
      return { success: false, error: data.error }
    }

    if (data?.success && data?.entry) {
      return {
        success: true,
        entry: data.entry as LeaderboardEntry,
        calculatedScore: data.calculated_score as number | undefined
      }
    }

    return { success: false, error: 'Unexpected response from server' }
  } catch (err) {
    console.error('Error submitting score:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Failed to submit score' }
  }
}

/**
 * Used for "one play per day" UX gating (best-effort; DB/Edge Function is the real enforcement).
 */
export const hasPlayedToday = async (playerName: string): Promise<boolean> => {
  const today = getTodayLocalDate()
  const { data, error } = await supabase
    .from('leaderboard')
    .select('id')
    .ilike('player_name', playerName.trim())
    .eq('challenge_date', today)
    .limit(1)

  if (error) {
    console.error('Error checking hasPlayedToday:', error)
    return false
  }

  return (data?.length ?? 0) > 0
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
