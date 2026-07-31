import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UnlockPage() {
  const { email, unlock, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await unlock(password);
    } catch {
      setError('Invalid master password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Vault locked</h1>
        <p className="auth-subtitle">Signed in as {email}. Enter your master password to unlock.</p>

        <label htmlFor="password">Master password</label>
        <input
          id="password"
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Unlocking…' : 'Unlock'}
        </button>

        <p className="auth-footer">
          Wrong account? <button type="button" className="link-button" onClick={logout}>Sign out</button>
        </p>
      </form>
    </div>
  );
}
