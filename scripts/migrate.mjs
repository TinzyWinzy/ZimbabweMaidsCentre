import { readFile } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8')
const sql = neon(process.env.DATABASE_URL)

const commands = schema
  .split(/\r?\n\r?\n+/)
  .map((command) => command.trim())
  .filter(Boolean)

for (const command of commands) {
  await sql.query(command)
}
console.log('Neon schema applied successfully')
