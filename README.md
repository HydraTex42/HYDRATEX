# HydraTex

Dieses Repository enthält zwei eigenständige Anwendungen:

| Ordner | Projekt |
| --- | --- |
| `server/` + `client/` | **Password Manager** – zero-knowledge Passwortverwaltung (siehe unten) |
| `erotik-app/` | **Zweisam** – deutschsprachige Paar-App ab 18, rein clientseitig ([README](erotik-app/README.md)) |

Beide Projekte werden getrennt installiert und gestartet.

---

## HydraTex Password Manager

A self-hosted, zero-knowledge password manager. The server only ever stores
encrypted blobs — your master password and vault encryption key never leave
your browser.

### How the encryption works

1. You choose an email and a master password. The browser derives a
   **master key** from the master password using PBKDF2 (210,000 iterations,
   SHA-256) with a random per-account salt.
2. The browser derives an **auth hash** from the master key. This hash — not
   your master password — is what gets sent to the server and bcrypt-hashed
   for login verification.
3. The browser generates a random 256-bit **vault key**, encrypts it with
   the master key (AES-GCM), and sends only the encrypted (wrapped) result to
   the server.
4. Every vault item (title, username, password, URL, notes) is encrypted
   client-side with the vault key (AES-GCM) before being sent to the server.
   The server stores and returns opaque ciphertext — it cannot read your data.
5. On login, the server returns your salt and wrapped vault key. The browser
   re-derives the master key from your password, unwraps the vault key, and
   decrypts your items locally.
6. The vault key only ever lives in memory. Refreshing the page clears it,
   so the vault re-locks and you must re-enter your master password.

**There is no password recovery.** If you forget your master password, your
vault data cannot be decrypted by anyone, including the server operator.

### Project structure

```
server/   Express + SQLite API (stores encrypted blobs only)
client/   React + Vite SPA (all crypto happens here, via Web Crypto API)
```

### Running locally

#### 1. Server

```bash
cd server
cp .env.example .env   # edit JWT_SECRET to a long random string
npm install
npm run dev             # http://localhost:4000
```

#### 2. Client

```bash
cd client
cp .env.example .env    # defaults to http://localhost:4000/api
npm install
npm run dev              # http://localhost:5173
```

Open http://localhost:5173, create a vault (email + master password), and
start adding items.

### Features

- Zero-knowledge, client-side AES-GCM encryption of all vault data
- JWT-authenticated REST API backed by SQLite
- Strong password generator (configurable length/character sets)
- Master password strength meter
- Search/filter vault items
- Copy-to-clipboard with automatic 20-second clipboard clearing
- Auto-lock on page refresh (vault key never persisted)

### Production hardening notes

This is a solid MVP, but before running it for real users you should also:
- Serve over HTTPS only, and move the JWT out of `sessionStorage` into an
  httpOnly cookie with CSRF protection.
- Add account lockout / stronger rate limiting around `/api/auth/*`.
- Consider WebAuthn/2FA as a second factor.
- Add automated backups of the SQLite database (it only contains ciphertext,
  but availability still matters).
