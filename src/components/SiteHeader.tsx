'use client'

import Link from 'next/link'
import { useState } from 'react'

const nav = [
  { href: '/', label: 'Úvod' },
  { href: '/rubriky/hudba', label: 'Hudba' },
  { href: '/rubriky/malba-grafika', label: 'Malba / grafika' },
  { href: '/rubriky/literatura', label: 'Literatura' },
  { href: '/rubriky/divadlo-performance', label: 'Divadlo / performance' },
  { href: '/redakce', label: 'Redakce' },
  { href: '/o-projektu', label: 'O projektu' },
  { href: '/kontakt', label: 'Kontakt' },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Kulturní azyl" onClick={closeMenu}>
        <span>Kulturní</span>
        <strong>azyl</strong>
      </Link>

      <nav id="main-navigation" className={`nav ${isMenuOpen ? 'nav-open' : ''}`} aria-label="Hlavní navigace">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="admin-link" href="/admin" onClick={closeMenu}>
          CMS
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Zavřít hlavní menu' : 'Otevřít hlavní menu'}
          aria-controls="main-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
