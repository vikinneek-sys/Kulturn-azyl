import Link from 'next/link'
import { AdSlot } from '@/components/AdSlot'
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

async function getMostReadArticle() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 1,
    sort: '-views',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  return result.docs[0] ?? null
}

async function getCategories() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 20,
  })

  // Sort by custom order: Hudba, Malba/grafika, Literatura, Divadlo/performance
  const order = ['hudba', 'malba-grafika', 'literatura', 'divadlo-performance']
  return result.docs.sort((a: any, b: any) => {
    const aIndex = order.indexOf(a.slug || '')
    const bIndex = order.indexOf(b.slug || '')
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })
}

export default async function HomePage() {
  const [articles, categories, mostRead] = await Promise.all([
    getPublishedArticles(9),
    getCategories(),
    getMostReadArticle(),
  ])
  const rest = articles.slice(0, 6)
  const mostReadImage = typeof mostRead?.heroImage === 'object' ? mostRead.heroImage : null

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">nezávislý kulturní magazín</p>
            <h1 className="hero-headline">
              <span>Úkryt před</span>
              <span>světem mainstreamu</span>
            </h1>
            <p>
              Hudba, malba, grafika, literatura, divadlo a performance. Místo pro texty,
              recenze, rozhovory, reportáže a živé věci, které by jinak zapadly v šumu algoritmu.
            </p>
          </div>

          {mostRead ? (
            <div className="hero-feature">
              <p className="eyebrow hero-feature__title">Nejčtenější článek</p>
              <aside className="hero-card hero-card--most-read">
                {mostReadImage?.url && (
                  <Link
                    href={`/clanky/${mostRead.slug}`}
                    className="hero-card__image-link"
                    aria-label={`Otevřít článek ${mostRead.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mostReadImage.url}
                      alt={mostReadImage.alt || mostRead.title}
                      className="hero-card__image"
                    />
                  </Link>
                )}
                <Link href={`/clanky/${mostRead.slug}`} className="hero-card__title">
                  {mostRead.title}
                </Link>
              </aside>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Nejnovější články</h2>
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

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} />

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Rubriky</h2>
          </div>
            <div className="category-list">
            {categories.map((category: any) => (
              <Link key={category.id} className="category-tile" data-slug={category.slug} href={`/rubriky/${category.slug}`}>
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
