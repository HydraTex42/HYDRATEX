import { useEffect, useRef, useState } from 'react';
import { PALETTES, STYLES, RESOLUTIONS, renderArt, randomSeed, hashSeed } from '../lib/generateImage';

function toSeedNumber(seedText) {
  const trimmed = seedText.trim();
  if (trimmed === '') return 0;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed) >>> 0;
  return hashSeed(trimmed);
}

export default function ImageGenerator() {
  const canvasRef = useRef(null);
  const [seedText, setSeedText] = useState(() => String(randomSeed()));
  const [palette, setPalette] = useState('sunset');
  const [style, setStyle] = useState('mixed');
  const [density, setDensity] = useState(5);
  const [resolutionKey, setResolutionKey] = useState('hd');
  const [saving, setSaving] = useState(false);

  const resolution = RESOLUTIONS[resolutionKey];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = resolution.width;
    canvas.height = resolution.height;
    renderArt(canvas.getContext('2d'), {
      width: resolution.width,
      height: resolution.height,
      seed: toSeedNumber(seedText),
      palette,
      style,
      density,
    });
  }, [seedText, palette, style, density, resolution]);

  function randomize() {
    setSeedText(String(randomSeed()));
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bild-generator-${seedText}-${resolutionKey}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setSaving(false);
    }, 'image/png');
  }

  return (
    <div className="image-generator">
      <div className="ig-controls">
        <label>
          Seed
          <div className="ig-seed-row">
            <input
              type="text"
              value={seedText}
              onChange={(e) => setSeedText(e.target.value)}
              placeholder="Zahl oder Wort"
            />
            <button type="button" onClick={randomize} title="Zufälliger Seed">
              🎲
            </button>
          </div>
        </label>

        <label>
          Palette
          <select value={palette} onChange={(e) => setPalette(e.target.value)}>
            {Object.keys(PALETTES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <div className="ig-palette-preview">
          {PALETTES[palette].map((color, i) => (
            <span key={i} className="ig-swatch" style={{ background: color }} />
          ))}
        </div>

        <label>
          Stil
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="mixed">mixed</option>
            {STYLES.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>

        <label>
          Dichte: {density}
          <input
            type="range"
            min={1}
            max={10}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
          />
        </label>

        <label>
          Auflösung
          <select value={resolutionKey} onChange={(e) => setResolutionKey(e.target.value)}>
            {Object.entries(RESOLUTIONS).map(([key, r]) => (
              <option key={key} value={key}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="ig-download-button" onClick={download} disabled={saving}>
          {saving ? 'Wird gespeichert…' : 'Als PNG herunterladen'}
        </button>
      </div>

      <div className="ig-preview">
        <canvas ref={canvasRef} className="ig-canvas" />
        <p className="ig-dimensions">
          {resolution.width} × {resolution.height}px
        </p>
      </div>
    </div>
  );
}
