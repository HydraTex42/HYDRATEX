import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { decryptJSON, encryptJSON } from '../lib/crypto';
import { useAuth } from '../context/AuthContext';

export function useVault() {
  const { token, vaultKey } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!token || !vaultKey) return;
    setLoading(true);
    setError(null);
    try {
      const { items: rawItems } = await api.listItems(token);
      const decrypted = await Promise.all(
        rawItems.map(async (raw) => {
          try {
            const data = await decryptJSON(vaultKey, raw.ciphertext, raw.iv);
            return { id: raw.id, updatedAt: raw.updatedAt, ...data };
          } catch {
            return { id: raw.id, updatedAt: raw.updatedAt, title: '(unable to decrypt)', corrupted: true };
          }
        })
      );
      decrypted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      setItems(decrypted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, vaultKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (data) => {
    const { ciphertext, iv } = await encryptJSON(vaultKey, data);
    const { item } = await api.createItem(token, { ciphertext, iv });
    setItems((prev) => [...prev, { id: item.id, updatedAt: item.updatedAt, ...data }].sort((a, b) => (a.title || '').localeCompare(b.title || '')));
  }, [token, vaultKey]);

  const editItem = useCallback(async (id, data) => {
    const { ciphertext, iv } = await encryptJSON(vaultKey, data);
    const { item } = await api.updateItem(token, id, { ciphertext, iv });
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { id, updatedAt: item.updatedAt, ...data } : it))
        .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    );
  }, [token, vaultKey]);

  const removeItem = useCallback(async (id) => {
    await api.deleteItem(token, id);
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, [token]);

  return { items, loading, error, refresh, addItem, editItem, removeItem };
}
