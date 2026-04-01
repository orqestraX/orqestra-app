export default function SuspendedPage() {
  return (
    <div style={{ background: '#0a0e0b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>🚫</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f0fdf4', marginBottom: 12 }}>Account Suspended</h1>
        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: 24 }}>
          Your account has been suspended. This may be due to a license issue, a policy violation, or a compliance matter.
        </p>
        <p style={{ color: '#6b7280', fontSize: 13 }}>
          To resolve this, contact <a href='mailto:info@orqestrax.com' style={{ color: '#4ade80' }}>info@orqestrax.com</a> with your business name and license number.
        </p>
      </div>
    </div>
  )
}