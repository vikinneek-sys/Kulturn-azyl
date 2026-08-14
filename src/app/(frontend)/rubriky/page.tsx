import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 50,
  })

  return result.docs
}

export default async function CategoriesIndex() {
  const categories = await getCategories()

  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="eyebrow">rubriky</p>
          <h1>Rubriky</h1>
          <p className="page-intro">Vyber rubriku a podívej se na poslední texty z dané části scény.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {categories.length > 0 ? (
            <div className="category-list">
              {categories.map((cat: any) => (
                <Link key={cat.id} className="category-tile" data-slug={cat.slug} href={`/rubriky/${cat.slug}`}>
                  <div>
                    <strong>{cat.title}</strong>
                    <p>{cat.description || 'Krátký popisek této rubriky zatím chybí. Brzy doplníme.'}</p>
                  </div>
                  <span>Otevřít rubriku →</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">Zatím nejsou žádné rubriky. Proveď seed nebo přidej ručně v adminu.</div>
          )}
        </div>
      </section>
    </>
  )
}
