import type { Article } from '@/payload-types'

type ArticleTag = NonNullable<NonNullable<Article['tags']>[number]['tag']>

const tagLabels: Record<ArticleTag, string> = {
  rock: 'Rock',
  elektronicka: 'Elektronická',
  rnb: 'R&B',
  'vazna-hudba': 'Vážná hudba',
  indie: 'Indie',
  alternativni: 'Alternativní',
  'tiskova-zprava': 'Tisková zpráva',
  rozhovor: 'Rozhovor',
  novinky: 'Novinky',
  album: 'Album',
  singl: 'Singl',
  ep: 'EP',
  'cz-scena': 'CZ scéna',
  'zahranicni-scena': 'Zahraniční scéna',
  'sk-scena': 'SK scéna',
  festival: 'Festival',
  fotoreportaz: 'Fotoreportáž',
  zakulisi: 'Zákulisí',
  malba: 'Malba',
  kresba: 'Kresba',
  plastika: 'Plastika',
  grafika: 'Grafika',
  ilustrace: 'Ilustrace',
  vystava: 'Výstava',
  vydani: 'Vydání',
  tisk: 'Tisk',
  vernisaz: 'Vernisáž',
  'autorske-cteni': 'Autorské čtení',
  poezie: 'Poezie',
  beletrie: 'Beletrie',
  divadlo: 'Divadlo',
  performance: 'Performance',
  'slam-poetry': 'Slam poetry',
  sport: 'Sport',
  ostatni: 'Ostatní',
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
  const selectedTags = tags?.flatMap(({ tag }) => (tag ? [tag] : [])) ?? []

  if (selectedTags.length === 0) return null

  return (
    <ul className="article-tags" aria-label="Štítky">
      {selectedTags.map((tag, index) => (
        <li className="article-tag" key={`${tag}-${index}`}>
          {tagLabels[tag]}
        </li>
      ))}
    </ul>
  )
}
