import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page-header">
      <div className="container static-card">
        <p className="eyebrow">404</p>
        <h1>Tady nic není.</h1>
        <p className="page-intro">Stránka zmizela jak kytarista po zvukovce.</p>
        <Link href="/">Zpět na úvod →</Link>
      </div>
    </section>
  )
}
