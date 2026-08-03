// Alles bleibt im localStorage des Geräts. Es gibt bewusst keinen Server:
// Wunschlisten und Antworten sollen das Gerät nie verlassen.

const PREFIX = 'zweisam:';

export function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    // Privater Modus oder voller Speicher – die App funktioniert weiter,
    // merkt sich dann nur nichts.
    return false;
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* egal */
  }
}

/** Löscht sämtliche Daten dieser App – und nur die. */
export function clearAll() {
  try {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(PREFIX)) keys.push(key);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* egal */
  }
}

export const KEYS = {
  ageOk: 'age-ok',
  pin: 'pin',
  wishlist: 'wishlist',
  favorites: 'favorites',
  doneDates: 'done-dates',
  level: 'level',
};
