import { useEffect, useState } from 'react';
import { generatePassword } from '../lib/crypto';

export default function PasswordGenerator({ onUse }) {
  const [length, setLength] = useState(20);
  const [options, setOptions] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(generatePassword({ length, ...options }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function regenerate(overrides = {}) {
    const next = { length, ...options, ...overrides };
    setValue(generatePassword(next));
  }

  function toggle(key) {
    const next = { ...options, [key]: !options[key] };
    const anySelected = Object.values(next).some(Boolean);
    if (!anySelected) return;
    setOptions(next);
    regenerate(next);
  }

  return (
    <div className="password-generator">
      <div className="generated-value">
        <code>{value}</code>
        <button type="button" onClick={() => regenerate()} title="Regenerate">↻</button>
      </div>

      <label>
        Length: {length}
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => {
            const l = Number(e.target.value);
            setLength(l);
            regenerate({ length: l });
          }}
        />
      </label>

      <div className="generator-options">
        <label><input type="checkbox" checked={options.lower} onChange={() => toggle('lower')} /> a-z</label>
        <label><input type="checkbox" checked={options.upper} onChange={() => toggle('upper')} /> A-Z</label>
        <label><input type="checkbox" checked={options.digits} onChange={() => toggle('digits')} /> 0-9</label>
        <label><input type="checkbox" checked={options.symbols} onChange={() => toggle('symbols')} /> !@#$</label>
      </div>

      {onUse && (
        <button type="button" className="use-password-button" onClick={() => onUse(value)}>
          Use this password
        </button>
      )}
    </div>
  );
}
