// Die Wunschliste ist bewusst als "Ja / Vielleicht / Nein" aufgebaut.
// Beide füllen sie getrennt aus, und der Abgleich zeigt ausschließlich das,
// wozu beide mindestens "Vielleicht" gesagt haben. Ein "Nein" wird niemals
// dem anderen angezeigt – es beendet das Thema einfach.

export const WISHLIST = [
  {
    id: 'naehe',
    name: 'Nähe & Zärtlichkeit',
    items: [
      { id: 'kuscheln-lang', label: 'Lange kuscheln, ohne dass es weitergehen muss' },
      { id: 'nackt-einschlafen', label: 'Nackt nebeneinander einschlafen' },
      { id: 'gemeinsam-duschen', label: 'Gemeinsam duschen oder baden' },
      { id: 'ganzkoerpermassage', label: 'Ganzkörpermassage mit Öl' },
      { id: 'streicheln-ohne-ziel', label: 'Sich streicheln, ohne ein Ziel zu haben' },
      { id: 'morgens', label: 'Sex am Morgen' },
      { id: 'danach-reden', label: 'Danach liegen bleiben und reden' },
    ],
  },
  {
    id: 'kuessen',
    name: 'Küssen & Berührung',
    items: [
      { id: 'knutschen', label: 'Ausgiebig knutschen wie am Anfang' },
      { id: 'nacken', label: 'Küsse im Nacken und am Hals' },
      { id: 'knabbern', label: 'Sanftes Beißen und Knabbern' },
      { id: 'federn', label: 'Federn oder weiche Stoffe auf der Haut' },
      { id: 'eis', label: 'Eiswürfel' },
      { id: 'warmes-wachs', label: 'Massagekerze / warmes Öl' },
      { id: 'kratzen', label: 'Kratzen auf dem Rücken' },
    ],
  },
  {
    id: 'spiel',
    name: 'Spiel & Fantasie',
    items: [
      { id: 'augenbinde', label: 'Augenbinde' },
      { id: 'fesseln-stoff', label: 'Locker fesseln (weicher Stoff, jederzeit lösbar)' },
      { id: 'rollenspiel', label: 'Rollenspiel' },
      { id: 'striptease', label: 'Striptease' },
      { id: 'necken', label: 'Necken und hinhalten' },
      { id: 'fuehren', label: 'Einer führt, einer lässt sich führen' },
      { id: 'spielzeug', label: 'Spielzeug gemeinsam benutzen' },
      { id: 'wuerfelspiel', label: 'Spiele wie das Würfelspiel in dieser App' },
    ],
  },
  {
    id: 'reden',
    name: 'Reden & Fantasien teilen',
    items: [
      { id: 'dirty-talk', label: 'Dirty Talk' },
      { id: 'fantasie-erzaehlen', label: 'Sich gegenseitig Fantasien erzählen' },
      { id: 'geschichten-lesen', label: 'Erotische Geschichten zusammen lesen' },
      { id: 'nachrichten', label: 'Aufreizende Nachrichten tagsüber' },
      { id: 'sagen-was-gefaellt', label: 'Laut sagen, was gerade gut ist' },
      { id: 'wuensche-aussprechen', label: 'Wünsche direkt aussprechen statt andeuten' },
    ],
  },
  {
    id: 'orte',
    name: 'Orte & Situationen',
    items: [
      { id: 'anderes-zimmer', label: 'Ein anderes Zimmer als das Schlafzimmer' },
      { id: 'licht-an', label: 'Bei Licht statt im Dunkeln' },
      { id: 'kerzen', label: 'Bei Kerzenlicht' },
      { id: 'spiegel', label: 'Vor einem Spiegel' },
      { id: 'hotel', label: 'Eine Nacht im Hotel' },
      { id: 'wochenende-offline', label: 'Ein Wochenende ohne Handys' },
      { id: 'spontan', label: 'Spontan, ohne Planung' },
      { id: 'termin', label: 'Fest verabredet, mit Vorfreude' },
    ],
  },
  {
    id: 'rahmen',
    name: 'Rahmen & Sicherheit',
    items: [
      { id: 'safeword', label: 'Ein Safeword vereinbaren' },
      { id: 'vorher-absprechen', label: 'Vorher besprechen, was heute Abend läuft' },
      { id: 'jederzeit-stopp', label: 'Jederzeit ohne Erklärung aufhören dürfen' },
      { id: 'danach-besprechen', label: 'Hinterher darüber sprechen, wie es war' },
      { id: 'verhuetung', label: 'Über Verhütung und Tests sprechen' },
    ],
  },
];

export const ANSWERS = [
  { id: 'ja', label: 'Ja', short: 'J', color: '#5fbf8f' },
  { id: 'vielleicht', label: 'Vielleicht', short: 'V', color: '#e3b562' },
  { id: 'nein', label: 'Nein', short: 'N', color: '#8b8b9a' },
];

export const TOTAL_ITEMS = WISHLIST.reduce((sum, cat) => sum + cat.items.length, 0);
