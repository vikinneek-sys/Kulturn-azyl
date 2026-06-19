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
          <h1>{category.title}</h1>
          {category.description && <p className="page-intro">{category.description}</p>}
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
