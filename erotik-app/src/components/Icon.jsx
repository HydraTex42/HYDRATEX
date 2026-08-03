// Eigene SVG-Icons statt Unicode-Symbolen: Zeichen wie ⚄ oder ❥ sehen je nach
// installierter Schrift völlig unterschiedlich aus (oder fehlen ganz).

const PATHS = {
  home: (
    <path d="M4 10.6 12 4l8 6.6V19a1.5 1.5 0 0 1-1.5 1.5H15V15H9v5.5H5.5A1.5 1.5 0 0 1 4 19z" />
  ),
  cards: (
    <>
      <rect x="8.5" y="3" width="11" height="18" rx="2.5" />
      <path d="M5.6 6.6A2.5 2.5 0 0 0 4 8.9v8.6a2.5 2.5 0 0 0 2.3 2.5" />
      <path d="M14 15.1 11.4 12.5a1.8 1.8 0 0 1 2.6-2.5 1.8 1.8 0 0 1 2.6 2.5z" />
    </>
  ),
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="9" cy="9" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  heart: (
    <path d="M12 20.3 4.6 12.9a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5z" />
  ),
  book: (
    <>
      <path d="M12 7C10.6 5.6 8.6 5 5 5v12.5c3.6 0 5.6.6 7 2 1.4-1.4 3.4-2 7-2V5c-3.6 0-5.6.6-7 2z" />
      <path d="M12 7v12.5" />
    </>
  ),
  sparkle: <path d="M12 3.4 13.9 9.3 19.8 11.2 13.9 13.1 12 19 10.1 13.1 4.2 11.2 10.1 9.3z" />,
  settings: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2.2" />
      <circle cx="9" cy="17" r="2.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
};

export default function Icon({ name, size = 22, className }) {
  const inhalt = PATHS[name];
  if (!inhalt) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {inhalt}
    </svg>
  );
}
