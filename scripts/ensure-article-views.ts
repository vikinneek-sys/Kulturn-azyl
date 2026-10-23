import 'dotenv/config'
import { Pool } from 'pg'

const databaseURL =
  process.env.PAYLOAD_MIGRATING === 'true'
    ? process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
    : process.env.DATABASE_URL
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

  await pool.query(
    'ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "views" numeric DEFAULT 0 NOT NULL',
  )
} finally {
  await pool.end()
}
