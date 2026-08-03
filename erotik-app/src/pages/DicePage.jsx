import { useEffect, useRef, useState } from 'react';
import { DICE } from '../data/dice.js';
import { pick } from '../lib/random.js';
import { useApp } from '../context/AppContext.jsx';
import Icon from '../components/Icon.jsx';

const ROLL_MS = 700;

export default function DicePage() {
  const { favorites, toggleFavorite } = useApp();
  const [ergebnis, setErgebnis] = useState(null);
  const [rollt, setRollt] = useState(false);
  const [vorschau, setVorschau] = useState(() => DICE.map((d) => d.faces[0]));
  const timers = useRef([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearInterval);
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  function wuerfeln() {
    if (rollt) return;
    setRollt(true);
    setErgebnis(null);

    const ticker = setInterval(() => {
      setVorschau(DICE.map((d) => pick(d.faces)));
    }, 70);

    const ende = setTimeout(() => {
      clearInterval(ticker);
      const werte = DICE.map((d) => pick(d.faces));
      setVorschau(werte);
      setErgebnis(werte);
      setRollt(false);
    }, ROLL_MS);

    timers.current = [ticker, ende];
  }

  const satz = ergebnis ? ergebnis.join(' · ') : null;
  const gemerkt = satz ? favorites.includes(satz) : false;

  return (
    <div className="page fill">
      <p className="muted small center">
        Drei Würfel: was, wo und wie. Passt etwas nicht, wird einfach neu
        gewürfelt.
      </p>

      <div className="dice-row">
        {DICE.map((wuerfel, index) => (
          <div key={wuerfel.id} className={`die${rollt ? ' rolling' : ''}`}>
            <Icon name={wuerfel.icon} size={20} className="die-icon" />
            <span className="die-label">{wuerfel.label}</span>
            <span className="die-face">{vorschau[index]}</span>
          </div>
        ))}
      </div>

      <div className="dice-result" aria-live="polite">
        {ergebnis ? (
          <>
            <p className="dice-sentence">{satz}</p>
            <button
              type="button"
              className={`card-fav${gemerkt ? ' on' : ''}`}
              onClick={() => toggleFavorite(satz)}
              aria-pressed={gemerkt}
            >
              {gemerkt ? '★ Gemerkt' : '☆ Merken'}
            </button>
          </>
        ) : (
          <p className="muted small">{rollt ? 'Läuft …' : 'Noch nichts gewürfelt.'}</p>
        )}
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn primary lg grow"
          onClick={wuerfeln}
          disabled={rollt}
        >
          {rollt ? 'Würfelt …' : 'Würfeln'}
        </button>
      </div>
    </div>
  );
}
