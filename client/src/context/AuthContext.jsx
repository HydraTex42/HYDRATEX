import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../lib/api';
import {
  deriveAuthHash,
  deriveMasterKey,
  generateSalt,
  generateVaultKey,
  unwrapVaultKey,
  wrapVaultKey,
} from '../lib/crypto';

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'hydratex.token';
const EMAIL_STORAGE_KEY = 'hydratex.email';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_STORAGE_KEY));
  const [email, setEmail] = useState(() => sessionStorage.getItem(EMAIL_STORAGE_KEY));
  // The vault key only ever lives in memory. Refreshing the page or closing
  // the tab clears it, so the vault re-locks and requires the master
  // password again — the server never has enough to reconstruct it.
  const [vaultKey, setVaultKey] = useState(null);

  const isUnlocked = Boolean(token && vaultKey);

  const register = useCallback(async (registerEmail, masterPassword) => {
    const salt = generateSalt();
    const masterKey = await deriveMasterKey(masterPassword, salt);
    const authHash = await deriveAuthHash(masterKey, masterPassword);
    const newVaultKey = await generateVaultKey();
    const { encVaultKey, encVaultKeyIv } = await wrapVaultKey(newVaultKey, masterKey);

    const { token: newToken } = await api.register({
      email: registerEmail,
      salt,
      authHash,
      encVaultKey,
      encVaultKeyIv,
    });

    sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    sessionStorage.setItem(EMAIL_STORAGE_KEY, registerEmail);
    setToken(newToken);
    setEmail(registerEmail);
    setVaultKey(newVaultKey);
  }, []);

  const login = useCallback(async (loginEmail, masterPassword) => {
    const { salt } = await api.getSalt(loginEmail);
    const masterKey = await deriveMasterKey(masterPassword, salt);
    const authHash = await deriveAuthHash(masterKey, masterPassword);

    const { token: newToken, user } = await api.login({ email: loginEmail, authHash });
    const unwrappedVaultKey = await unwrapVaultKey(user.encVaultKey, user.encVaultKeyIv, masterKey);

    sessionStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    sessionStorage.setItem(EMAIL_STORAGE_KEY, loginEmail);
    setToken(newToken);
    setEmail(loginEmail);
    setVaultKey(unwrappedVaultKey);
  }, []);

  // Used after a page refresh: we still have a valid JWT, but the vault key
  // was never persisted, so the vault stays locked until the master
  // password is re-entered here.
  const unlock = useCallback(async (masterPassword) => {
    if (!token || !email) throw new Error('No active session to unlock');
    const { user } = await api.me(token);
    const { salt } = await api.getSalt(email);
    const masterKey = await deriveMasterKey(masterPassword, salt);
    const authHash = await deriveAuthHash(masterKey, masterPassword);

    // Re-verify locally derived credentials against the server before
    // trusting the unwrap, so a wrong password fails clearly.
    await api.login({ email, authHash });
    const unwrappedVaultKey = await unwrapVaultKey(user.encVaultKey, user.encVaultKeyIv, masterKey);
    setVaultKey(unwrappedVaultKey);
  }, [token, email]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(EMAIL_STORAGE_KEY);
    setToken(null);
    setEmail(null);
    setVaultKey(null);
  }, []);

  const lock = useCallback(() => {
    setVaultKey(null);
  }, []);

  const value = useMemo(
    () => ({ token, email, vaultKey, isUnlocked, register, login, unlock, logout, lock }),
    [token, email, vaultKey, isUnlocked, register, login, unlock, logout, lock]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
