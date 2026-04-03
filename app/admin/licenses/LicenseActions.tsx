'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  verificationId: string
  operatorId: string
}

export default function LicenseActions({ verificationId, operatorId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function act(action: 'approve' | 'reject') {
    setLoading(action)
    setErr(null)
    try {
      const res = await fetch(`/api/admin/license/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operator_id: operatorId, verification_id: verificationId }),
      })
      if (res.ok) {
        setDone(action === 'approve' ? 'approved' : 'rejected')
        router.refresh()
      } else {
        const d = await res.json()
        setErr(d.error ?? 'Action failed')
      }
    } catch {
      setErr('Network error')
    } finally {
      setLoading(null)
    }
  }

  if (done) return (
    <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20,
      background: done === 'approved' ? '#14532d' : '#450a0a',
      color: done === 'approved' ? '#4ade80' : '#f87171' }}>
      {done === 'approved' ? '✓ Approved' : '✗ Rejected'}
    </span>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => act('approve')}
          disabled={!!loading}
          style={{ background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading === 'reject' ? 0.5 : 1, fontSize: 13 }}
        >
          {loading === 'approve' ? 'Approving...' : 'Approve'}
        </button>
        <button
          onClick={() => act('reject')}
          disabled={!!loading}
          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading === 'approve' ? 0.5 : 1, fontSize: 13 }}
        >
          {loading === 'reject' ? 'Rejecting...' : 'Reject'}
        </button>
      </div>
      {err && <span style={{ fontSize: 11, color: '#f87171' }}>{err}</span>}
    </div>
  )
}
