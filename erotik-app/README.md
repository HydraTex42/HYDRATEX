# Zweisam

Eine deutschsprachige App für Paare ab 18: Spiele, Gesprächsanstöße und Ideen
für mehr Nähe. Alles läuft im Browser, alles bleibt auf dem Gerät.

## Warum ohne Server

Wunschlisten, Antworten und Merklisten sind mit das Privateste, was ein Paar
aufschreiben kann. Deshalb gibt es hier bewusst **kein Konto, keinen Server und
keine Übertragung**: Die App ist eine reine Single-Page-App, alle Daten liegen
im `localStorage` des Browsers. Ohne Backend gibt es auch keine Datenbank, die
geleakt werden könnte.

## Funktionen

| Bereich | Was es tut |
| --- | --- |
| **Wahrheit oder Pflicht** | 72 Karten in drei Stufen (Prickelnd / Heiß / Intim). Jedes Deck wird ohne Wiederholung durchgespielt und erst danach neu gemischt. |
| **Würfelspiel** | Drei Würfel – Aktion, Körperstelle und Ausführung – ergeben 960 Kombinationen. |
| **Wunschliste** | Ja/Vielleicht/Nein-Liste mit 41 Punkten. Beide füllen sie getrennt aus, der Abgleich zeigt nur die Schnittmenge. |
| **Geschichten** | Vier sinnliche Kurzgeschichten zum Vorlesen – andeutend statt explizit. |
| **Ideen für zu zweit** | 17 Date- und Abendideen, nach Stimmung filterbar, mit Merkfunktion. |
| **Einstellungen** | Optionale PIN-Sperre, Merkliste verwalten, alle Daten löschen. |

### Die Wunschliste im Detail

Das ist das Herzstück und der Grund, warum die Logik in
`src/pages/WishlistPage.jsx` so streng ist:

- Beide beantworten dieselbe Liste **getrennt** – man gibt das Gerät weiter.
- Der Abgleich zeigt einen Punkt nur, wenn **beide** mindestens „Vielleicht“
  gesagt haben.
- Ein „Nein“ wird der anderen Person **niemals** angezeigt – auch nicht als
  Andeutung oder Zähler. Es beendet das Thema einfach.

So entsteht kein Rechtfertigungsdruck: Man sieht nur, worauf beide Lust haben.

## Sicherheit und Datenschutz

- **Kein Netzwerkverkehr.** Die App lädt keine Fonts, keine Analytics, keine
  externen Ressourcen. Die Icons sind Inline-SVG.
- **PIN-Sperre** (optional): Die PIN wird über PBKDF2 (150.000 Iterationen,
  SHA-256, zufälliger Salt) gehasht und nie im Klartext gespeichert.
- **Ehrliche Einordnung:** Die PIN ist ein Sichtschutz gegen neugierige Blicke,
  keine Verschlüsselung. Wer Zugriff auf das entsperrte Gerät hat, kommt an den
  `localStorage`. Für echten Schutz gehört die Geräte-Verschlüsselung des
  Betriebssystems dazu.
- **Altersbestätigung** beim ersten Start (18+).
- **Hilfsangebote** sind in den Einstellungen hinterlegt, falls sich jemand
  unter Druck gesetzt fühlt.

## Lokal starten

```bash
cd erotik-app
npm install
npm run dev      # http://localhost:5174
```

Weitere Skripte:

```bash
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal ausliefern
npm run lint     # oxlint
```

Da die App keinen Server braucht, lässt sich der Inhalt von `dist/` auf jedem
statischen Hoster ablegen – oder einfach lokal öffnen. Das Routing nutzt
`HashRouter`, damit auch ein direkter Aufruf ohne Server-Rewrites funktioniert.

## Aufbau

```
src/
  data/        Inhalte (Karten, Würfel, Wunschliste, Geschichten, Ideen)
  lib/         localStorage-Helfer, PIN-Hashing, Zufall/Deck-Logik
  hooks/       usePersistentState
  context/     App-weiter Zustand (Alter, PIN, Merkliste, Stufe)
  components/  AgeGate, PinLock, Layout, Icon
  pages/       Die sechs Bereiche + Einstellungen
  styles/      Ein Stylesheet, keine CSS-Bibliothek
```

Inhalte stehen bewusst in `src/data/` als einfache Arrays – Karten oder Ideen
ergänzt man dort, ohne Komponenten anfassen zu müssen.

## Haltung zu den Inhalten

Die Texte sind sinnlich, aber nicht explizit, und durchgehend auf
Einvernehmlichkeit ausgelegt. Alle Figuren in den Geschichten sind erwachsen.
Die Karten enthalten keine Aufgaben, die jemanden zu etwas drängen – und die
App weist an mehreren Stellen darauf hin, dass ein „Nein“ jederzeit gilt und
keine Begründung braucht.
