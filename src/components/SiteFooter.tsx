export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Kulturní azyl. Magazín pro hudbu, obraz, slovo a živou scénu.</p>
      <p className="muted">Postaveno na Next.js + Payload CMS.</p>
    </footer>
  )
}
