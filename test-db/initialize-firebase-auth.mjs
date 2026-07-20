import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(here, '..', 'firebase', 'functions', 'package.json'))
const { GoogleAuth } = require('google-auth-library')
const key = JSON.parse(readFileSync(join(here, '..', '.secrets', 'trace-qa-prod-firebase-adminsdk-fbsvc-fce13fabc2.json'), 'utf8'))
const googleAuth = new GoogleAuth({
  credentials: key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
})
const client = await googleAuth.getClient()
const token = await client.getAccessToken()
const headers = { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
const base = 'https://identitytoolkit.googleapis.com'
const initialize = await fetch(`${base}/v2/projects/${key.project_id}/identityPlatform:initializeAuth`, {
  method: 'POST',
  headers,
  body: '{}',
})
if (!initialize.ok && initialize.status !== 409) {
  throw new Error(`Authentication initialization failed (${initialize.status}): ${await initialize.text()}`)
}
const configure = await fetch(
  `${base}/admin/v2/projects/${key.project_id}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired`,
  {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ signIn: { email: { enabled: true, passwordRequired: true } } }),
  },
)
if (!configure.ok) {
  throw new Error(`Email/password configuration failed (${configure.status}): ${await configure.text()}`)
}
console.log('✓ Firebase Authentication initialized')
console.log('✓ Email/password sign-in enabled')
