import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET /auth/callback — Supabase magic link lands here
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if operator has a profile — if not, send to onboarding
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: operator } = await supabase
          .from('operators')
          .select('id, account_status')
          .eq('user_id', user.id)
          .single()

        if (!operator) {
          return NextResponse.redirect(new URL('/onboarding', origin))
        }
        if (operator.account_status === 'pending') {
          return NextResponse.redirect(new URL('/onboarding/pending', origin))
        }
      }
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  // Something went wrong — send back to sign-in
  return NextResponse.redirect(new URL('/auth/signin?error=auth_failed', origin))
}