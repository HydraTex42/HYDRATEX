import { useState } from 'react';
import { DATES, DATE_CATEGORIES } from '../data/dates.js';
import { useApp } from '../context/AppContext.jsx';

export default function DatesPage() {
  const { doneDates, toggleDate } = useApp();
  const [filter, setFilter] = useState('alle');

  const sichtbar = filter === 'alle' ? DATES : DATES.filter((d) => d.cat === filter);

  return (
    <div className="page">
      <div className="filters" role="group" aria-label="Kategorie filtern">
        <button
          type="button"
          className={`filter${filter === 'alle' ? ' active' : ''}`}
          onClick={() => setFilter('alle')}
        >
          Alle
        </button>
        {DATE_CATEGORIES.map((kategorie) => (
          <button
            key={kategorie.id}
            type="button"
            className={`filter${filter === kategorie.id ? ' active' : ''}`}
            onClick={() => setFilter(kategorie.id)}
          >
            {kategorie.name}
          </button>
        ))}
      </div>

      <div className="idea-list">
        {sichtbar.map((idee) => {
          const erledigt = doneDates.includes(idee.id);
          return (
            <article key={idee.id} className={`idea${erledigt ? ' done' : ''}`}>
              <header className="idea-head">
                <h2 className="idea-title">{idee.title}</h2>
                <span className="idea-dauer">{idee.dauer}</span>
              </header>
              <p className="idea-text">{idee.text}</p>
              <button
                type="button"
                className={`idea-check${erledigt ? ' on' : ''}`}
                onClick={() => toggleDate(idee.id)}
                aria-pressed={erledigt}
              >
                {erledigt ? '✓ Gemacht' : 'Als gemacht markieren'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
