import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import './AppLayout.css'

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Contas', to: '/accounts' },
  { label: 'Movimentações', to: '/movements' },
]

export default function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <main className="app-layout">
      <div className="app-shell">
        <button
          type="button"
          className="app-menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label={isMenuOpen ? 'Fechar menu de navegacao' : 'Abrir menu de navegacao'}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        {isMenuOpen && <button type="button" className="app-menu-backdrop" aria-label="Fechar menu" onClick={() => setIsMenuOpen(false)} />}
        <aside id="primary-navigation" className={`app-sidebar${isMenuOpen ? ' open' : ''}`}>
          <nav className="app-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>
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
