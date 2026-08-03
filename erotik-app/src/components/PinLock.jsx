import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { verifyPin } from '../lib/pin.js';

export default function PinLock() {
  const { pinRecord, setUnlocked } = useApp();
  const [pin, setPin] = useState('');
  const [fehler, setFehler] = useState('');
  const [pruefe, setPruefe] = useState(false);

  async function absenden(event) {
    event.preventDefault();
    if (pruefe) return;
    setPruefe(true);
    setFehler('');
    const ok = await verifyPin(pin, pinRecord);
    if (ok) {
      setUnlocked(true);
    } else {
      setFehler('Falsche PIN.');
      setPin('');
      setPruefe(false);
    }
  }

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={absenden}>
        <h1 className="gate-logo">Zweisam</h1>
        <p className="gate-claim">Gesperrt</p>

        <input
          className="pin-input"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          placeholder="••••"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          aria-label="PIN"
        />

        {fehler && <p className="form-error">{fehler}</p>}

        <button type="submit" className="btn primary lg" disabled={!pin || pruefe}>
          {pruefe ? 'Prüfe …' : 'Entsperren'}
        </button>
        <p className="gate-fineprint">
          PIN vergessen? Dann hilft nur noch „Alle Daten löschen“ – über die
          Browser-Einstellungen dieser Seite.
        </p>
      </form>
    </div>
  );
}
