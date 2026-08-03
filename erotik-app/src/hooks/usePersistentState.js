import { useCallback, useState } from 'react';
import { load, save } from '../lib/storage.js';

/** useState, das seinen Wert im localStorage spiegelt. */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => load(key, initial));

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        save(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update];
}
