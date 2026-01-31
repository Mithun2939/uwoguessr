// Supabase Edge Function: submit_daily_score (Level 2 device token)
// - Anonymous (Verify JWT must be OFF)
// - Requires x-device-token header (signed by DEVICE_TOKEN_SECRET)
// - Enforces one submission per device per day via daily_device_submissions table
// - Recalculates score server-side and inserts leaderboard row using service role

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-token',
}

interface Guess {
  location_id: string
  guess_lat: number
  guess_lng: number
}

interface RequestBody {
  player_name: string
  challenge_date: string
  guesses: Guess[]
}

function base64UrlDecodeToString(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
  const binary = atob(b64 + pad)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

async function hmacSha256(key: string, data: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data))
  return new Uint8Array(sig)
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

function base64UrlDecodeToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
  const binary = atob(b64 + pad)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function verifyDeviceToken(token: string): Promise<{ device_id: string } | null> {
  const secret = Deno.env.get('DEVICE_TOKEN_SECRET') ?? ''
  if (!secret || secret.length < 16) return null

  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sigB64] = parts

  const expectedSig = await hmacSha256(secret, payloadB64)
  const providedSig = base64UrlDecodeToBytes(sigB64)
  if (!timingSafeEqual(expectedSig, providedSig)) return null

  const payloadJson = base64UrlDecodeToString(payloadB64)
  const payload = JSON.parse(payloadJson) as { v?: number; device_id?: string }
  if (payload?.v !== 1 || typeof payload.device_id !== 'string' || payload.device_id.length < 10) return null
  return { device_id: payload.device_id }
}

function getTodayInTimeZone(timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date())
  const y = parts.find(p => p.type === 'year')?.value
  const m = parts.find(p => p.type === 'month')?.value
  const d = parts.find(p => p.type === 'day')?.value
  return `${y}-${m}-${d}`
}

// Calculate distance between two coordinates using Haversine formula (meters)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateScore(distance: number): number {
  const maxDistance = 500
  if (distance > maxDistance) return 0
  return Math.round(5000 * (1 - distance / maxDistance))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const deviceToken = req.headers.get('x-device-token') || ''
    const verified = await verifyDeviceToken(deviceToken)
    if (!verified) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid device token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { player_name, challenge_date, guesses }: RequestBody = await req.json()

    if (!player_name || !challenge_date || !guesses || guesses.length !== 5) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: player_name, challenge_date, and 5 guesses required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const normalizedName = player_name.trim()
    if (normalizedName.length === 0 || normalizedName.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid player name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // IMPORTANT: use America/Toronto so "today" matches your campus day
    const today = getTodayInTimeZone('America/Toronto')
    if (challenge_date > today) {
      return new Response(
        JSON.stringify({ error: 'Cannot submit scores for future dates' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Enforce one submission per device per day
    const { data: deviceRow, error: deviceInsertError } = await supabaseAdmin
      .from('daily_device_submissions')
      .insert({
        device_id: verified.device_id,
        challenge_date
      })
      .select('id')
      .single()

    if (deviceInsertError) {
      // Unique violation means already submitted
      if ((deviceInsertError as { code?: string }).code === '23505') {
        return new Response(
          JSON.stringify({ error: `You already played the daily challenge for ${challenge_date}.` }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      console.error('daily_device_submissions insert error:', deviceInsertError)
      return new Response(
        JSON.stringify({ error: 'Failed to validate daily attempt' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Optional: also block same name twice per day (keeps leaderboard clean)
    const { data: existingEntries } = await supabaseAdmin
      .from('leaderboard')
      .select('id')
      .ilike('player_name', normalizedName)
      .eq('challenge_date', challenge_date)
      .limit(1)

    if (existingEntries && existingEntries.length > 0) {
      return new Response(
        JSON.stringify({ error: `Name already used today (${challenge_date}). Try a different name.` }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch locations
    const locationIds = guesses.map(g => g.location_id)
    const { data: locations, error: locationsError } = await supabaseAdmin
      .from('locations')
      .select('id, latitude, longitude')
      .in('id', locationIds)

    if (locationsError || !locations || locations.length !== 5) {
      // rollback device reservation
      if (deviceRow?.id) {
        await supabaseAdmin.from('daily_device_submissions').delete().eq('id', deviceRow.id)
      }
      return new Response(
        JSON.stringify({ error: 'Failed to fetch location data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let totalScore = 0
    const roundScores: number[] = []

    for (const g of guesses) {
      const loc = locations.find(l => l.id === g.location_id)
      if (!loc) {
        if (deviceRow?.id) {
          await supabaseAdmin.from('daily_device_submissions').delete().eq('id', deviceRow.id)
        }
        return new Response(
          JSON.stringify({ error: `Location ${g.location_id} not found` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const distance = calculateDistance(g.guess_lat, g.guess_lng, loc.latitude, loc.longitude)
      const s = calculateScore(distance)
      roundScores.push(s)
      totalScore += s
    }

    const { data: insertedEntry, error: insertError } = await supabaseAdmin
      .from('leaderboard')
      .insert({
        player_name: player_name.trim(),
        score: totalScore,
        challenge_date
      })
      .select()
      .single()

    if (insertError) {
      console.error('leaderboard insert error:', insertError)
      if (deviceRow?.id) {
        await supabaseAdmin.from('daily_device_submissions').delete().eq('id', deviceRow.id)
      }
      return new Response(
        JSON.stringify({ error: 'Failed to save score', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        entry: insertedEntry,
        calculated_score: totalScore,
        round_scores: roundScores
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('submit_daily_score error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

