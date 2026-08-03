import { useMemo, useState } from 'react';
import { ANSWERS, TOTAL_ITEMS, WISHLIST } from '../data/wishlist.js';
import { usePersistentState } from '../hooks/usePersistentState.js';
import { KEYS } from '../lib/storage.js';

const LEER = { names: { a: 'Partner A', b: 'Partner B' }, answers: { a: {}, b: {} } };

/**
 * Zeigt ausschließlich Punkte, zu denen beide mindestens "Vielleicht" gesagt
 * haben. Ein "Nein" taucht im Abgleich nie auf – weder als Punkt noch als
 * Andeutung. Das ist der ganze Sinn der Übung.
 */
function abgleichen(answers) {
  const treffer = [];
  WISHLIST.forEach((kategorie) => {
    kategorie.items.forEach((item) => {
      const a = answers.a[item.id];
      const b = answers.b[item.id];
      if (!a || !b) return;
      if (a === 'nein' || b === 'nein') return;
      const stufe = a === 'ja' && b === 'ja' ? 'beide-ja' : 'offen';
      treffer.push({ ...item, kategorie: kategorie.name, stufe });
    });
  });
  return treffer;
}

export default function WishlistPage() {
  const [daten, setDaten] = usePersistentState(KEYS.wishlist, LEER);
  const [ansicht, setAnsicht] = useState('start'); // start | a | b | abgleich

  const setAntwort = (person, itemId, wert) => {
    setDaten((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [person]: { ...prev.answers[person], [itemId]: wert },
      },
    }));
  };

  const setName = (person, name) => {
    setDaten((prev) => ({ ...prev, names: { ...prev.names, [person]: name } }));
  };

  const fortschritt = {
    a: Object.keys(daten.answers.a).length,
    b: Object.keys(daten.answers.b).length,
  };

  const treffer = useMemo(() => abgleichen(daten.answers), [daten.answers]);
  const beideFertig = fortschritt.a > 0 && fortschritt.b > 0;

  if (ansicht === 'start') {
    return (
      <div className="page">
        <section className="panel">
          <h2 className="panel-title">So funktioniert es</h2>
          <ol className="steps">
            <li>Eine/r füllt die Liste aus und gibt das Gerät dann weiter.</li>
            <li>Die/der andere füllt sie aus, ohne die erste Antwort zu sehen.</li>
            <li>
              Der Abgleich zeigt nur, wozu <strong>beide</strong> Lust haben. Ein
              „Nein“ sieht die andere Person nie.
            </li>
          </ol>
        </section>

        {['a', 'b'].map((person) => (
          <div key={person} className="person-row">
            <input
              className="name-input"
              value={daten.names[person]}
              onChange={(event) => setName(person, event.target.value)}
              aria-label={`Name ${person.toUpperCase()}`}
              maxLength={24}
            />
            <span className="muted small">
              {fortschritt[person]}/{TOTAL_ITEMS}
            </span>
            <button
              type="button"
              className="btn small"
              onClick={() => setAnsicht(person)}
            >
              Ausfüllen
            </button>
          </div>
        ))}

        <div className="actions">
          <button
            type="button"
            className="btn primary lg grow"
            onClick={() => setAnsicht('abgleich')}
            disabled={!beideFertig}
          >
            Abgleich ansehen
          </button>
        </div>
        {!beideFertig && (
          <p className="muted small center">
            Der Abgleich wird sichtbar, sobald beide etwas ausgefüllt haben.
          </p>
        )}
      </div>
    );
  }

  if (ansicht === 'abgleich') {
    return (
      <div className="page">
        <button type="button" className="btn ghost small" onClick={() => setAnsicht('start')}>
          ← Zurück
        </button>

        <h2 className="panel-title">Eure Schnittmenge</h2>
        {treffer.length === 0 ? (
          <p className="muted">
            Noch keine gemeinsamen Punkte. Das ist völlig in Ordnung – füllt die
            Liste in Ruhe weiter aus.
          </p>
        ) : (
          <>
            <p className="muted small">
              {treffer.filter((t) => t.stufe === 'beide-ja').length}× beide „Ja“,{' '}
              {treffer.filter((t) => t.stufe === 'offen').length}× mindestens
              „Vielleicht“.
            </p>
            <ul className="match-list">
              {treffer.map((item) => (
                <li key={item.id} className={`match ${item.stufe}`}>
                  <span className="match-label">{item.label}</span>
                  <span className="match-meta">
                    {item.kategorie} ·{' '}
                    {item.stufe === 'beide-ja' ? 'beide Ja' : 'Redet mal drüber'}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="footnote">
          Ein Treffer ist eine Einladung, kein Vertrag. Auch ein „Ja“ von letzter
          Woche darf heute ein „Nein“ sein.
        </p>
      </div>
    );
  }

  // Ausfüllansicht für eine Person
  const person = ansicht;
  return (
    <div className="page">
      <div className="fill-head">
        <button type="button" className="btn ghost small" onClick={() => setAnsicht('start')}>
          ← Fertig
        </button>
        <span className="chip">{daten.names[person]}</span>
        <span className="muted small">
          {fortschritt[person]}/{TOTAL_ITEMS}
        </span>
      </div>

      {WISHLIST.map((kategorie) => (
        <section key={kategorie.id} className="panel">
          <h2 className="panel-title">{kategorie.name}</h2>
          <ul className="wish-list">
            {kategorie.items.map((item) => {
              const wert = daten.answers[person][item.id];
              return (
                <li key={item.id} className="wish">
                  <span className="wish-label">{item.label}</span>
                  <span className="wish-answers">
                    {ANSWERS.map((antwort) => (
                      <button
                        key={antwort.id}
                        type="button"
                        className={`answer${wert === antwort.id ? ' on' : ''}`}
                        style={{ '--answer-color': antwort.color }}
                        onClick={() => setAntwort(person, item.id, antwort.id)}
                        aria-pressed={wert === antwort.id}
                        aria-label={`${item.label}: ${antwort.label}`}
                        title={antwort.label}
                      >
                        {antwort.short}
                      </button>
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="actions">
        <button
          type="button"
          className="btn primary lg grow"
          onClick={() => setAnsicht('start')}
        >
          Fertig – Gerät weitergeben
        </button>
      </div>
    </div>
  );
}
