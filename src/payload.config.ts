import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURL =
  process.env.PAYLOAD_MIGRATING === 'true'
    ? process.env.DATABASE_URL_UNPOOLED
    : process.env.DATABASE_URL

if (!databaseURL) {
  throw new Error(
    process.env.PAYLOAD_MIGRATING === 'true'
      ? 'Chybí proměnná DATABASE_URL_UNPOOLED.'
      : 'Chybí proměnná DATABASE_URL.',
  )
}

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('Chybí proměnná PAYLOAD_SECRET.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Kulturní azyl',
    },
  },

  collections: [Users, Media, Categories, Articles, Pages],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
  }),

  sharp,
})