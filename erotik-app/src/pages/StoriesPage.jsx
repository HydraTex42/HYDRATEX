import { useState } from 'react';
import { STORIES } from '../data/stories.js';

export default function StoriesPage() {
  const [offen, setOffen] = useState(null);

  const geschichte = STORIES.find((s) => s.id === offen);

  if (geschichte) {
    return (
      <div className="page">
        <button type="button" className="btn ghost small" onClick={() => setOffen(null)}>
          ← Alle Geschichten
        </button>
        <article className="story">
          <h2 className="story-title">{geschichte.title}</h2>
          <p className="story-meta">
            {geschichte.tag} · {geschichte.minuten} Min. Lesezeit
          </p>
          {geschichte.text.map((absatz, index) => (
            // Absätze sind statisch und ändern ihre Reihenfolge nie.
            // eslint-disable-next-line react/no-array-index-key
            <p key={index} className="story-paragraph">
              {absatz}
            </p>
          ))}
        </article>
        <p className="footnote">
          Alle Figuren sind erwachsen, alles passiert einvernehmlich.
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <p className="muted small center">
        Kurze Texte – gut zum Vorlesen, wenn eine/r zuhören mag.
      </p>
      <div className="story-list">
        {STORIES.map((story) => (
          <button
            key={story.id}
            type="button"
            className="story-card"
            onClick={() => setOffen(story.id)}
          >
            <span className="story-card-tag">{story.tag}</span>
            <span className="story-card-title">{story.title}</span>
            <span className="story-card-teaser">{story.teaser}</span>
            <span className="story-card-meta">{story.minuten} Min.</span>
          </button>
        ))}
      </div>
    </div>
  );
}
