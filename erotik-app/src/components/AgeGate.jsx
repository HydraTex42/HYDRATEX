import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function AgeGate() {
  const { setAgeOk } = useApp();
  const [abgelehnt, setAbgelehnt] = useState(false);

  if (abgelehnt) {
    return (
      <div className="gate">
        <div className="gate-card">
          <h1 className="gate-logo">Zweisam</h1>
          <p className="gate-text">
            Diese App richtet sich ausschließlich an Erwachsene. Du kannst dieses
            Fenster jetzt schließen.
          </p>
          <button type="button" className="btn ghost" onClick={() => setAbgelehnt(false)}>
            Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gate">
      <div className="gate-card">
        <h1 className="gate-logo">Zweisam</h1>
        <p className="gate-claim">Spiele, Fragen und Ideen für Paare.</p>

        <div className="gate-notice">
          <p>
            Diese App enthält Inhalte für Erwachsene. Sie ist für Menschen ab 18
            Jahren gedacht, die einvernehmlich miteinander spielen.
          </p>
          <p>
            Alles bleibt auf diesem Gerät – es gibt kein Konto, keinen Server und
            keine Übertragung deiner Antworten.
          </p>
        </div>

        <button type="button" className="btn primary lg" onClick={() => setAgeOk(true)}>
          Ich bin 18 Jahre oder älter
        </button>
        <button type="button" className="btn ghost" onClick={() => setAbgelehnt(true)}>
          Ich bin jünger
        </button>
      </div>
    </div>
  );
}
