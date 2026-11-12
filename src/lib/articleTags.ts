import type { OptionObject } from 'payload'

export const articleTagGroups = {
  hudba: [
    { label: 'Rock', value: 'rock' },
    { label: 'Elektronická', value: 'elektronicka' },
    { label: 'R&B', value: 'rnb' },
    { label: 'Vážná hudba', value: 'vazna-hudba' },
    { label: 'Indie', value: 'indie' },
    { label: 'Alternativní', value: 'alternativni' },
    { label: 'Pop', value: 'pop' },
    { label: 'Metal', value: 'metal' },
    { label: 'Folk', value: 'folk' },
    { label: 'Folklór', value: 'folklor' },
    { label: 'Jazz', value: 'jazz' },
    { label: 'Blues', value: 'blues' },
    { label: 'Rap', value: 'rap' },
    { label: 'Hip-hop', value: 'hiphop' },
    { label: 'Reggae', value: 'reggae' },
    { label: 'EP', value: 'ep' },
    { label: 'Singl', value: 'singl' },
    { label: 'Album', value: 'album' },
    { label: 'Turné', value: 'turne' },
    { label: 'Koncert', value: 'koncert' },
  ],
  'malba-grafika': [
    { label: 'Malba', value: 'malba' },
    { label: 'Kresba', value: 'kresba' },
    { label: 'Plastika', value: 'plastika' },
    { label: 'Grafika', value: 'grafika' },
    { label: 'Ilustrace', value: 'ilustrace' },
  ],
  literatura: [
    { label: 'Poezie', value: 'poezie' },
    { label: 'Beletrie', value: 'beletrie' },
    { label: 'Autorské čtení', value: 'autorske-cteni' },
  ],
  'divadlo-performance': [
    { label: 'Divadlo', value: 'divadlo' },
    { label: 'Performance', value: 'performance' },
    { label: 'Slam poetry', value: 'slam-poetry' },
  ],
} satisfies Record<string, OptionObject[]>

export const commonArticleTags: OptionObject[] = [
  { label: 'Tisková zpráva', value: 'tiskova-zprava' },
  { label: 'Rozhovor', value: 'rozhovor' },
  { label: 'Novinky', value: 'novinky' },
  { label: 'CZ scéna', value: 'cz-scena' },
  { label: 'Zahraniční scéna', value: 'zahranicni-scena' },
  { label: 'SK scéna', value: 'sk-scena' },
  { label: 'Festival', value: 'festival' },
  { label: 'Fotoreportáž', value: 'fotoreportaz' },
  { label: 'Zákulisí', value: 'zakulisi' },
  { label: 'Výstava', value: 'vystava' },
  { label: 'Vydání', value: 'vydani' },
  { label: 'Tisk', value: 'tisk' },
  { label: 'Vernisáž', value: 'vernisaz' },
  { label: 'Sport', value: 'sport' },
  { label: 'Pozvánka', value: 'poznamka' },
  { label: 'Ostatní', value: 'ostatni' },
]

export const allArticleTags: OptionObject[] = [
  ...Object.values(articleTagGroups).flat(),
  ...commonArticleTags,
]

export const articleTagLabels = Object.fromEntries(
  allArticleTags.map(({ label, value }) => [value, label]),
) as Record<string, string>

export function getArticleTagsForCategory(categorySlug: string | undefined) {
  const categoryTags =
    categorySlug && categorySlug in articleTagGroups
      ? articleTagGroups[categorySlug as keyof typeof articleTagGroups]
      : []

  return [...categoryTags, ...commonArticleTags]
}
