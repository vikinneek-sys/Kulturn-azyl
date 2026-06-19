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
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        format: '',
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
        direction: 'ltr',
      },
    ],
    direction: 'ltr',
  },
})

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

  const existingArticles = await payload.find({
    collection: 'articles',
    limit: 1,
    overrideAccess: true,
  })

  if (existingArticles.totalDocs === 0) {
    await payload.create({
      collection: 'articles',
      overrideAccess: true,
      data: {
        title: 'Kulturní azyl otevírá dveře',
        slug: 'kulturni-azyl-otevira-dvere',
        excerpt:
          'Nový prostor pro hudbu, obraz, literaturu a živou kulturu. Žádná sterilní vitrína, spíš sklep s dobrým světlem.',
        category: createdCategories[0].id,
        author: admin.id,
        status: 'published',
        featured: true,
        publishedAt: new Date().toISOString(),
        content: richText(
          'Tohle je ukázkový článek. V administraci ho můžeš upravit, smazat, nebo použít jako test toho, že redakční systém funguje. Redaktor píše, editor schvaluje, kultura přežívá.'
        ),
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
