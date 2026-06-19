import Link from 'next/link'
import { formatDate } from '@/lib/formatDate'

type Props = {
  article: any
  large?: boolean
}

export function ArticleCard({ article, large = false }: Props) {
  const category = typeof article.category === 'object' ? article.category : null
  const author = typeof article.author === 'object' ? article.author : null
  const image = typeof article.heroImage === 'object' ? article.heroImage : null

  return (
    <article className={large ? 'article-card article-card-large' : 'article-card'}>
      {image?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt={image.alt || article.title} className="article-image" />
      )}
      <div className="article-body">
        <div className="meta-line">
          {category?.title && <span>{category.title}</span>}
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
        </div>
        <h2>
          <Link href={`/clanky/${article.slug}`}>{article.title}</Link>
        </h2>
        {article.excerpt && <p>{article.excerpt}</p>}
        {author?.name && <p className="byline">Autor: {author.name}</p>}
      </div>
    </article>
  )
}
