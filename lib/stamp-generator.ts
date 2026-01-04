import sharp from 'sharp';

import { VISITED_COUNTRIES } from './countries';

const CACHE_VERSION = 7;
const imageCache = new Map<string, string>();
const COLORS = [
  '#1e3a5f',
  '#8B0000',
  '#1a1a1a',
  '#2d4a2d',
  '#4a2545',
  '#5c3d2e',
];
const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

interface StampData {
  country: string;
  city: string;
  date: string;
  color: string;
  img?: string;
}

// Helper functions
const hash = (c: string) => c.charCodeAt(0) + c.charCodeAt(1) + c.charCodeAt(2);
const hash2 = (c: string) =>
  c.charCodeAt(0) + c.charCodeAt(1) * 2 + c.charCodeAt(2) * 3;
const getColor = (c: string) => COLORS[hash(c) % COLORS.length];
const getVariation = (c: string) => hash2(c) % 10;
const getDate = (c: string) => {
  const h = hash(c);
  return `${((h % 28) + 1).toString().padStart(2, '0')}.${MONTHS[h % 12]}.${2019 + (h % 6)}`;
};

// Image helpers
const imgClip = (id: string, shape: string) =>
  `<defs><clipPath id="${id}">${shape}</clipPath></defs>`;
const imgEl = (
  id: string,
  img: string,
  x: number,
  y: number,
  w: number,
  h: number,
) =>
  `<g clip-path="url(#${id})" opacity="0.5"><image href="${img}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></g>`;

// Text helper
const txt = (
  x: number,
  y: number,
  size: number,
  color: string,
  text: string,
  bold = false,
) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="Arial" font-size="${size}" ${bold ? 'font-weight="bold"' : ''} text-anchor="middle">${text}</text>`;

// SVG wrapper
const svg = (w: number, h: number, content: string) =>
  `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;

