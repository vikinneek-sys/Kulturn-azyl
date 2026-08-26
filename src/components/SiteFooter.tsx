import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__identity">
        <Link href="/" className="site-footer__brand" aria-label="Kulturní azyl">
          <span>Kulturní</span> <strong>azyl</strong>
        </Link>
        <p>Prostor pro hudbu, obraz, slovo a živou scénu.</p>
      </div>

      <nav className="site-footer__nav" aria-label="Navigace v patičce">
        <Link href="/o-projektu">O projektu</Link>
        <Link href="/redakce">Redakce</Link>
        <Link href="/kontakt">Kontakt</Link>
      </nav>

      <p className="site-footer__copyright">© {new Date().getFullYear()} Kulturní azyl</p>
    </footer>
  )
}
