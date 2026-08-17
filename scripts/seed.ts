import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const categories = [
  {
    title: 'Hudba',
    slug: 'hudba',
    description: 'Koncerty, rozhovory, recenze, scéna a hluk, který má důvod existovat.',
  },
  {
    title: 'Malba / grafika',
    slug: 'malba-grafika',
    description: 'Obrazy, grafika, výstavy, skici, plakáty a vizuální bordel s duší.',
  },
  {
    title: 'Literatura',
    slug: 'literatura',
    description: 'Poezie, próza, knihy, autorská čtení a texty, které nekončí u lajku.',
  },
  {
    title: 'Divadlo / performance',
    slug: 'divadlo-performance',
    description: 'Živé umění, divadlo, performance, experiment a tělo v prostoru.',
  },
]

const richText = (text: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        children: [
          {
            mode: 'normal',
            text,
            type: 'text',
            style: '',
            detail: 0,
            format: 0,
            version: 1,
          },
        ],
        direction: 'ltr' as const,
      },
    ],
    direction: 'ltr' as const,
  },
})

const blockContent = (text: string) => [
  {
    blockType: 'paragraph',
    text,
  },
]

async function main() {
  const payload = await getPayload({ config })

  const existingAdmin = await payload.find({
    collection: 'users',
    limit: 1,
    where: {
      email: {
        equals: 'admin@kulturniazyl.cz',
      },
    },
    overrideAccess: true,
  })

  const admin =
    existingAdmin.docs[0] ||
    (await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        email: 'admin@kulturniazyl.cz',
        password: 'ChangeMe123!',
        name: 'Admin Kulturního azylu',
        role: 'admin',
        bio: 'Technická správa a šéfredaktorský klíč od sklepa.',
      },
    }))

  const createdCategories: any[] = []

  for (const category of categories) {
    const existing = await payload.find({
      collection: 'categories',
      limit: 1,
      where: {
        slug: {
          equals: category.slug,
        },
      },
      overrideAccess: true,
    })

    const doc =
      existing.docs[0] ||
      (await payload.create({
        collection: 'categories',
        overrideAccess: true,
        data: category,
      }))

    createdCategories.push(doc)
  }

  const sampleArticles = [
      {
        title: 'Kulturní azyl otevírá dveře',
        slug: 'kulturni-azyl-otevira-dvere',
        excerpt:
          'Nový prostor pro hudbu, obraz, literaturu a živou kulturu. Žádná sterilní vitrína, spíš sklep s dobrým světlem.',
        categoryIndex: 0,
        featured: true,
      },
      {
        title: 'Hluk, co má důvod',
        slug: 'hluk-co-ma-duvod',
        excerpt: 'Reportáž z klubového večera, kde špinavé kytary potkaly poezii.',
        categoryIndex: 0,
      },
      {
        title: 'Barvy, co křičí',
        slug: 'barvy-co-krici',
        excerpt: 'Přehled současné grafiky a malby, která neomlouvá tóny.',
        categoryIndex: 1,
      },
      {
        title: 'Slova, která nespí',
        slug: 'slova-ktera-nespi',
        excerpt: 'Krátké eseje a ukázky z připravovaných sbírek.',
        categoryIndex: 2,
      },
      {
        title: 'Tělo v prostoru',
        slug: 'telo-v-prostoru',
        excerpt: 'Rozhovor s performerkou o hranicích mezi divadlem a životem.',
        categoryIndex: 3,
      },
    ]

    // Smaž všechny články aby se vynulovala data
    try {
      const allArticles = await payload.find({
        collection: 'articles',
        limit: 1000,
        overrideAccess: true,
      })
      for (const art of allArticles.docs) {
        await payload.delete({
          collection: 'articles',
          id: art.id,
          overrideAccess: true,
        })
      }
    } catch (e) {
      // ignore
    }

    for (const art of sampleArticles) {
      await payload.create({
        collection: 'articles',
        overrideAccess: true,
        data: {
          title: art.title,
          excerpt: art.excerpt,
          category: createdCategories[art.categoryIndex].id,
          author: admin.id,
          status: 'published',
          featured: !!art.featured,
          publishedAt: new Date().toISOString(),
          content: blockContent(
            `Toto je ukázkový obsah článku "${art.title}". Slouží jako dummy obsah pro lokální vývoj.`
          ) as any,
        },
      })
    }

  console.log('Seed hotový.')
  console.log('Admin login: admin@kulturniazyl.cz')
  console.log('Admin heslo: ChangeMe123!')
  console.log('Po prvním přihlášení heslo změnit. Fakt. Ne jak dveře bez zámku.')

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
