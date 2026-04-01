import Link from 'next/link'

export default function PendingPage() {
  return (
    <div style={{ background: '#0a0e0b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>⏳</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f0fdf4', marginBottom: 12 }}>Application Under Review</h1>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 24 }}>
          Thank you for applying to Orqestra. Our team is verifying your NM cannabis license with the NMRLD. This usually takes 1–2 business days.
        </p>
        <div style={{ background: '#0f1a12', border: '1px solid #1a3a23', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 20, marginBottom: 12 }}>What happens next?</div>
          {[
            ['📋', 'License verification', 'We cross-reference your NM license number with NMRLD records.'],
            ['✅', 'Account activation', "Once verified, you'll get an email and full marketplace access."],
            ['📬', 'Check your email', 'You applied with your business email — watch for our approval notice.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} style={{ display: 'flex', gap: 12, marginBottom: 16, textAlign: 'left' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon as string}</span>
              <div>
                <div style={{ fontWeight: 700, color: '#d1fae5', fontSize: 14 }}>{title as string}</div>
                <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>{desc as string}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ color: '#4b5563', fontSize: 13 }}>
          Questions? Email <a href='mailto:info@orqestrax.com' style={{ color: '#4ade80' }}>info@orqestrax.com</a>
        </p>
        <Link href='/' style={{ display: 'inline-block', marginTop: 24, color: '#6b7280', fontSize: 13 }}>← Back to homepage</Link>
      </div>
    </div>
  )
}