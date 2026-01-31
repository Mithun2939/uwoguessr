// Supabase Edge Function: issue_device_token
// Issues a signed, anonymous device token (no login).
//
// IMPORTANT:
// - Turn OFF "Verify JWT" for this function in Supabase dashboard
// - Add Edge Function secret: DEVICE_TOKEN_SECRET (do NOT start with SUPABASE_)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-token',
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlEncodeString(s: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(s))
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const secret = Deno.env.get('DEVICE_TOKEN_SECRET') ?? ''
    if (!secret || secret.length < 16) {
      return new Response(
        JSON.stringify({ error: 'DEVICE_TOKEN_SECRET not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Anonymous device id
    const device_id = crypto.randomUUID()
    const payload = {
      v: 1,
      device_id,
      iat: Date.now(),
    }

    const payloadB64 = base64UrlEncodeString(JSON.stringify(payload))
    const sigBytes = await hmacSha256(secret, payloadB64)
    const sigB64 = base64UrlEncodeBytes(sigBytes)
    const token = `${payloadB64}.${sigB64}`

    return new Response(
      JSON.stringify({ token }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('issue_device_token error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

