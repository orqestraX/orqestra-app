import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { requireOperator } from '@/lib/session'
import { Expo } from 'expo-server-sdk'

export async function POST(req: NextRequest) {
  const operator = await requireOperator()
  const { token, platform } = await req.json()

  if (!token || !Expo.isExpoPushToken(token)) {
    return NextResponse.json({ error: 'Invalid Expo push token' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Upsert token (one per operator+token combo)
  const { error } = await supabase
    .from('push_tokens')
    .upsert({
      operator_id: operator.id,
      token,
      platform: platform ?? 'unknown',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'token' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const operator = await requireOperator()
  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const supabase = createAdminClient()
  await supabase.from('push_tokens').delete().eq('operator_id', operator.id).eq('token', token)
  return NextResponse.json({ ok: true })
}
