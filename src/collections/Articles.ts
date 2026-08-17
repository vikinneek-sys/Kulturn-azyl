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
  // Redakční workflow řeší vlastní pole `status` (draft/review/published).
  // Payload drafts by přidaly druhé pole `_status` a kolidující Postgres enum.
  versions: true,
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

        // Automaticky generuj slug z titulku
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // odstran diakritiku
            .replace(/[^a-z0-9]+/g, '-') // nahrad znaky pomlckou
            .replace(/^-+|-+$/g, '') // odstran pocatecni a koncove pomilcky
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
      label: 'Štítky / Žánry',
      fields: [
        {
          name: 'tag',
          type: 'select',
          label: 'Žánr',
          options: [
            { label: 'Rock', value: 'rock' },
            { label: 'Pop', value: 'pop' },
            { label: 'Metal', value: 'metal' },
            { label: 'Folk', value: 'folk' },
            { label: 'Jazz', value: 'jazz' },
            { label: 'Blues', value: 'blues' },
            { label: 'Rap', value: 'rap' },
            { label: 'Hip-hop', value: 'hiphop' },
            { label: 'Reggae', value: 'reggae' },
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'Obsah články',
      required: true,
      blocks: [
        {
          slug: 'heading',
          labels: {
            singular: 'Podnadpis',
            plural: 'Podnadpisy',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Nadpis',
              required: true,
            },
            {
              name: 'level',
              type: 'select',
              label: 'Úroveň',
              defaultValue: 'h2',
              options: [
                { label: 'Nadpis 2', value: 'h2' },
                { label: 'Nadpis 3', value: 'h3' },
              ],
            },
          ],
        },
        {
          slug: 'paragraph',
          labels: {
            singular: 'Odstavec',
            plural: 'Odstavce',
          },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              label: 'Text',
              required: true,
            },
          ],
        },
        {
          slug: 'image',
          labels: {
            singular: 'Obrázek',
            plural: 'Obrázky',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Obrázek',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
              label: 'Popis',
            },
            {
              name: 'width',
              type: 'select',
              label: 'Šírka',
              defaultValue: 'full',
              options: [
                { label: 'Plná šírka', value: 'full' },
                { label: 'Normální', value: 'normal' },
                { label: 'Malá', value: 'small' },
              ],
            },
          ],
        },
        {
          slug: 'textWithImage',
          labels: {
            singular: 'Text s obrázkem',
            plural: 'Texty s obrázky',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Obrázek',
              required: true,
            },
            {
              name: 'text',
              type: 'textarea',
              label: 'Text (bude obtékat obrázek)',
              required: true,
            },
            {
              name: 'imagePosition',
              type: 'select',
              label: 'Pozice obrázku',
              defaultValue: 'left',
              options: [
                { label: 'Vlevo', value: 'left' },
                { label: 'Vpravo', value: 'right' },
              ],
            },
            {
              name: 'imageWidth',
              type: 'select',
              label: 'Šírka obrázku',
              defaultValue: 'medium',
              options: [
                { label: 'Malá (30%)', value: 'small' },
                { label: 'Střední (40%)', value: 'medium' },
                { label: 'Velká (50%)', value: 'large' },
              ],
            },
          ],
        },
        {
          slug: 'gallery',
          labels: {
            singular: 'Galerie fotografií',
            plural: 'Galerie fotografií',
          },
          fields: [
            {
              name: 'images',
              type: 'array',
              label: 'Fotografie',
              required: true,
              minRows: 2,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Fotografie',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Popis fotografie',
                },
              ],
            },
            {
              name: 'autoplay',
              type: 'checkbox',
              label: 'Automaticky se posouvat',
              defaultValue: true,
            },
            {
              name: 'autoplaySpeed',
              type: 'number',
              label: 'Rychlost (sekundy)',
              defaultValue: 5,
            },
          ],
        },
      ],
    },
  ],
}
