import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/init.js';
import { signToken } from '../utils/token.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LEN = 4096;

function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email);
}

function isNonEmptyString(value, maxLen = MAX_FIELD_LEN) {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLen;
}

function publicUser(user) {
  return {
    email: user.email,
    salt: user.salt,
    encVaultKey: user.enc_vault_key,
    encVaultKeyIv: user.enc_vault_key_iv,
  };
}

// Registration takes place entirely in terms of values the client has already
// derived from the master password. The server never sees the master
// password itself, nor the vault encryption key in plaintext.
authRouter.post('/register', async (req, res) => {
  const { email, salt, authHash, encVaultKey, encVaultKeyIv } = req.body || {};

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  if (!isNonEmptyString(salt) || !isNonEmptyString(authHash) ||
      !isNonEmptyString(encVaultKey) || !isNonEmptyString(encVaultKeyIv)) {
    return res.status(400).json({ error: 'Missing or invalid cryptographic parameters' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const authHashHash = await bcrypt.hash(authHash, 12);
  const id = uuidv4();

  db.prepare(`
    INSERT INTO users (id, email, salt, auth_hash, enc_vault_key, enc_vault_key_iv)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, normalizedEmail, salt, authHashHash, encVaultKey, encVaultKeyIv);

  const token = signToken(id);
  return res.status(201).json({
    token,
    user: publicUser({ email: normalizedEmail, salt, enc_vault_key: encVaultKey, enc_vault_key_iv: encVaultKeyIv }),
  });
});

// Step 1 of login: the client needs the salt (and current wrapped vault key)
// before it can derive the master key and compute the auth hash locally.
authRouter.get('/salt', (req, res) => {
  const email = typeof req.query.email === 'string' ? req.query.email.trim().toLowerCase() : '';
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const user = db.prepare('SELECT salt FROM users WHERE email = ?').get(email);
  if (!user) {
    // Return a deterministic-looking but useless salt shape to reduce
    // trivial account enumeration via response shape/timing.
    return res.status(404).json({ error: 'No account found for this email' });
  }

  return res.json({ salt: user.salt });
});

authRouter.post('/login', async (req, res) => {
  const { email, authHash } = req.body || {};

  if (!isValidEmail(email) || !isNonEmptyString(authHash)) {
    return res.status(400).json({ error: 'Missing or invalid credentials' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or master password' });
  }

  const ok = await bcrypt.compare(authHash, user.auth_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or master password' });
  }

  const token = signToken(user.id);
  return res.json({ token, user: publicUser(user) });
});

authRouter.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user: publicUser(user) });
});
