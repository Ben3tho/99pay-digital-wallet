export async function hashVaultPin(pin: string): Promise<string> {
  const input = `99pay:vault:v1:${pin}`;
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback FNV-1a + salted digest if SubtleCrypto is unavailable on non-HTTPS origins
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `fb-${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
}

export async function verifyVaultPin(pin: string, storedHash: string): Promise<boolean> {
  if (!storedHash) return false;
  const computed = await hashVaultPin(pin);
  return computed === storedHash;
}

const ENVELOPE_PREFIX = 'enc:v1:';

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const subtle = window.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto SubtleCrypto is required for AES-256-GCM encryption.');
  }
  const keyMaterial = await subtle.importKey(
    'raw',
    new TextEncoder().encode(`99pay:aes256:v1:${passphrase}`),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function isEncryptedEnvelope(value?: string | null): boolean {
  return typeof value === 'string' && value.startsWith(ENVELOPE_PREFIX);
}

export async function encryptWithPassphrase(
  plaintext: string,
  passphrase: string
): Promise<string> {
  if (!passphrase) {
    throw new Error('Encryption passphrase or Vault PIN is required.');
  }
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(passphrase, salt);
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    key,
    new TextEncoder().encode(plaintext)
  );
  const cipherBytes = new Uint8Array(cipherBuffer);
  return `${ENVELOPE_PREFIX}${toBase64(salt)}:${toBase64(iv)}:${toBase64(cipherBytes)}`;
}

export async function decryptWithPassphrase(
  envelope: string,
  passphrase: string
): Promise<string> {
  if (!isEncryptedEnvelope(envelope)) {
    return envelope;
  }
  const raw = envelope.slice(ENVELOPE_PREFIX.length);
  const parts = raw.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format.');
  }
  const salt = fromBase64(parts[0]);
  const iv = fromBase64(parts[1]);
  const cipherBytes = fromBase64(parts[2]);
  const key = await deriveAesKey(passphrase, salt);
  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(cipherBytes)
  );
  return new TextDecoder().decode(plainBuffer);
}

export interface SecurityScoreInput {
  hasVaultPin: boolean;
  isFlagSecureEnabled: boolean;
  isBiometricEnabled: boolean;
  autoLockSeconds: number;
  hasBiometricEnrolled?: boolean;
  hasCloudSync?: boolean;
}

export function computeSecurityScore(input: SecurityScoreInput): number {
  let score = 15; // Baseline local sandbox storage
  if (input.hasVaultPin) score += 35;
  if (input.isFlagSecureEnabled) score += 15;
  if (input.isBiometricEnabled) {
    score += input.hasBiometricEnrolled ? 15 : 5;
  }
  if (input.hasCloudSync) score += 5;
  if (input.autoLockSeconds > 0 && input.autoLockSeconds <= 60) {
    score += 15;
  } else if (input.autoLockSeconds > 60 && input.autoLockSeconds <= 120) {
    score += 10;
  } else if (input.autoLockSeconds > 120) {
    score += 5;
  }
  return Math.min(100, score);
}

export function getProfileInitials(fullName?: string): string {
  const clean = (fullName || '').trim();
  if (!clean) return '99';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getFirstName(fullName?: string): string {
  const clean = (fullName || '').trim();
  if (!clean) return '';
  return clean.split(/\s+/)[0] || '';
}
