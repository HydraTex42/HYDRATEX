import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePersistentState } from '../hooks/usePersistentState.js';
import { KEYS, clearAll } from '../lib/storage.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ageOk, setAgeOk] = usePersistentState(KEYS.ageOk, false);
  const [pinRecord, setPinRecord] = usePersistentState(KEYS.pin, null);
  const [favorites, setFavorites] = usePersistentState(KEYS.favorites, []);
  const [doneDates, setDoneDates] = usePersistentState(KEYS.doneDates, []);
  const [level, setLevel] = usePersistentState(KEYS.level, 'prickelnd');

  // Beim Start gesperrt, sobald eine PIN gesetzt ist. Bewusst nicht persistiert:
  // Neu laden heißt neu entsperren.
  const [unlocked, setUnlocked] = useState(false);

  // Wer gerade selbst eine PIN vergibt, ist offensichtlich berechtigt und darf
  // nicht sofort auf dem Sperrbildschirm landen.
  const savePin = useCallback(
    (record) => {
      setPinRecord(record);
      if (record) setUnlocked(true);
    },
    [setPinRecord],
  );

  const toggleFavorite = useCallback(
    (text) => {
      setFavorites((prev) =>
        prev.includes(text) ? prev.filter((item) => item !== text) : [...prev, text],
      );
    },
    [setFavorites],
  );

  const toggleDate = useCallback(
    (id) => {
      setDoneDates((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    },
    [setDoneDates],
  );

  const reset = useCallback(() => {
    clearAll();
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({
      ageOk,
      setAgeOk,
      pinRecord,
      savePin,
      unlocked,
      setUnlocked,
      favorites,
      toggleFavorite,
      doneDates,
      toggleDate,
      level,
      setLevel,
      reset,
    }),
    [
      ageOk,
      setAgeOk,
      pinRecord,
      savePin,
      unlocked,
      favorites,
      toggleFavorite,
      doneDates,
      toggleDate,
      level,
      setLevel,
      reset,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp muss innerhalb von <AppProvider> benutzt werden');
  return ctx;
}
