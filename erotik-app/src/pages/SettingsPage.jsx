import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { createPin } from '../lib/pin.js';

export default function SettingsPage() {
  const { pinRecord, savePin, favorites, toggleFavorite, reset } = useApp();
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [fehler, setFehler] = useState('');
  const [gespeichert, setGespeichert] = useState(false);
  const [loeschenAktiv, setLoeschenAktiv] = useState(false);

  async function pinSpeichern(event) {
    event.preventDefault();
    setFehler('');
    setGespeichert(false);
    if (pin.length < 4) {
      setFehler('Mindestens 4 Zeichen.');
      return;
    }
    if (pin !== pin2) {
      setFehler('Die beiden Eingaben stimmen nicht überein.');
      return;
    }
    savePin(await createPin(pin));
    setPin('');
    setPin2('');
    setGespeichert(true);
  }

  return (
    <div className="page">
      <section className="panel">
        <h2 className="panel-title">PIN-Sperre</h2>
        {pinRecord ? (
          <>
            <p className="muted small">
              Die App fragt beim Öffnen nach einer PIN.
            </p>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                savePin(null);
                setGespeichert(false);
              }}
            >
              PIN entfernen
            </button>
          </>
        ) : (
          <form onSubmit={pinSpeichern} className="pin-form">
            <p className="muted small">
              Optionaler Sichtschutz, falls jemand anderes das Gerät in die Hand
              nimmt.
            </p>
            <input
              className="text-input"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              placeholder="Neue PIN"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              aria-label="Neue PIN"
            />
            <input
              className="text-input"
              type="password"
              autoComplete="new-password"
              placeholder="Wiederholen"
              value={pin2}
              onChange={(event) => setPin2(event.target.value)}
              aria-label="PIN wiederholen"
            />
            {fehler && <p className="form-error">{fehler}</p>}
            <button type="submit" className="btn primary">
              PIN setzen
            </button>
          </form>
        )}
        {gespeichert && <p className="form-ok">Gespeichert.</p>}
        <p className="muted small">
          Die PIN wird nur als PBKDF2-Hash gespeichert, nicht im Klartext. Sie
          verschlüsselt die Daten aber nicht – wer das entsperrte Gerät hat,
          kommt technisch an den Browser-Speicher.
        </p>
      </section>

      <section className="panel">
        <h2 className="panel-title">Gemerkt ({favorites.length})</h2>
        {favorites.length === 0 ? (
          <p className="muted small">
            Noch nichts gemerkt. In den Karten und beim Würfeln kannst du
            Einträge mit ☆ sichern.
          </p>
        ) : (
          <ul className="fav-list editable">
            {favorites.map((text) => (
              <li key={text}>
                <span>{text}</span>
                <button
                  type="button"
                  className="btn ghost small"
                  onClick={() => toggleFavorite(text)}
                  aria-label="Entfernen"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <h2 className="panel-title">Daten</h2>
        <p className="muted small">
          Diese App speichert alles ausschließlich in diesem Browser. Es gibt kein
          Konto, keinen Server, keine Analyse und keine Weitergabe an Dritte.
        </p>
        {loeschenAktiv ? (
          <div className="confirm">
            <p>Wirklich alles löschen? Wunschliste, Merkliste und PIN sind dann weg.</p>
            <div className="confirm-row">
              <button type="button" className="btn danger" onClick={reset}>
                Ja, alles löschen
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setLoeschenAktiv(false)}
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn ghost"
            onClick={() => setLoeschenAktiv(true)}
          >
            Alle Daten löschen
          </button>
        )}
      </section>

      <section className="panel">
        <h2 className="panel-title">Wenn etwas nicht in Ordnung ist</h2>
        <p className="muted small">
          Diese App ist für Erwachsene, die freiwillig miteinander spielen. Wenn
          du dich unter Druck gesetzt fühlst oder Gewalt erlebst, gibt es
          kostenlose und vertrauliche Hilfe:
        </p>
        <ul className="help-list">
          <li>
            <strong>Hilfetelefon Gewalt gegen Frauen</strong> · 116 016 · rund um
            die Uhr
          </li>
          <li>
            <strong>Hilfetelefon Gewalt an Männern</strong> · 0800 123 99 00
          </li>
          <li>
            <strong>Hilfetelefon Sexueller Missbrauch</strong> · 0800 22 55 530
          </li>
          <li>
            <strong>pro familia</strong> · Beratung zu Sexualität und Partnerschaft
            vor Ort
          </li>
        </ul>
      </section>

      <p className="footnote">Zweisam · Version 0.1 · Alles bleibt auf diesem Gerät.</p>
    </div>
  );
}