// Polygon points generator
const polyPts = (
  cx: number,
  cy: number,
  r: number,
  sides: number,
  offsetAngle = 0,
) =>
  Array.from({ length: sides }, (_, i) => {
    const a = ((Math.PI * 2) / sides) * i + offsetAngle;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');

// ============== STAMP GENERATORS ==============
type Generator = (d: StampData, s: number) => string;

const generators: Generator[] = [
  // 1. Circular
  (d, s) => {
    const cx = s / 2,
      r = s / 2 - 4,
      ir = r - 8;
    const clip = d.img
      ? imgClip('c', `<circle cx="${cx}" cy="${cx}" r="${ir}"/>`) +
        imgEl('c', d.img, cx - ir, cx - ir, ir * 2, ir * 2)
      : '';
    return svg(
      s,
      s,
      `${clip}<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${d.color}" stroke-width="2"/><circle cx="${cx}" cy="${cx}" r="${r - 4}" fill="none" stroke="${d.color}" stroke-width="1"/>${txt(cx, cx - 6, s * 0.11, d.color, d.country.toUpperCase(), true)}${txt(cx, cx + 8, s * 0.065, d.color, d.date)}`,
    );
  },
  // 2. Oval
  (d, s) => {
    const w = s,
      h = s * 0.6,
      cx = w / 2,
      cy = h / 2,
      rx = w / 2 - 4,
      ry = h / 2 - 4;
    const clip = d.img
      ? imgClip(
          'o',
          `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 5}" ry="${ry - 5}"/>`,
        ) +
        imgEl('o', d.img, cx - rx + 5, cy - ry + 5, (rx - 5) * 2, (ry - 5) * 2)
      : '';
    return svg(
      w,
      h,
      `${clip}<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${d.color}" stroke-width="2"/>${txt(cx, cy - 2, s * 0.09, d.color, d.country.toUpperCase(), true)}${txt(cx, cy + 10, s * 0.055, d.color, d.date)}`,
    );
  },
  // 3. Rectangle
  (d, s) => {
    const w = s,
      h = s * 0.55,
      p = 4;
    const clip = d.img
      ? imgClip(
          'r',
          `<rect x="${p + 3}" y="${p + 3}" width="${w - p * 2 - 6}" height="${h - p * 2 - 6}"/>`,
        ) + imgEl('r', d.img, p + 3, p + 3, w - p * 2 - 6, h - p * 2 - 6)
      : '';
    return svg(
      w,
      h,
      `${clip}<rect x="${p}" y="${p}" width="${w - p * 2}" height="${h - p * 2}" fill="none" stroke="${d.color}" stroke-width="2"/>${txt(w / 2, h * 0.42, s * 0.1, d.color, d.country.toUpperCase(), true)}${txt(w / 2, h * 0.72, s * 0.06, d.color, d.date)}`,
    );
  },
  // 4. Double circle
  (d, s) => {
    const cx = s / 2,
      r = s / 2 - 4,
      ir = r - 10;
    const arc = `M ${cx - r + 8} ${cx} A ${r - 8} ${r - 8} 0 1 1 ${cx + r - 8} ${cx}`;
    const clip = d.img
      ? imgClip('d', `<circle cx="${cx}" cy="${cx}" r="${ir}"/>`) +
        imgEl('d', d.img, cx - ir, cx - ir, ir * 2, ir * 2)
      : '';
    return svg(
      s,
      s,
      `<defs><path id="arc" d="${arc}"/></defs>${clip}<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${d.color}" stroke-width="2"/><circle cx="${cx}" cy="${cx}" r="${r - 5}" fill="none" stroke="${d.color}" stroke-width="1"/><text fill="${d.color}" font-family="Arial" font-size="${s * 0.055}" font-weight="bold"><textPath href="#arc" startOffset="50%" text-anchor="middle">${d.country.toUpperCase()}</textPath></text>${txt(cx, cx + 5, s * 0.07, d.color, d.date, true)}`,
    );
  },
  // 5. Square
  (d, s) => {
    const sz = s * 0.9,
      p = 4,
      off = (s - sz) / 2;
    const clip = d.img
      ? imgClip(
          's',
          `<rect x="${off + p + 3}" y="${off + p + 3}" width="${sz - p * 2 - 6}" height="${sz - p * 2 - 6}" rx="3"/>`,
        ) +
        imgEl(
          's',
          d.img,
          off + p + 3,
          off + p + 3,
          sz - p * 2 - 6,
          sz - p * 2 - 6,
        )
      : '';
    return svg(
      s,
      s,
      `${clip}<rect x="${off + p}" y="${off + p}" width="${sz - p * 2}" height="${sz - p * 2}" rx="4" fill="none" stroke="${d.color}" stroke-width="2"/>${txt(s / 2, s / 2 - 4, s * 0.1, d.color, d.country.toUpperCase(), true)}${txt(s / 2, s / 2 + 10, s * 0.055, d.color, d.date)}`,
    );
  },
  // 6. Triangle
  (d, s) => {
    const h = s * 0.85,
      pts = `${s / 2},8 8,${h - 4} ${s - 8},${h - 4}`;
    const clip = d.img
      ? imgClip(
          't',
          `<polygon points="${s / 2},20 20,${h - 12} ${s - 20},${h - 12}"/>`,
        ) + imgEl('t', d.img, 15, 15, s - 30, h - 25)
      : '';
    return svg(
      s,
      h,
      `${clip}<polygon points="${pts}" fill="none" stroke="${d.color}" stroke-width="2"/>${txt(s / 2, h * 0.45, s * 0.09, d.color, d.country.toUpperCase(), true)}${txt(s / 2, h * 0.62, s * 0.055, d.color, d.date)}`,
    );
  },
  // 7. Hexagon
  (d, s) => {
    const cx = s / 2,
      r = s / 2 - 5,
      ir = r - 8,
      pts = polyPts(cx, cx, r, 6, -Math.PI / 2);
    const clip = d.img
      ? imgClip('h', `<circle cx="${cx}" cy="${cx}" r="${ir}"/>`) +
        imgEl('h', d.img, cx - ir, cx - ir, ir * 2, ir * 2)
      : '';
    return svg(
      s,
      s,
      `${clip}<polygon points="${pts}" fill="none" stroke="${d.color}" stroke-width="2"/>${txt(cx, cx - 4, s * 0.09, d.color, d.country.toUpperCase(), true)}${txt(cx, cx + 10, s * 0.055, d.color, d.date)}`,
    );
  },
  // 8. Oval vertical
  (d, s) => {
    const w = s * 0.65,
      h = s,
      cx = w / 2,
      cy = h / 2,
      rx = w / 2 - 4,
      ry = h / 2 - 4;
    const clip = d.img
      ? imgClip(
          'ov',
          `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 5}" ry="${ry - 5}"/>`,
        ) +
        imgEl('ov', d.img, cx - rx + 5, cy - ry + 5, (rx - 5) * 2, (ry - 5) * 2)
      : '';
    return svg(
      w,
      h,
      `${clip}<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${d.color}" stroke-width="2"/>${txt(cx, cy - 8, s * 0.08, d.color, d.country.toUpperCase(), true)}${txt(cx, cy + 6, s * 0.05, d.color, d.date)}${txt(cx, cy + 16, s * 0.04, d.color, d.city)}`,
    );
  },
  // 9. Diamond
  (d, s) => {
    const cx = s / 2,
      pts = `${cx},6 ${s - 6},${cx} ${cx},${s - 6} 6,${cx}`,
      ir = s / 3;
    const clip = d.img
      ? imgClip('dm', `<circle cx="${cx}" cy="${cx}" r="${ir}"/>`) +
        imgEl('dm', d.img, cx - ir, cx - ir, ir * 2, ir * 2)
      : '';
    return svg(
      s,
      s,
      `${clip}<polygon points="${pts}" fill="none" stroke="${d.color}" stroke-width="2"/>${txt(cx, cx - 2, s * 0.08, d.color, d.country.toUpperCase(), true)}${txt(cx, cx + 10, s * 0.05, d.color, d.date)}`,
    );
  },
  // 10. Octagon
  (d, s) => {
    const cx = s / 2,
      r = s / 2 - 5,
      ir = r - 6,
      pts = polyPts(cx, cx, r, 8, -Math.PI / 8);
    const clip = d.img
      ? imgClip('oc', `<circle cx="${cx}" cy="${cx}" r="${ir}"/>`) +
        imgEl('oc', d.img, cx - ir, cx - ir, ir * 2, ir * 2)
      : '';
    return svg(
      s,
      s,
      `${clip}<polygon points="${pts}" fill="none" stroke="${d.color}" stroke-width="2"/>${txt(cx, cx - 4, s * 0.09, d.color, d.country.toUpperCase(), true)}${txt(cx, cx + 10, s * 0.055, d.color, d.date)}`,
    );
  },
];

// Image processing
async function fetchLandmarkImage(wikiTitle: string): Promise<Buffer | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Referer: 'https://en.wikipedia.org/',
        },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const url = data.thumbnail?.source?.replace(/\/\d+px-/, '/400px-');
    if (!url) return null;
    const imgRes = await fetch(url, {
      headers: { Referer: 'https://en.wikipedia.org/' },
    });
    return imgRes.ok ? Buffer.from(await imgRes.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

async function processImage(
  buf: Buffer,
  size: number,
  color: string,
): Promise<string> {
  const [r, g, b] = [
    color.slice(1, 3),
    color.slice(3, 5),
    color.slice(5, 7),
  ].map((h) => parseInt(h, 16));
  const { data, info } = await sharp(buf)
    .resize(Math.floor(size * 0.6), Math.floor(size * 0.6), { fit: 'cover' })
    .grayscale()
    .blur(0.8)
    .linear(0.9, 25.5)
    .resize(size, size, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i++) {
    const blend = Math.min(1, (data[i] / 255) * 0.6 + 0.55);
    const j = i * 4;
    out[j] = Math.round(r + (255 - r) * blend);
    out[j + 1] = Math.round(g + (255 - g) * blend);
    out[j + 2] = Math.round(b + (255 - b) * blend);
    out[j + 3] = 255;
  }
  return `data:image/png;base64,${(
    await sharp(out, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toBuffer()
  ).toString('base64')}`;
}

async function addWornEffect(buf: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] > 0) {
      const noise = ((Math.random() * 30) | 0) - 15;
      pixels[i] = Math.max(0, Math.min(255, pixels[i] + noise));
      pixels[i + 1] = Math.max(0, Math.min(255, pixels[i + 1] + noise));
      pixels[i + 2] = Math.max(0, Math.min(255, pixels[i + 2] + noise));
      if (Math.random() < 0.15)
        pixels[i + 3] = Math.max(0, pixels[i + 3] - ((Math.random() * 80) | 0));
      if (Math.random() < 0.03)
        pixels[i + 3] = Math.max(
          0,
          pixels[i + 3] - ((Math.random() * 150) | 0),
        );
    }
  }
  return sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

export async function generateStamp(
  countryCode: string,
  size = 80,
): Promise<Buffer> {
  const country = VISITED_COUNTRIES[countryCode];
  if (!country) throw new Error(`Unknown country: ${countryCode}`);

  const color = getColor(countryCode);
  const cacheKey = `v${CACHE_VERSION}-${countryCode}-${size}`;

  let img = imageCache.get(cacheKey);
  if (!img) {
    const buf = await fetchLandmarkImage(country.wikiTitle);
    if (buf) {
      img = await processImage(buf, size, color);
      imageCache.set(cacheKey, img);
    }
  }

  const data: StampData = {
    country: country.name,
    city: country.city,
    date: getDate(countryCode),
    color,
    img,
  };
  const svgStr = generators[getVariation(countryCode)](data, size);
  const rendered = await sharp(Buffer.from(svgStr)).png().toBuffer();

  return addWornEffect(rendered);
}
