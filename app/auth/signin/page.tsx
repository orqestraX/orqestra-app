'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL + '/auth/callback',
      },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  return (
    <div style={{ background: '#0a0e0b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f0fdf4' }}>Sign in to Orqestra</h1>
          <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>For licensed New Mexico cannabis operators only.</p>
        </div>

        {sent ? (
          <div style={{ background: '#0f2318', border: '1px solid #22c55e44', borderRadius: 16, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h2 style={{ color: '#4ade80', fontWeight: 700, marginBottom: 8 }}>Check your email</h2>
            <p style={{ color: '#9ca3af', fontSize: 14 }}>We sent a magic link to <strong style={{ color: '#d1fae5' }}>{email}</strong>. Click it to sign in — no password needed.</p>
            <p style={{ color: '#6b7280', fontSize: 12, marginTop: 16 }}>Link expires in 10 minutes. Check spam if you don't see it.</p>
          </div>
        ) : (
          <form onSubmit={handleSignIn} style={{ background: '#0f1a12', border: '1px solid #1a3a23', borderRadius: 16, padding: 32 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>
              Business Email
            </label>
            <input
              type='email'
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='you@yourbusiness.com'
              style={{ width: '100%', background: '#111c15', border: '1px solid #1a3a23', borderRadius: 10, padding: '12px 16px', color: '#f0fdf4', fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
            />
            {error && (
              <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
                {error}
              </div>
            )}
            <button type='submit' disabled={loading || !email}
              style={{ width: '100%', background: loading ? '#166534' : '#22c55e', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Sending...' : 'Send Magic Link →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' }}>
              No account? <Link href='/onboarding' style={{ color: '#4ade80' }}>Apply for early access</Link>
            </div>
          </form>
        )}

        <div style={{ marginTop: 24, padding: 16, background: '#0f1a12', border: '1px solid #1a3a23', borderRadius: 12, fontSize: 12, color: '#4b5563', textAlign: 'center' }}>
          🔒 Passwordless sign-in — no password to steal or leak.
        </div>
      </div>
    </div>
  )
}