import type { CollectionConfig } from 'payload'
import { adminsAndEditors, adminsEditorsOrAuthor, authenticated, anyone, isAdminOrEditorUser } from '@/access'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Článek',
    plural: 'Články',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'status', 'publishedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    create: authenticated,
    read: ({ req: { user } }) => {
      // Veřejnost vidí jen publikované články. Přihlášení lidé vidí obsah v adminu.
      if (user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
    update: adminsEditorsOrAuthor,
    delete: adminsAndEditors,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        const user = req.user as any

        if (operation === 'create' && user && !isAdminOrEditorUser(user)) {
          data.author = user.id
        }

        if (operation === 'create' && user && !data.author) {
          data.author = user.id
        }

        // Redaktor nesmi publikovat sam sebe. Kdyz se pokusi dat published,
        // system to prehodi na review. Editor/Admin teprve publikuje.
        if (user && !isAdminOrEditorUser(user) && data.status === 'published') {
          data.status = 'review'
        }

        if (data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titulek',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL slug',
      required: true,
      unique: true,
      admin: {
        description: 'Bez diakritiky, malá písmena, pomlčky. Např. rozhovor-s-kapelou.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Perex',
      required: true,
      maxLength: 280,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hlavní obrázek',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Rubrika',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Autor',
      required: true,
      admin: {
        position: 'sidebar',
      },
      access: {
        update: adminsAndEditors,
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Stav článku',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Koncept', value: 'draft' },
        { label: 'Ke schválení', value: 'review' },
        { label: 'Publikováno', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Redaktor může poslat ke schválení. Publikuje editor/admin.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Zvýraznit na úvodu',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Datum publikace',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Štítky',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Štítek',
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Text článku',
      required: true,
    },
  ],
}
