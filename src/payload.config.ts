import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

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

const storagePlugins = process.env.BLOB_READ_WRITE_TOKEN
  ? [
      vercelBlobStorage({
        collections: {
          media: true,
        },
        token: process.env.BLOB_READ_WRITE_TOKEN,
        clientUploads: true,
      }),
    ]
  : process.env.S3_BUCKET
    ? [
        s3Storage({
          collections: {
            media: true,
          },
          bucket: process.env.S3_BUCKET,
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || 'auto',
            forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
          },
        }),
      ]
    : []

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

  plugins: storagePlugins,

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