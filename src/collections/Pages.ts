import type { CollectionConfig } from 'payload'
import { adminsAndEditors, anyone } from '@/access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Stránka',
    plural: 'Stránky',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      label: 'Název stránky',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL slug',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Obsah stránky',
      required: true,
    },
  ],
}
