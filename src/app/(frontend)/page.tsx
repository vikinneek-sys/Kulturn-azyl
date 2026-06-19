import Link from 'next/link'
import { ArticleCard } from '@/components/ArticleCard'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

async function getPublishedArticles(limit = 9) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    limit,
    sort: '-publishedAt',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return result.docs
}

async function getCategories() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 20,
  })

  return result.docs
}

export default async function HomePage() {
  const [articles, categories] = await Promise.all([getPublishedArticles(9), getCategories()])
  const featured = articles.find((article: any) => article.featured) || articles[0]
  const rest = featured ? articles.filter((article: any) => article.id !== featured.id).slice(0, 6) : []

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">závislý kulturní magazín</p>
            <h1>Kultura má hlad. My jí dáme hovno.</h1>
            <p>
              Hudba, malba, grafika, literatura, divadlo a performance. Místo pro texty,
              recenze, rozhovory, reportáže a živé věci, které by jinak zapadly v šumu algoritmu.
            </p>
          </div>
          <div className="hero-card">
            <p className="eyebrow">redakční systém</p>
            <h2>Redaktor píše. Editor schvaluje. Web žije.</h2>
            <p>
              Administrace běží na <strong>/admin</strong>. Každý autor má vlastní účet a oprávnění.
              Žádný společný login, žádný digitální punk bez pojistek.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Hlavní článek</h2>
            <Link href="/rubriky/hudba">Všechny rubriky →</Link>
          </div>
          {featured ? <ArticleCard article={featured} large /> : <div className="empty-state">Zatím nejsou publikované články. Přihlas se do CMS a něco tam pošli.</div>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Nejnovější texty</h2>
          </div>
          {rest.length > 0 ? (
            <div className="grid">
              {rest.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="empty-state">Tady se objeví další publikované články.</div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Rubriky</h2>
          </div>
          <div className="category-list">
            {categories.map((category: any) => (
              <Link key={category.id} className="category-tile" href={`/rubriky/${category.slug}`}>
                <strong>{category.title}</strong>
                <p>{category.description || 'Články, rozhovory a reportáže z této části scény.'}</p>
                <span>Otevřít rubriku →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
