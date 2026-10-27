import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdSlot } from '@/components/AdSlot'
import { BlockRenderer } from '@/lib/blockRenderer'
import { formatDate } from '@/lib/formatDate'
import { getPayloadClient } from '@/lib/payload'
import { sql } from '@payloadcms/db-postgres'

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

  await payload.db.drizzle.execute(sql`
    UPDATE "articles"
    SET "views" = COALESCE("views", 0) + 1
    WHERE "id" = ${article.id}
  `)
  article.views = (article.views ?? 0) + 1

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
        <span>Přečteno {article.views ?? 0}×</span>
        {author?.name && (
          <span>
            Autor:{' '}
            <Link href={`/redakce/${author.id}`}>{author.name}</Link>
          </span>
        )}
      </div>
      {image?.url && (
        <figure className="article-hero-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={image.alt || article.title} className="article-hero-image" />
          {image.credit && <figcaption className="image-credit">Foto: {image.credit}</figcaption>}
        </figure>
      )}
      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE} />
      <BlockRenderer blocks={article.content} />
    </article>
  )
}
