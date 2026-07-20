const ENCRYPTION_KEY_NAME = 'zimmaids-encryption-key'

async function getKeyMaterial(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return keyMaterial
}

async function getEncryptionKey(password: string): Promise<CryptoKey> {
  const keyMaterial = await getKeyMaterial(password)
  const salt = new TextEncoder().encode(ENCRYPTION_KEY_NAME)

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptField(plaintext: string, passphrase?: string): Promise<string> {
  const key = await getEncryptionKey(passphrase || getEncryptionPassphrase())
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = encoder.encode(plaintext)

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  )

  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)

  return btoa(String.fromCharCode(...combined))
}

export async function decryptField(ciphertext: string, passphrase?: string): Promise<string> {
  const key = await getEncryptionKey(passphrase || getEncryptionPassphrase())
  const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0))
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  )

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

function getEncryptionPassphrase(): string {
  const envKey = import.meta.env.VITE_ENCRYPTION_PASSPHRASE
  if (!envKey) {
    throw new Error(
      'VITE_ENCRYPTION_PASSPHRASE is not set. Add it to your .env.local file. ' +
      'Use a strong, random passphrase (32+ characters).'
    )
  }
  return envKey
}

export function isEncryptionAvailable(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined'
}
