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
        {nav.map((item) => {
          const isRubrika = item.href.startsWith('/rubriky/')
          const slug = isRubrika ? item.href.split('/').pop() : undefined

          return (
            <Link key={item.href} href={item.href} data-slug={slug} onClick={closeMenu}>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="header-actions">
        <Link className="admin-link" href="/admin" onClick={closeMenu} aria-label="Otevřít CMS">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.9" />
            <path
              d="M5 19c1.5-3 4.2-4.5 7-4.5s5.5 1.5 7 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
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
