'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type AuthMethod = 'password' | 'phone' | 'magic'
type AuthMode = 'signin' | 'signup'
type PhoneStep = 'number' | 'otp'

export default function SignInPage() {
  const [method, setMethod] = useState<AuthMethod>('password')
  const [mode, setMode] = useState<AuthMode>('signin')
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('number')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()
  const getRedirectTo = () =>
    typeof window !== 'undefined'
      ? window.location.origin + '/auth/callback'
      : 'https://orqestrax.com/auth/callback'

  // Email + Password
  const handlePassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: getRedirectTo() },
      })
      setLoading(false)
      if (error) { setError(error.message); return }
      setMessage('Check your email to confirm your account, then come back to sign in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      setLoading(false)
      if (error) { setError(error.message); return }
      window.location.href = '/dashboard'
    }
  }

  // Magic Link
  const handleMagicLink = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: getRedirectTo() },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  // Phone OTP — send
  const handleSendOtp = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({ phone })
    setLoading(false)
    if (error) { setError(error.message); return }
    setPhoneStep('otp')
  }

  // Phone OTP — verify
  const handleVerifyOtp = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
    setLoading(false)
    if (error) { setError(error.message); return }
    window.location.href = '/dashboard'
  }

  const switchMethod = (m: AuthMethod) => {
    setMethod(m)
    setError('')
    setSent(false)
    setMessage('')
    setPhoneStep('number')
    setOtp('')
  }

  // ─── styles ───
  const bg = '#0a0e0b'
  const cardBg = '#0f1a12'
  const border = '#1a3a23'
  const green = '#22c55e'
  const text = '#f0fdf4'
  const textMuted = '#6b7280'
  const textSub = '#9ca3af'

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 6px',
    background: active ? '#0f2318' : 'transparent',
    border: active ? '1px solid #22c55e44' : '1px solid transparent',
    borderRadius: 10,
    color: active ? green : textMuted,
    fontWeight: active ? 700 : 400,
    fontSize: 13,
    cursor: 'pointer',
  })

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#111c15',
    border: '1px solid #1a3a23',
    borderRadius: 10,
    padding: '12px 16px',
    color: text,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 16,
  }

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    background: disabled ? '#166534' : green,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '14px',
    fontWeight: 700,
    fontSize: 16,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
  })

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: textSub,
    marginBottom: 8,
  }

  const errorBox = (msg: string) => msg ? (
    <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
      {msg}
    </div>
  ) : null

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: text, margin: 0 }}>Sign in to Orqestra</h1>
          <p style={{ color: textMuted, marginTop: 8, fontSize: 14 }}>For licensed New Mexico cannabis operators only.</p>
        </div>

        <div style={{ background: cardBg, border: '1px solid ' + border, borderRadius: 16, padding: 28 }}>

          {/* Method tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button style={tabStyle(method === 'password')} onClick={() => switchMethod('password')}>
              🔑 Password
            </button>
            <button style={tabStyle(method === 'phone')} onClick={() => switchMethod('phone')}>
              📱 Phone
            </button>
            <button style={tabStyle(method === 'magic')} onClick={() => switchMethod('magic')}>
              ✉️ Magic Link
            </button>
          </div>

          {/* ── Email + Password ── */}
          {method === 'password' && !message && (
            <>
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#0a100c', borderRadius: 10, padding: 4 }}>
                <button onClick={() => { setMode('signin'); setError('') }}
                  style={{ flex: 1, padding: '8px', background: mode === 'signin' ? '#1a3a23' : 'transparent', border: 'none', borderRadius: 8, color: mode === 'signin' ? text : textMuted, fontWeight: mode === 'signin' ? 600 : 400, fontSize: 14, cursor: 'pointer' }}>
                  Sign In
                </button>
                <button onClick={() => { setMode('signup'); setError('') }}
                  style={{ flex: 1, padding: '8px', background: mode === 'signup' ? '#1a3a23' : 'transparent', border: 'none', borderRadius: 8, color: mode === 'signup' ? text : textMuted, fontWeight: mode === 'signup' ? 600 : 400, fontSize: 14, cursor: 'pointer' }}>
                  Create Account
                </button>
              </div>
              <form onSubmit={handlePassword}>
                <label style={labelStyle}>Business Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourbusiness.com" style={inputStyle} />
                <label style={labelStyle}>
                  Password{' '}
                  {mode === 'signup' && <span style={{ color: textMuted, fontWeight: 400 }}>(min. 8 characters)</span>}
                </label>
                <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                {errorBox(error)}
                <button type="submit" disabled={loading || !email || !password} style={btnStyle(loading || !email || !password)}>
                  {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
                </button>
              </form>
            </>
          )}

          {method === 'password' && message && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
              <h2 style={{ color: green, fontWeight: 700, marginBottom: 8 }}>Check your email</h2>
              <p style={{ color: textSub, fontSize: 14 }}>{message}</p>
              <button onClick={() => setMessage('')} style={{ marginTop: 16, background: 'transparent', border: '1px solid ' + border, borderRadius: 8, color: textMuted, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>
                ← Back
              </button>
            </div>
          )}

          {/* ── Phone OTP ── */}
          {method === 'phone' && phoneStep === 'number' && (
            <form onSubmit={handleSendOtp}>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 505 555 0100" style={inputStyle} />
              <p style={{ color: textMuted, fontSize: 12, marginBottom: 16, marginTop: -10 }}>Include country code (e.g. +1 for US)</p>
              {errorBox(error)}
              <button type="submit" disabled={loading || !phone} style={btnStyle(loading || !phone)}>
                {loading ? 'Sending…' : 'Send Code →'}
              </button>
            </form>
          )}

          {method === 'phone' && phoneStep === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <p style={{ color: textSub, fontSize: 14, marginBottom: 16 }}>
                Enter the 6-digit code sent to <strong style={{ color: text }}>{phone}</strong>
              </p>
              <label style={labelStyle}>Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/D/g, ''))}
                placeholder="000000"
                style={{ ...inputStyle, letterSpacing: '0.4em', textAlign: 'center', fontSize: 26 }}
                autoFocus
              />
              {errorBox(error)}
              <button type="submit" disabled={loading || otp.length < 6} style={btnStyle(loading || otp.length < 6)}>
                {loading ? 'Verifying…' : 'Verify & Sign In →'}
              </button>
              <button type="button" onClick={() => { setPhoneStep('number'); setOtp(''); setError('') }}
                style={{ marginTop: 10, width: '100%', background: 'transparent', border: '1px solid ' + border, borderRadius: 10, color: textMuted, padding: '10px', cursor: 'pointer', fontSize: 14 }}>
                ← Change number
              </button>
            </form>
          )}

          {/* ── Magic Link ── */}
          {method === 'magic' && !sent && (
            <form onSubmit={handleMagicLink}>
              <p style={{ color: textSub, fontSize: 14, marginBottom: 16 }}>
                We’ll email you a one-click sign-in link — no password needed.
              </p>
              <label style={labelStyle}>Business Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourbusiness.com" style={inputStyle} />
              {errorBox(error)}
              <button type="submit" disabled={loading || !email} style={btnStyle(loading || !email)}>
                {loading ? 'Sending…' : 'Send Magic Link →'}
              </button>
            </form>
          )}

          {method === 'magic' && sent && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
              <h2 style={{ color: green, fontWeight: 700, marginBottom: 8 }}>Check your email</h2>
              <p style={{ color: textSub, fontSize: 14 }}>
                We sent a magic link to <strong style={{ color: '#d1fae5' }}>{email}</strong>. Click it to sign in.
              </p>
              <p style={{ color: textMuted, fontSize: 12, marginTop: 12 }}>
                Link expires in 10 minutes. Check spam if you don’t see it.
              </p>
            </div>
          )}

          {/* Footer */}
          {!(method === 'password' && message) && !(method === 'magic' && sent) && (
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: textMuted }}>
              No account?{' '}
              <Link href="/onboarding" style={{ color: green }}>Apply for early access</Link>
            </div>
          )}
        </div>

        <div style={{ marginTop: 20, padding: 14, background: cardBg, border: '1px solid ' + border, borderRadius: 12, fontSize: 12, color: '#4b5563', textAlign: 'center' }}>
          🔒 Your data is encrypted and protected. Licensed operators only.
        </div>
      </div>
    </div>
  )
}
