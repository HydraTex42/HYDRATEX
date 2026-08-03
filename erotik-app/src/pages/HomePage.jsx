import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { CARDS } from '../data/cards.js';
import { DATES } from '../data/dates.js';
import { pick } from '../lib/random.js';
import { useApp } from '../context/AppContext.jsx';
import Icon from '../components/Icon.jsx';

const KACHELN = [
  {
    to: '/karten',
    titel: 'Wahrheit oder Pflicht',
    text: 'Drei Stufen – von flirten bis sehr nah.',
    icon: 'cards',
  },
  {
    to: '/wuerfel',
    titel: 'Würfelspiel',
    text: 'Was, wo und wie – der Zufall entscheidet.',
    icon: 'dice',
  },
  {
    to: '/wunschliste',
    titel: 'Wunschliste',
    text: 'Getrennt ausfüllen, gemeinsam abgleichen.',
    icon: 'heart',
  },
  {
    to: '/geschichten',
    titel: 'Geschichten',
    text: 'Kurze Texte zum Vorlesen.',
    icon: 'book',
  },
  {
    to: '/ideen',
    titel: 'Ideen für zu zweit',
    text: 'Vom ruhigen Abend bis zum Wochenende.',
    icon: 'sparkle',
  },
];

/** Zieht quer über alle Decks eine einzelne Anregung. */
function zieheInspiration(vorher) {
  const quellen = [
    ...CARDS.prickelnd.wahrheit.map((t) => ({ art: 'Frage', text: t })),
    ...CARDS.prickelnd.pflicht.map((t) => ({ art: 'Aufgabe', text: t })),
    ...CARDS.heiss.pflicht.map((t) => ({ art: 'Aufgabe', text: t })),
    ...DATES.map((d) => ({ art: 'Idee', text: d.title + ' – ' + d.text })),
  ];
  return pick(
    quellen,
    quellen.find((q) => q.text === vorher?.text),
  );
}

export default function HomePage() {
  const { favorites } = useApp();
  const [inspiration, setInspiration] = useState(() => zieheInspiration());

  const neu = useCallback(() => {
    setInspiration((prev) => zieheInspiration(prev));
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <p className="hero-kicker">Heute Abend</p>
        <p className="hero-text">{inspiration?.text}</p>
        <div className="hero-row">
          <span className="chip">{inspiration?.art}</span>
          <button type="button" className="btn small" onClick={neu}>
            Etwas anderes
          </button>
        </div>
      </section>

      <div className="tiles">
        {KACHELN.map((k) => (
          <Link key={k.to} to={k.to} className="tile">
            <Icon name={k.icon} size={22} className="tile-icon" />
            <span className="tile-title">{k.titel}</span>
            <span className="tile-text">{k.text}</span>
          </Link>
        ))}
      </div>

      {favorites.length > 0 && (
        <section className="panel">
          <h2 className="panel-title">Gemerkt ({favorites.length})</h2>
          <ul className="fav-list">
            {favorites.slice(0, 5).map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
          {favorites.length > 5 && (
            <p className="muted small">
              … und {favorites.length - 5} weitere in den Einstellungen.
            </p>
          )}
        </section>
      )}

      <p className="footnote">
        Alles gilt nur, solange beide Lust haben. Ein „Nein“ braucht keine
        Begründung – und beendet jede Runde sofort.
      </p>
    </div>
  );
}
