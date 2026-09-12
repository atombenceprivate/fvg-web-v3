import 'dotenv/config'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db, initialiseDatabase } from './db.js'

const app = express()
const secret = process.env.AUTH_SECRET || 'local-development-secret-change-before-production'
const demoMode = !process.env.TURSO_DATABASE_URL
const demoAdmin = { email: 'demo@firstvideos.group', password: 'FirstVideosDemo!2026' }
app.use(express.json())
const adminOnly = (req, res, next) => {
  try { req.admin = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), secret); next() }
  catch { res.status(401).json({ error: 'Unauthorized' }) }
}
const hasAdmin = async () => Boolean((await db.execute('SELECT id FROM admins LIMIT 1')).rows.length)

app.get('/api/auth/status', async (_req,res) => res.json({ setupRequired: !(await hasAdmin()), demoMode }))
app.post('/api/auth/setup', async (req,res) => {
  if (await hasAdmin()) return res.status(409).json({ error: 'Setup has already been completed.' })
  const { email, password } = req.body
  if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password || password.length < 12) return res.status(400).json({ error: 'Use a valid email address and a password with at least 12 characters.' })
  await db.execute({ sql:'INSERT INTO admins (email, password_hash, role) VALUES (?, ?, ?)', args:[email.toLowerCase(), await bcrypt.hash(password, 12), 'superadmin'] })
  res.status(201).json({ ok:true })
})
app.post('/api/auth/login', async (req,res) => {
  const { email, password } = req.body
  const result = await db.execute({ sql:'SELECT id, email, password_hash, role FROM admins WHERE email = ?', args:[String(email || '').toLowerCase()] })
  const admin = result.rows[0]
  if (!admin || !(await bcrypt.compare(password || '', admin.password_hash))) return res.status(401).json({ error: 'Incorrect email address or password.' })
  res.json({ token: jwt.sign({ id:admin.id, email:admin.email, role:admin.role }, secret, { expiresIn:'8h' }), admin:{ email:admin.email, role:admin.role } })
})
app.get('/api/projects', adminOnly, async (_req,res) => res.json((await db.execute('SELECT * FROM projects ORDER BY sort_order, id')).rows))
app.put('/api/projects/:id', adminOnly, async (req,res) => { const { title_hu, title_en, category }=req.body; await db.execute({sql:'UPDATE projects SET title_hu=?, title_en=?, category=? WHERE id=?', args:[title_hu,title_en,category,req.params.id]}); res.json({ok:true}) })

async function start() {
  await initialiseDatabase()
  // A predictable demo account is created only for the local database and never for Turso.
  if (demoMode && !(await hasAdmin())) await db.execute({ sql:'INSERT INTO admins (email, password_hash, role) VALUES (?, ?, ?)', args:[demoAdmin.email, await bcrypt.hash(demoAdmin.password, 12), 'superadmin'] })
  app.listen(8787, '127.0.0.1', ()=>console.log('Admin API running on http://127.0.0.1:8787'))
}
start()
