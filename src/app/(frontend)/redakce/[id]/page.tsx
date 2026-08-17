import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { ArticleCard } from '@/components/ArticleCard'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AuthorProfilePage({ params }: Props) {
  const { id } = await params
  const payload = await getPayloadClient()

  const userResult = await payload.find({
    collection: 'users',
    depth: 1,
    limit: 1,
    where: {
      id: {
        equals: Number(id),
      },
    },
  })

  const user = userResult.docs[0]
  if (!user) return notFound()

  const avatar = typeof user.avatar === 'object' ? user.avatar : null

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
          author: {
            equals: user.id,
          },
        },
      ],
    },
  })

  return (
    <>
      <section className="page-header">
        <div className="container author-profile-header">
          {avatar?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar.url} alt={avatar.alt || user.name} className="author-avatar" />
          )}
          <div>
            <p className="eyebrow">autor</p>
            <h1>{user.name}</h1>
            <p className="page-intro">{user.bio || 'Člen redakce a tvůrce textů, zvuků a kulturních záznamů.'}</p>
            <p className="eyebrow">{user.role}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Články autora</h2>
            <Link href="/redakce">Zpět do redakce →</Link>
          </div>

          {articles.docs.length > 0 ? (
            <div className="grid">
              {articles.docs.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="empty-state">Tento autor zatím nepřidal žádný publikovaný text.</div>
          )}
        </div>
      </section>
    </>
  )
}
