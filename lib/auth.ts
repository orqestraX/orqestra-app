import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Operator } from '@/lib/types'

// ── Get the current operator from server context ───────────────────
// Returns null if not authenticated. Use in Server Components.
export async function getOperator(): Promise<Operator | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  const { data: operator } = await supabase
    .from('operators')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return operator
}

// ── Require authenticated + verified operator ─────────────────────
// Use at top of protected Server Components.
// Redirects to /auth/signin if not authenticated.
// Redirects to /onboarding/pending if not verified.
export async function requireOperator(): Promise<Operator> {
  const operator = await getOperator()
  if (!operator) redirect('/auth/signin')
  if (operator.account_status === 'pending') redirect('/onboarding/pending')
  if (operator.account_status === 'suspended') redirect('/suspended')
  return operator
}

// ── Require admin ─────────────────────────────────────────────────
export async function requireAdmin(): Promise<Operator> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  // Check admin role from user_metadata (set via service role)
  const role = user.user_metadata?.role
  if (role !== 'admin') redirect('/')

  const operator = await getOperator()
  if (!operator) redirect('/')
  return operator
}

// ── Sign out ──────────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/')
}