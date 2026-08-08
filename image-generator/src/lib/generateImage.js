// Deterministic, seed-based generative art. Pure functions only — no React,
// no DOM access except the 2D canvas context passed in by the caller.

export const PALETTES = {
  sunset: ['#2b1055', '#7597de', '#ff7e5f', '#feb47b'],
  ocean: ['#003973', '#00c9ff', '#92fe9d', '#e5e5be'],
  forest: ['#134e5e', '#71b280', '#d4fc79', '#96e6a1'],
  neon: ['#0f0c29', '#302b63', '#f72585', '#4cc9f0'],
  mono: ['#0d0d0d', '#3a3a3a', '#8a8a8a', '#f4f4f4'],
  candy: ['#ff9a9e', '#fad0c4', '#a18cd1', '#fbc2eb'],
};

export const STYLES = ['circles', 'polygons', 'lines', 'flow-field'];

export const RESOLUTIONS = {
  preview: { width: 1024, height: 1024, label: 'Vorschau (1024×1024)' },
  hd: { width: 1920, height: 1080, label: 'Full HD (1920×1080)' },
  '4k': { width: 3840, height: 2160, label: '4K UHD (3840×2160)' },
  '4k-square': { width: 3840, height: 3840, label: '4K Quadrat (3840×3840)' },
};

// Mulberry32 — small, fast, deterministic PRNG seeded by a 32-bit int.
export function createRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed() {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}

// FNV-1a — lets users type a word as a seed instead of a number.
export function hashSeed(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function withAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

function paintBackground(ctx, width, height, colors, rng) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, pick(rng, colors));
  gradient.addColorStop(1, pick(rng, colors));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawCircles(ctx, width, height, colors, rng, count) {
  const scale = Math.min(width, height);
  for (let i = 0; i < count; i++) {
    const r = (0.02 + rng() * 0.18) * scale;
    ctx.beginPath();
    ctx.arc(rng() * width, rng() * height, r, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(pick(rng, colors), 0.15 + rng() * 0.35);
    ctx.fill();
  }
}

function drawPolygons(ctx, width, height, colors, rng, count) {
  const scale = Math.min(width, height);
  for (let i = 0; i < count; i++) {
    const sides = 3 + Math.floor(rng() * 4);
    const r = (0.03 + rng() * 0.15) * scale;
    const cx = rng() * width;
    const cy = rng() * height;
    const rotation = rng() * Math.PI * 2;
    ctx.beginPath();
    for (let s = 0; s < sides; s++) {
      const angle = rotation + (s / sides) * Math.PI * 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = withAlpha(pick(rng, colors), 0.15 + rng() * 0.35);
    ctx.fill();
  }
}

function drawLines(ctx, width, height, colors, rng, count) {
  const scale = Math.min(width, height);
  for (let i = 0; i < count; i++) {
    const x1 = rng() * width;
    const y1 = rng() * height;
    const len = (0.1 + rng() * 0.4) * scale;
    const angle = rng() * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len);
    ctx.strokeStyle = withAlpha(pick(rng, colors), 0.2 + rng() * 0.5);
    ctx.lineWidth = (0.001 + rng() * 0.004) * scale;
    ctx.stroke();
  }
}

function drawFlowField(ctx, width, height, colors, rng, count) {
  const scale = Math.min(width, height);
  const fx = 0.002 + rng() * 0.004;
  const fy = 0.002 + rng() * 0.004;
  const phase = rng() * Math.PI * 2;
  const stepLen = scale * 0.006;
  for (let i = 0; i < count; i++) {
    let x = rng() * width;
    let y = rng() * height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = withAlpha(pick(rng, colors), 0.1 + rng() * 0.3);
    ctx.lineWidth = (0.0015 + rng() * 0.002) * scale;
    const steps = 40 + Math.floor(rng() * 60);
    for (let s = 0; s < steps; s++) {
      const angle = (Math.sin(x * fx + phase) + Math.cos(y * fy + phase)) * Math.PI;
      x += Math.cos(angle) * stepLen;
      y += Math.sin(angle) * stepLen;
      ctx.lineTo(x, y);
      if (x < -50 || x > width + 50 || y < -50 || y > height + 50) break;
    }
    ctx.stroke();
  }
}

const DRAWERS = {
  circles: drawCircles,
  polygons: drawPolygons,
  lines: drawLines,
  'flow-field': drawFlowField,
};

// Renders a full composition into ctx. Same seed + params always produce the
// same image, independent of canvas resolution (shape count is fixed; only
// shape size/position scale with width/height).
export function renderArt(ctx, { width, height, seed, palette = 'sunset', style = 'mixed', density = 5 }) {
  const rng = createRng(seed);
  const colors = PALETTES[palette] || PALETTES.sunset;

  ctx.clearRect(0, 0, width, height);
  paintBackground(ctx, width, height, colors, rng);

  const baseCount = 40 + density * 40;
  if (style === 'mixed') {
    const perStyle = Math.round(baseCount / STYLES.length);
    STYLES.forEach((s) => DRAWERS[s](ctx, width, height, colors, rng, perStyle));
  } else {
    (DRAWERS[style] || drawCircles)(ctx, width, height, colors, rng, baseCount);
  }
}
