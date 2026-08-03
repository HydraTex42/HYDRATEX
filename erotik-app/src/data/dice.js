// Drei Würfel: Was, wo und wie. Der dritte Würfel sorgt dafür, dass auch
// die zehnte Runde noch anders läuft als die erste.

export const DICE = [
  {
    id: 'aktion',
    label: 'Aktion',
    icon: 'sparkle',
    faces: [
      'Küssen',
      'Streicheln',
      'Massieren',
      'Anhauchen',
      'Sanft knabbern',
      'Mit den Fingerspitzen kraulen',
      'Mit den Haaren kitzeln',
      'Nur ansehen – nicht berühren',
    ],
  },
  {
    id: 'stelle',
    label: 'Stelle',
    icon: 'heart',
    faces: [
      'Lippen',
      'Hals',
      'Ohr',
      'Nacken',
      'Rücken',
      'Bauch',
      'Innenseite der Arme',
      'Handgelenke',
      'Innenseite der Oberschenkel',
      'Schultern',
      'Hüfte',
      'Überraschung – du wählst',
    ],
  },
  {
    id: 'modus',
    label: 'Und zwar',
    icon: 'clock',
    faces: [
      '10 Sekunden lang',
      '30 Sekunden lang',
      'Eine ganze Minute',
      'So langsam wie möglich',
      'Mit verbundenen Augen',
      'Ohne dass die/der andere sich bewegen darf',
      'Im Dunkeln',
      'Während ihr euch anseht',
      'Ohne ein einziges Wort',
      'Mit einem Eiswürfel',
    ],
  },
];
