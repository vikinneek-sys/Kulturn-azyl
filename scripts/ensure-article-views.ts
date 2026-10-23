import 'dotenv/config'
import config from '../src/payload.config'
import { sql } from '@payloadcms/db-postgres'
import { Pool } from 'pg'
import { getPayload } from 'payload'

const databaseURL = process.env.DATABASE_URL
if (!databaseURL) {
  throw new Error('Chybí proměnná DATABASE_URL.')
}

const tables = [
  'articles_blocks_paragraph',
  'articles_blocks_text_with_image',
  '_articles_v_blocks_paragraph',
  '_articles_v_blocks_text_with_image',
]
const pool = new Pool({ connectionString: databaseURL })

try {
  const { rows } = await pool.query(
    `SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = ANY($1::text[])
      AND column_name = 'text'
      AND data_type IN ('character varying', 'text')`,
    [tables],
  )

  for (const { table_name: tableName } of rows) {
    await pool.query(
      `ALTER TABLE public."${tableName}" ALTER COLUMN "text" TYPE jsonb USING to_jsonb("text")`,
    )
  }
} finally {
  await pool.end()
}

const payload = await getPayload({ config })

await payload.db.drizzle.execute(sql`
  ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "views" numeric DEFAULT 0 NOT NULL;
`)

await payload.db.destroy?.()