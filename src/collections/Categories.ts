import type { CollectionConfig } from 'payload'
import { adminsAndEditors, anyone } from '@/access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Rubrika',
    plural: 'Rubriky',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'description'],
  },
  access: {
    create: adminsAndEditors,
    read: anyone,
    update: adminsAndEditors,
    delete: adminsAndEditors,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Název',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL slug',
      required: true,
      unique: true,
      admin: {
        description: 'Např. hudba, malba-grafika, literatura, divadlo-performance.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Popis rubriky',
    },
  ],
}
