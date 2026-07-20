import { readFile } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8')
const sql = neon(process.env.DATABASE_URL)

function splitStatements(source) {
  const statements = []
  let current = ''
  let dollarTag = null
  let singleQuoted = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    current += char

    if (!dollarTag && char === "'" && source[index - 1] !== '\\') {
      if (singleQuoted && source[index + 1] === "'") {
        current += source[index + 1]
        index += 1
      } else {
        singleQuoted = !singleQuoted
      }
      continue
    }

    if (!singleQuoted && char === '$') {
      const tag = source.slice(index).match(/^\$[A-Za-z0-9_]*\$/)?.[0]
      if (tag) {
        if (!dollarTag) dollarTag = tag
        else if (tag === dollarTag) dollarTag = null
        if (tag.length > 1) {
          current += tag.slice(1)
          index += tag.length - 1
        }
        continue
      }
    }

    if (char === ';' && !singleQuoted && !dollarTag) {
      if (current.trim()) statements.push(current.trim())
      current = ''
    }
  }

  if (current.trim()) statements.push(current.trim())
  return statements
}

for (const statement of splitStatements(schema)) {
  await sql.query(statement)
}
console.log('Neon schema applied successfully')
