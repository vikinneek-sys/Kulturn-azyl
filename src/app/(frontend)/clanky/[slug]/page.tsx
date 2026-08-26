import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdSlot } from '@/components/AdSlot'
import { BlockRenderer } from '@/lib/blockRenderer'
import { formatDate } from '@/lib/formatDate'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  const article: any = result.docs[0]
  if (!article) return notFound()

  const category = typeof article.category === 'object' ? article.category : null
  const author = typeof article.author === 'object' ? article.author : null
  const image = typeof article.heroImage === 'object' ? article.heroImage : null

  return (
    <article className="article-detail">
      {category?.slug ? (
        <Link href={`/rubriky/${category.slug}`} className="eyebrow">
          {category.title || 'Článek'}
        </Link>
      ) : (
        <p className="eyebrow">{category?.title || 'Článek'}</p>
      )}
      <h1>{article.title}</h1>
      <p className="page-intro">{article.excerpt}</p>
      <div className="meta-line">
        {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
        {author?.name && (
          <span>
            Autor:{' '}
            <Link href={`/redakce/${author.id}`}>{author.name}</Link>
          </span>
        )}
      </div>
      {image?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt={image.alt || article.title} className="article-hero-image" />
      )}
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE} />
      <BlockRenderer blocks={article.content} />
    </article>
  )
}
