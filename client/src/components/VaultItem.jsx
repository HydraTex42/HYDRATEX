import { useState } from 'react';

const CLIPBOARD_CLEAR_MS = 20000;

async function copyWithAutoClear(text, setStatus) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus('Copied — clears in 20s');
    setTimeout(async () => {
      try {
        const current = await navigator.clipboard.readText();
        if (current === text) await navigator.clipboard.writeText('');
      } catch {
        // Clipboard read may be denied by the browser; nothing more we can do.
      }
    }, CLIPBOARD_CLEAR_MS);
    setTimeout(() => setStatus(null), CLIPBOARD_CLEAR_MS);
  } catch {
    setStatus('Copy failed');
    setTimeout(() => setStatus(null), 2000);
  }
}

export default function VaultItem({ item, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);

  return (
    <div className="vault-item">
      <button type="button" className="vault-item-header" onClick={() => setExpanded((v) => !v)}>
        <div className="vault-item-title">
          <strong>{item.title || '(untitled)'}</strong>
          <span className="vault-item-username">{item.username}</span>
        </div>
        <span className={`chevron ${expanded ? 'open' : ''}`}>▾</span>
      </button>

      {expanded && (
        <div className="vault-item-body">
          {item.corrupted ? (
            <p className="form-error">This item could not be decrypted with the current vault key.</p>
          ) : (
            <>
              <div className="field-row">
                <span className="field-label">Username</span>
                <span className="field-value">{item.username || '—'}</span>
                {item.username && (
                  <button type="button" onClick={() => copyWithAutoClear(item.username, setStatus)}>Copy</button>
                )}
              </div>

              <div className="field-row">
                <span className="field-label">Password</span>
                <span className="field-value">{showPassword ? item.password : '••••••••••••'}</span>
                <button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
                <button type="button" onClick={() => copyWithAutoClear(item.password, setStatus)}>Copy</button>
              </div>

              {item.url && (
                <div className="field-row">
                  <span className="field-label">Website</span>
                  <a className="field-value" href={item.url} target="_blank" rel="noreferrer noopener">{item.url}</a>
                </div>
              )}

              {item.notes && (
                <div className="field-row notes">
                  <span className="field-label">Notes</span>
                  <span className="field-value">{item.notes}</span>
                </div>
              )}

              {status && <div className="clipboard-status">{status}</div>}
            </>
          )}

          <div className="form-actions">
            <button type="button" className="secondary" onClick={() => onDelete(item.id)}>Delete</button>
            <button type="button" onClick={() => onEdit(item)}>Edit</button>
          </div>
        </div>
      )}
    </div>
  );
}
