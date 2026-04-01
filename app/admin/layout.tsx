import Link from 'next/link'
import { requireAdmin } from '@/lib/session'

const NAV = [
  { href: '/admin', label: '📊 Overview', exact: true },
  { href: '/admin/licenses', label: '🔖 Licenses' },
  { href: '/admin/operators', label: '🏢 Operators' },
  { href: '/admin/orders', label: '📦 Orders' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="text-lg font-bold text-green-400">Orqestra</Link>
          <p className="text-xs text-gray-500 mt-0.5">Admin Console</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300">← Back to site</Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
