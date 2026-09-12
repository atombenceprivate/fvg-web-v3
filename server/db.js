import { createClient } from '@libsql/client'
import { mkdirSync } from 'node:fs'

// Uses Turso in deployed environments; a local libSQL-compatible file during development.
if (!process.env.TURSO_DATABASE_URL) mkdirSync('./data', { recursive: true })
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || process.env.LOCAL_DATABASE_URL || 'file:./data/fvg.db',
  authToken: process.env.TURSO_AUTH_TOKEN
})

export async function initialiseDatabase() {
  await db.batch([
    'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, title_hu TEXT, title_en TEXT, category TEXT, image_url TEXT, sort_order INTEGER)',
    'CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT \'admin\', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)',
    'CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)'
  ])
}
