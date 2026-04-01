import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ââ Server client (for Server Components + API routes) ââââââââââââ
// Uses anon key + RLS â safe for user-facing server code.
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component â cookies set in middleware instead
          }
        },
      },
    }
  )
}

// ââ Admin client (service role â NEVER use client-side) ââââââââââ
// Bypasses RLS. Only for server-side admin operations.
// Import path: @/lib/supabase/admin
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client must only be used server-side.')
  }
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}