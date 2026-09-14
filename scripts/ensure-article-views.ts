import 'dotenv/config'
import config from '../src/payload.config'
import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

await payload.db.drizzle.execute(sql`
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "views" numeric DEFAULT 0 NOT NULL;
`)

await payload.db.destroy?.()