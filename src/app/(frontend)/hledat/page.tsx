import { ArticleCard } from '@/components/ArticleCard'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ q?: string | string[] }>
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q.trim() : ''

  const results = query
    ? await (async () => {
        const payload = await getPayloadClient()
        return payload.find({
          collection: 'articles',
          depth: 2,
          limit: 50,
          sort: '-publishedAt',
          where: {
            and: [
              {
                status: {
                  equals: 'published',
                },
              },
              {
                or: [
                  {
                    title: {
                      contains: query,
                    },
                  },
                  {
                    excerpt: {
                      contains: query,
                    },
                  },
                ],
              },
            ],
          },
        })
      })()
    : null

  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="eyebrow">vyhledávání</p>
          <h1>Najdi článek</h1>
          <form action="/hledat" method="get" className="search-form">
            <label className="sr-only" htmlFor="article-search">
              Název nebo text článku
            </label>
            <input
              id="article-search"
              type="search"
              name="q"
              placeholder="Název nebo text článku"
              defaultValue={query}
            />
            <button type="submit">Hledat</button>
          </form>
        </div>
      </section>

      {query && (
        <section className="section">
          <div className="container">
            {results && results.docs.length > 0 ? (
              <>
                <div className="section-title">
                  <h2>Výsledky hledání ({results.totalDocs})</h2>
                </div>
                <div className="grid">
                  {results.docs.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">Pro „{query}“ jsme žádný článek nenašli.</div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
