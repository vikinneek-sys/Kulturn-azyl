import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const categories = await payload.find({
    collection: 'categories',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const category = categories.docs[0]
  if (!category) return notFound()

  const categoryTitle = category.slug === 'malba-grafika' ? 'Výtvarné umění' : category.title
  const categoryDescription =
    category.slug === 'hudba'
      ? 'Koncerty, novinky i rozhovory. Poklady skryté v malých klubech, barech nebo teprve hledající své první malé velké pódia.'
      : category.slug === 'malba-grafika'
        ? 'Máš volné místo na zdi? Chceš něco položit na noční stolek? Tady najdeš poctivé umělce ať už hledáš cool obrazy, postery nebo stylovější plastiky než zahradního trpaslíka z Unihobby.'
        : category.slug === 'literatura'
          ? 'Žádná maturita. Už stačilo Shakespera a Máchy. Přečti si něco od lidí, které znáš a chápeš, ať už chceš romány nebo verše.'
          : category.description

  const articles = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 24,
    sort: '-publishedAt',
    where: {
      and: [
        {
          status: {
            equals: 'published',
          },
        },
        {
          category: {
            equals: category.id,
          },
        },
      ],
    },
  })

  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="eyebrow">rubrika</p>
          <h1>{categoryTitle}</h1>
          {categoryDescription && <p className="page-intro">{categoryDescription}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {articles.docs.length > 0 ? (
            <div className="grid">
              {articles.docs.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="empty-state">V této rubrice zatím nic publikovaného není.</div>
          )}
        </div>
      </section>
    </>
  )
}
