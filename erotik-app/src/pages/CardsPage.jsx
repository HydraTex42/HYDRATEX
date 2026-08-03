import { useMemo, useRef, useState } from 'react';
import { CARDS, CARD_TYPES, LEVELS } from '../data/cards.js';
import { createDeck } from '../lib/random.js';
import { useApp } from '../context/AppContext.jsx';

export default function CardsPage() {
  const { level, setLevel, favorites, toggleFavorite } = useApp();
  const [karte, setKarte] = useState(null);
  const [animation, setAnimation] = useState(0);

  // Pro Stufe und Kartentyp ein eigenes Deck, das erst nach dem letzten
  // Zug neu gemischt wird.
  const decks = useRef({});
  const deckFor = useMemo(
    () => (stufe, typ) => {
      const key = `${stufe}:${typ}`;
      if (!decks.current[key]) decks.current[key] = createDeck(CARDS[stufe][typ]);
      return decks.current[key];
    },
    [],
  );

  function ziehen(typ) {
    const text = deckFor(level, typ)();
    setKarte({ typ, text });
    setAnimation((n) => n + 1);
  }

  const aktuelleStufe = LEVELS.find((l) => l.id === level) ?? LEVELS[0];
  const gemerkt = karte ? favorites.includes(karte.text) : false;

  return (
    <div className="page fill">
      <section className="levels" aria-label="Stufe wählen">
        {LEVELS.map((stufe) => (
          <button
            key={stufe.id}
            type="button"
            className={`level${stufe.id === level ? ' active' : ''}`}
            style={{ '--level-accent': stufe.accent }}
            onClick={() => {
              setLevel(stufe.id);
              setKarte(null);
            }}
          >
            {stufe.name}
          </button>
        ))}
      </section>
      <p className="muted small center">{aktuelleStufe.hint}</p>

      <div
        key={animation}
        className={`card${karte ? ' filled' : ''}`}
        style={{ '--level-accent': aktuelleStufe.accent }}
      >
        {karte ? (
          <>
            <span className="card-type">
              {CARD_TYPES.find((t) => t.id === karte.typ)?.label}
            </span>
            <p className="card-text">{karte.text}</p>
            <button
              type="button"
              className={`card-fav${gemerkt ? ' on' : ''}`}
              onClick={() => toggleFavorite(karte.text)}
              aria-pressed={gemerkt}
            >
              {gemerkt ? '★ Gemerkt' : '☆ Merken'}
            </button>
          </>
        ) : (
          <p className="card-placeholder">
            Wählt eine Stufe und zieht eine Karte.
            <br />
            Wer nicht will, sagt einfach „weiter“.
          </p>
        )}
      </div>

      <div className="actions">
        {CARD_TYPES.map((typ) => (
          <button
            key={typ.id}
            type="button"
            className="btn primary lg grow"
            onClick={() => ziehen(typ.id)}
          >
            {typ.label}
          </button>
        ))}
      </div>
    </div>
  );
}
