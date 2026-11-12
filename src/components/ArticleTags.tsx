import type { Article } from '@/payload-types'
import { articleTagLabels } from '@/lib/articleTags'

type ArticleTag = NonNullable<NonNullable<Article['tags']>[number]['tag']>

type Props = {
  tags?: Article['tags']
}

export function ArticleTags({ tags }: Props) {
  const selectedTags = tags?.flatMap(({ tag }) => (tag ? [tag] : [])) ?? []

  if (selectedTags.length === 0) return null

  return (
    <ul className="article-tags" aria-label="Štítky">
      {selectedTags.map((tag, index) => (
        <li className="article-tag" key={`${tag}-${index}`}>
          {articleTagLabels[tag as ArticleTag]}
        </li>
      ))}
    </ul>
  )
}
