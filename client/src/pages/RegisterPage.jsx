import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { passwordStrength } from '../lib/crypto';

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Okay', 'Strong', 'Very strong'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const strength = passwordStrength(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 12) {
      setError('Master password must be at least 12 characters — it protects everything else.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your vault</h1>
        <p className="auth-subtitle">
          Your master password never leaves this device. If you forget it, your vault cannot be recovered.
        </p>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

        <label htmlFor="password">Master password</label>
        <input
          id="password"
          type="password"
          required
          minLength={12}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {password && (
          <div className={`strength-meter strength-${strength}`}>
            <div className="strength-bar" />
            <span>{STRENGTH_LABELS[strength]}</span>
          </div>
        )}

        <label htmlFor="confirm">Confirm master password</label>
        <input
          id="confirm"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating vault…' : 'Create vault'}
        </button>

        <p className="auth-footer">
          Already have a vault? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
