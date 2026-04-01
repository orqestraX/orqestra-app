import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { welcomeEmail } from '@/lib/email/templates'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if operator profile exists
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: operator } = await supabase
          .from('operators')
          .select('id, business_name, operator_type, email, created_at')
          .eq('user_id', user.id)
          .single()

        if (!operator) {
          // New user — redirect to onboarding
          return NextResponse.redirect(new URL('/onboarding', origin))
        }

        // Check if this is their first login (account just created within last 5 minutes)
        const isNew = operator.created_at && 
          (Date.now() - new Date(operator.created_at).getTime()) < 5 * 60 * 1000
        
        if (isNew && operator.email) {
          await sendEmail({
            to: operator.email,
            subject: 'Welcome to Orqestra — Complete your profile',
            html: welcomeEmail({
              businessName: operator.business_name,
              operatorType: operator.operator_type,
            }),
          })
        }

        return NextResponse.redirect(new URL('/dashboard', origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/auth/signin?error=auth_failed', origin))
}
