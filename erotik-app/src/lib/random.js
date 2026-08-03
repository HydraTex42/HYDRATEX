/** Zufälliges Element aus einer Liste – optional ohne das zuletzt gezogene. */
export function pick(list, exclude) {
  if (!list.length) return undefined;
  if (list.length === 1) return list[0];
  const pool = exclude === undefined ? list : list.filter((item) => item !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Zieht Karten ohne Wiederholung: Erst wenn das Deck durch ist, wird neu
 * gemischt. Sonst kommt gefühlt jede dritte Karte doppelt.
 */
export function createDeck(items) {
  let rest = shuffle(items);
  return function next() {
    if (!rest.length) rest = shuffle(items);
    return rest.pop();
  };
}

export function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
