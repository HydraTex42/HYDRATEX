import { useState } from 'react';
import PasswordGenerator from './PasswordGenerator';

const EMPTY = { title: '', username: '', password: '', url: '', notes: '' };

export default function ItemForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: form.title.trim(),
        username: form.username.trim(),
        password: form.password,
        url: form.url.trim(),
        notes: form.notes,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input id="title" required value={form.title} onChange={(e) => update('title', e.target.value)} autoFocus />

      <label htmlFor="username">Username / email</label>
      <input id="username" value={form.username} onChange={(e) => update('username', e.target.value)} />

      <label htmlFor="password">Password</label>
      <div className="password-field">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
        />
        <button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
        <button type="button" onClick={() => setShowGenerator((v) => !v)}>Generate</button>
      </div>

      {showGenerator && (
        <PasswordGenerator
          onUse={(pwd) => {
            update('password', pwd);
            setShowGenerator(false);
            setShowPassword(true);
          }}
        />
      )}

      <label htmlFor="url">Website</label>
      <input id="url" type="text" placeholder="https://example.com" value={form.url} onChange={(e) => update('url', e.target.value)} />

      <label htmlFor="notes">Notes</label>
      <textarea id="notes" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} />

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}
