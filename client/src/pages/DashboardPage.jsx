import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../hooks/useVault';
import VaultItem from '../components/VaultItem';
import ItemForm from '../components/ItemForm';
import Modal from '../components/Modal';

export default function DashboardPage() {
  const { email, lock, logout } = useAuth();
  const { items, loading, error, addItem, editItem, removeItem } = useVault();
  const [query, setQuery] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingItem, setEditingItem] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      [it.title, it.username, it.url].some((v) => (v || '').toLowerCase().includes(q))
    );
  }, [items, query]);

  function openAdd() {
    setEditingItem(null);
    setModalMode('add');
  }

  function openEdit(item) {
    setEditingItem(item);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingItem(null);
  }

  async function handleSave(data) {
    if (modalMode === 'edit' && editingItem) {
      await editItem(editingItem.id, data);
    } else {
      await addItem(data);
    }
    closeModal();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    await removeItem(id);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Vault</h1>
        <div className="dashboard-header-actions">
          <span className="dashboard-email">{email}</span>
          <button type="button" onClick={lock}>Lock</button>
          <button type="button" onClick={logout}>Sign out</button>
        </div>
      </header>

      <div className="dashboard-toolbar">
        <input
          type="search"
          placeholder="Search vault…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" onClick={openAdd}>+ Add item</button>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading ? (
        <p className="dashboard-empty">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="dashboard-empty">
          {items.length === 0 ? 'Your vault is empty. Add your first item to get started.' : 'No items match your search.'}
        </p>
      ) : (
        <div className="vault-list">
          {filtered.map((item) => (
            <VaultItem key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {modalMode && (
        <Modal title={modalMode === 'edit' ? 'Edit item' : 'Add item'} onClose={closeModal}>
          <ItemForm initial={editingItem} onSave={handleSave} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
