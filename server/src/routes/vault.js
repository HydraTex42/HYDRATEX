import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/init.js';
import { requireAuth } from '../middleware/auth.js';

export const vaultRouter = Router();
vaultRouter.use(requireAuth);

const MAX_BLOB_LEN = 65536;

function isNonEmptyString(value, maxLen = MAX_BLOB_LEN) {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLen;
}

function serialize(item) {
  return {
    id: item.id,
    ciphertext: item.ciphertext,
    iv: item.iv,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

// Every item is an opaque AES-GCM ciphertext blob encrypted client-side with
// the user's vault key. The server cannot read titles, usernames, passwords,
// URLs or notes — it only stores and returns bytes.
vaultRouter.get('/', (req, res) => {
  const items = db.prepare(
    'SELECT * FROM vault_items WHERE user_id = ? ORDER BY updated_at DESC'
  ).all(req.userId);
  return res.json({ items: items.map(serialize) });
});

vaultRouter.post('/', (req, res) => {
  const { ciphertext, iv } = req.body || {};
  if (!isNonEmptyString(ciphertext) || !isNonEmptyString(iv, 256)) {
    return res.status(400).json({ error: 'Missing or invalid ciphertext/iv' });
  }

  const id = uuidv4();
  db.prepare(`
    INSERT INTO vault_items (id, user_id, ciphertext, iv)
    VALUES (?, ?, ?, ?)
  `).run(id, req.userId, ciphertext, iv);

  const item = db.prepare('SELECT * FROM vault_items WHERE id = ?').get(id);
  return res.status(201).json({ item: serialize(item) });
});

vaultRouter.put('/:id', (req, res) => {
  const { ciphertext, iv } = req.body || {};
  if (!isNonEmptyString(ciphertext) || !isNonEmptyString(iv, 256)) {
    return res.status(400).json({ error: 'Missing or invalid ciphertext/iv' });
  }

  const existing = db.prepare(
    'SELECT id FROM vault_items WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.userId);
  if (!existing) {
    return res.status(404).json({ error: 'Item not found' });
  }

  db.prepare(`
    UPDATE vault_items SET ciphertext = ?, iv = ?, updated_at = datetime('now')
    WHERE id = ? AND user_id = ?
  `).run(ciphertext, iv, req.params.id, req.userId);

  const item = db.prepare('SELECT * FROM vault_items WHERE id = ?').get(req.params.id);
  return res.json({ item: serialize(item) });
});

vaultRouter.delete('/:id', (req, res) => {
  const result = db.prepare(
    'DELETE FROM vault_items WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }
  return res.status(204).send();
});
