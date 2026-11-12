import type { Article } from '@/payload-types'

type Genre = NonNullable<NonNullable<Article['tags']>[number]['tag']>

const genreLabels: Record<Genre, string> = {
  rock: 'Rock',
  elektronicka: 'Elektronická',
  rnb: 'R&B',
  'vazna-hudba': 'Vážná hudba',
  indie: 'Indie',
  alternativni: 'Alternativní',
  pop: 'Pop',
  metal: 'Metal',
  folk: 'Folk',
  jazz: 'Jazz',
  blues: 'Blues',
  rap: 'Rap',
  hiphop: 'Hip-hop',
  reggae: 'Reggae',
}

type Props = {
  tags?: Article['tags']
}

export function ArticleTags({ tags }: Props) {
  const genres = tags?.flatMap(({ tag }) => (tag ? [tag] : [])) ?? []

  if (genres.length === 0) return null

  return (
    <ul className="article-tags" aria-label="Žánry">
      {genres.map((genre, index) => (
        <li className="article-tag" key={`${genre}-${index}`}>
          {genreLabels[genre]}
        </li>
      ))}
    </ul>
  )
}
