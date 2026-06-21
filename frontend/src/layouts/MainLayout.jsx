import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const baseNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/shop', label: 'Shop' },
  { to: '/cart', label: 'Cart' },
  { to: '/checkout', label: 'Checkout' },
  { to: '/home', label: 'Store' }
]

export default function MainLayout() {
  const { logout, user } = useAuth()
  const navItems = [...baseNavItems]
  if (user?.roleId === 1) {
    navItems.splice(3, 0, { to: '/admin/reports', label: 'Reports' })
  }

  return (
    <div className="app-shell min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">AGS Grocery Store</h1>
          <p className="text-sm text-slate-400">Welcome back, {user?.name || 'Manager'}</p>
        </div>
        <button onClick={logout} className="rounded-md bg-accent px-4 py-2 text-white hover:bg-blue-500">
          Logout
        </button>
      </header>

      <div className="md:flex">
        <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-950/90 px-6 py-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
