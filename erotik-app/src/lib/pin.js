// Die PIN wird nie im Klartext gespeichert, sondern nur als PBKDF2-Hash.
// Das ist ein Sichtschutz gegen neugierige Blicke – keine Verschlüsselung
// der Daten selbst. Wer Zugriff auf das entsperrte Gerät hat, kommt an den
// localStorage. Das steht so auch in den Einstellungen.

const ITERATIONS = 150_000;

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function derive(pin, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(bits);
}

export async function createPin(pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(pin, salt);
  return { salt: toHex(salt), hash };
}

export async function verifyPin(pin, record) {
  if (!record?.salt || !record?.hash) return false;
  const hash = await derive(pin, fromHex(record.salt));
  // Konstante Laufzeit ist hier nicht kritisch, schadet aber nicht.
  if (hash.length !== record.hash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i += 1) {
    diff |= hash.charCodeAt(i) ^ record.hash.charCodeAt(i);
  }
  return diff === 0;
}
