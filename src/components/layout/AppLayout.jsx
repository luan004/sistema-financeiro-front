import { NavLink, Outlet } from 'react-router-dom'
import './AppLayout.css'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Contas', to: '/accounts' },
  { label: 'Movimentações', to: '/movements' },
]

export default function AppLayout() {
  return (
    <main className="app-layout">
      <div className="app-shell">
        <aside className="app-sidebar">
          <nav className="app-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="app-content">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
