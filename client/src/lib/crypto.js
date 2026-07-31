// Zero-knowledge crypto layer.
//
// Nothing derived here except `salt`, `authHash` and the wrapped
// (encrypted) vault key ever leaves the browser. The master password and
// the raw vault key that protects every stored item never reach the server.
//
// Key hierarchy:
//   masterPassword + email-derived salt --PBKDF2--> masterKey
//   masterKey + masterPassword          --PBKDF2--> authHash (sent to server for login only)
//   random vaultKey (AES-256)           --wrapped with masterKey (AES-GCM)--> encVaultKey (sent to server)
//   vault items                         --encrypted with vaultKey (AES-GCM)--> ciphertext (sent to server)

const PBKDF2_ITERATIONS = 210_000;
const enc = new TextEncoder();
const dec = new TextDecoder();

function toBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function randomBytes(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}

export function generateSalt() {
  return toBase64(randomBytes(16));
}

async function importPasswordKey(password) {
  return crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits', 'deriveKey']);
}

// Derives the master key from the master password + a per-account salt.
// This key never leaves the browser; it only ever wraps/unwraps the vault key.
export async function deriveMasterKey(password, saltB64) {
  const passwordKey = await importPasswordKey(password);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: fromBase64(saltB64),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['wrapKey', 'unwrapKey', 'encrypt', 'decrypt']
  );
}

// Derives a value from the master key that is safe to send to the server for
// authentication: the server can verify it without learning the master
// password or being able to derive the master/vault key from it.
export async function deriveAuthHash(masterKey, password) {
  const rawMasterKey = await crypto.subtle.exportKey('raw', masterKey);
  const material = await crypto.subtle.importKey('raw', rawMasterKey, 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(password),
      iterations: 1,
      hash: 'SHA-256',
    },
    material,
    256
  );
  return toBase64(new Uint8Array(bits));
}

export async function generateVaultKey() {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}

export async function wrapVaultKey(vaultKey, masterKey) {
  const iv = randomBytes(12);
  const wrapped = await crypto.subtle.wrapKey('raw', vaultKey, masterKey, { name: 'AES-GCM', iv });
  return { encVaultKey: toBase64(new Uint8Array(wrapped)), encVaultKeyIv: toBase64(iv) };
}

export async function unwrapVaultKey(encVaultKeyB64, encVaultKeyIvB64, masterKey) {
  const wrapped = fromBase64(encVaultKeyB64);
  const iv = fromBase64(encVaultKeyIvB64);
  return crypto.subtle.unwrapKey(
    'raw',
    wrapped,
    masterKey,
    { name: 'AES-GCM', iv },
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptJSON(vaultKey, data) {
  const iv = randomBytes(12);
  const plaintext = enc.encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, vaultKey, plaintext);
  return { ciphertext: toBase64(new Uint8Array(ciphertext)), iv: toBase64(iv) };
}

export async function decryptJSON(vaultKey, ciphertextB64, ivB64) {
  const ciphertext = fromBase64(ciphertextB64);
  const iv = fromBase64(ivB64);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, vaultKey, ciphertext);
  return JSON.parse(dec.decode(plaintext));
}

const PASSWORD_CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export function generatePassword({ length = 20, lower = true, upper = true, digits = true, symbols = true } = {}) {
  const pools = [];
  if (lower) pools.push(PASSWORD_CHARSETS.lower);
  if (upper) pools.push(PASSWORD_CHARSETS.upper);
  if (digits) pools.push(PASSWORD_CHARSETS.digits);
  if (symbols) pools.push(PASSWORD_CHARSETS.symbols);
  if (pools.length === 0) pools.push(PASSWORD_CHARSETS.lower);

  const alphabet = pools.join('');
  const values = crypto.getRandomValues(new Uint32Array(length));
  const chars = Array.from(values, (v) => alphabet[v % alphabet.length]);

  // Guarantee at least one character from each selected pool.
  pools.forEach((pool, i) => {
    if (i < chars.length) {
      const idx = crypto.getRandomValues(new Uint32Array(1))[0] % pool.length;
      chars[i] = pool[idx];
    }
  });

  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

export function passwordStrength(password) {
  if (!password) return 0;
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
  const entropy = password.length * Math.log2(pool || 1);
  if (entropy < 40) return 1;
  if (entropy < 60) return 2;
  if (entropy < 80) return 3;
  return 4;
}
