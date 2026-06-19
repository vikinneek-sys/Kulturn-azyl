import type { CollectionConfig } from 'payload'
import { authenticated, anyone } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Médium',
    plural: 'Média',
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'hero', width: 1400, height: 800, position: 'centre' },
    ],
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alternativní popis obrázku',
      required: true,
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Autor fotografie / kredit',
    },
  ],
}
