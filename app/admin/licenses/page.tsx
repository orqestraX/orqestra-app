// app/admin/licenses/page.tsx — Admin license verification queue
import { requireAdmin } from '@/lib/session'
import { createAdminClient } from '@/lib/supabase/server'
import LicenseActions from './LicenseActions'

export default async function AdminLicensesPage() {
  await requireAdmin()
  const admin = createAdminClient()

  const { data: pending } = await admin
    .from('license_verifications')
    .select('*, operators(business_name, email, operator_type, city)')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true })

  const { data: recent } = await admin
    .from('license_verifications')
    .select('*, operators(business_name, email, operator_type)')
    .in('status', ['verified', 'rejected', 'approved'])
    .order('reviewed_at', { ascending: false })
    .limit(20)

  return (
    <div style={{ background: '#0a0e0b', minHeight: '100vh', color: '#e8f0eb', padding: '40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f0fdf4' }}>License Verification Queue</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>Review and approve operator license submissions before they can access the marketplace.</p>
        </div>

        {/* Pending */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24', marginBottom: 16 }}>
            Pending Review ({pending?.length ?? 0})
          </h2>
          {(!pending || pending.length === 0) && (
            <p style={{ color: '#6b7280' }}>No pending submissions.</p>
          )}
          {pending?.map((v: any) => (
            <div key={v.id} style={{ background: '#0f1a12', border: '1px solid #1a3a23', borderRadius: 12, padding: 20, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#d1fae5', marginBottom: 4 }}>{v.operators?.business_name}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{v.operators?.email} · {v.operators?.operator_type} · {v.operators?.city}</div>
                  <div style={{ fontSize: 13, marginTop: 8, color: '#f0fdf4' }}>License: <strong>{v.license_number}</strong></div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Submitted: {new Date(v.submitted_at).toLocaleDateString()}</div>
                  {v.notes && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Notes: {v.notes}</div>}
                </div>
                <LicenseActions verificationId={v.id} operatorId={v.operator_id} />
              </div>
            </div>
          ))}
        </section>

        {/* Recently reviewed */}
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#d1fae5', marginBottom: 16 }}>Recently Reviewed</h2>
          {recent?.map((v: any) => (
            <div key={v.id} style={{ background: '#0f1a12', border: '1px solid #1a3a23', borderRadius: 10, padding: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#d1fae5' }}>{v.operators?.business_name}</span>
                <span style={{ color: '#6b7280', fontSize: 13, marginLeft: 12 }}>{v.license_number}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                background: v.status === 'approved' || v.status === 'verified' ? '#14532d' : '#450a0a',
                color: v.status === 'approved' || v.status === 'verified' ? '#4ade80' : '#f87171' }}>
                {v.status === 'approved' || v.status === 'verified' ? 'Approved' : 'Rejected'}
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
