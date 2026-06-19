import Link from 'next/link'

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
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Kulturní azyl">
        <span>Kulturní</span>
        <strong>azyl</strong>
      </Link>
      <nav className="nav" aria-label="Hlavní navigace">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="admin-link" href="/admin">
        CMS
      </Link>
    </header>
  )
}
