import type { CollectionConfig } from 'payload'
import { admins, authenticated, isAdmin } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Uživatel',
    plural: 'Uživatelé',
  },
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
  },
  access: {
    admin: authenticated,
    create: admins,
    read: authenticated,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (isAdmin(user as any)) return true
      return user.id === id
    },
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Jméno',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      required: true,
      defaultValue: 'redaktor',
      options: [
        { label: 'Administrátor', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Redaktor', value: 'redaktor' },
      ],
      access: {
        create: admins,
        update: admins,
      },
      admin: {
        description: 'Admin = technická správa, Editor = schvaluje, Redaktor = píše vlastní texty.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Krátké bio',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotka / avatar',
    },
  ],
}
