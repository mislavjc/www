// Shared data for hero and section components

export const concerts = [
  {
    date: '2025-12-07',
    artist: 'Bladee',
    location: 'Vienna',
    spotifyUrl: 'https://open.spotify.com/artist/2xvtxDNInKDV4AvGmjw6d1',
  },
  {
    date: '2025-12-01',
    artist: 'Snow Strippers',
    location: 'Brussels',
    spotifyUrl: 'https://open.spotify.com/artist/6TsAG8Ve1icEC8ydeHm3C8',
  },
  {
    date: '2025-08-05',
    artist: 'Röyksopp',
    location: 'Šibenik',
    spotifyUrl: 'https://open.spotify.com/artist/5nPOO9iTcrs9k6yFffPxjH',
  },
  {
    date: '2025-08-03',
    artist: 'The Hellp',
    location: 'Katowice',
    spotifyUrl: 'https://open.spotify.com/artist/5DslL3PUa3BcRlCCEP64A4',
  },
  {
    date: '2025-08-02',
    artist: 'Ecco2k / Have a Nice Life / Panchiko',
    location: 'Katowice',
    spotifyUrl: 'https://open.spotify.com/artist/6hG0VsXXlD10l60TqiIHIX',
  },
  {
    date: '2025-08-01',
    artist: 'Kraftwerk',
    location: 'Katowice',
    spotifyUrl: 'https://open.spotify.com/artist/0dmPX6ovclgOy8WWJaFEUU',
  },
  {
    date: '2025-05-22',
    artist: '2hollis',
    location: 'Dublin',
    spotifyUrl: 'https://open.spotify.com/artist/72NhFAGG5Pt91VbheJeEPG',
  },
  {
    date: '2025-01-25',
    artist: 'Röyksopp',
    location: 'Milano',
    spotifyUrl: 'https://open.spotify.com/artist/5nPOO9iTcrs9k6yFffPxjH',
  },
  {
    date: '2025-01-22',
    artist: 'JPEGMAFIA',
    location: 'Milano',
    spotifyUrl: 'https://open.spotify.com/artist/6yJ6QQ3Y5l0s0tn7b0arrO',
  },
  {
    date: '2024-11-12',
    artist: 'Snow Strippers',
    location: 'Amsterdam',
    spotifyUrl: 'https://open.spotify.com/artist/6TsAG8Ve1icEC8ydeHm3C8',
  },
  {
    date: '2024-10-21',
    artist: 'The Voidz',
    location: 'NYC',
    spotifyUrl: 'https://open.spotify.com/artist/4nUBBtLtzqZGpdiynTJbYJ',
  },
  {
    date: '2024-10-17',
    artist: 'Bladee',
    location: 'NYC',
    spotifyUrl: 'https://open.spotify.com/artist/2xvtxDNInKDV4AvGmjw6d1',
  },
  {
    date: '2024-10-15',
    artist: 'Xiu Xiu',
    location: 'Brooklyn',
    spotifyUrl: 'https://open.spotify.com/artist/47p4dAOxeClUKIoVgb0BWU',
  },
];

export const projects = [
  {
    name: 'stamped.today',
    description:
      'Collect stamps of your favorite artists with their monthly listener count frozen in time.',
    url: 'https://stamped.today',
    favicon: '💿',
    highlight: true as const,
    type: 'web' as const,
  },
  {
    name: 'Constellator',
    description:
      'AI-powered CLI that transforms GitHub stars into organized Awesome lists.',
    url: 'https://github.com/mislavjc/constellator',
    favicon: '⭐',
    highlight: false as const,
    type: 'cli' as const,
  },
  {
    name: 'Photography',
    description:
      'Personal photography portfolio. Next.js, Cloudflare R2, Effect.',
    url: 'https://photography.mislavjc.com',
    favicon: '📷',
    highlight: false as const,
    type: 'web' as const,
  },
  {
    name: 'Cadro',
    description:
      'Add clean borders to images with precise controls and live preview.',
    url: 'https://cadro.us',
    favicon: '🖼️',
    highlight: false as const,
    type: 'web' as const,
  },
  {
    name: 'ACJ AIMS',
    description:
      'Corporate website for consulting company. Next.js, Prismic CMS.',
    url: 'https://www.acj-aims.hr/',
    favicon: '💼',
    highlight: false as const,
    type: 'web' as const,
  },
];

// Config
export const currentLocation = 'Zagreb';

// Helper to get the most recent past concert
export function getLastConcert() {
  const now = new Date();
  const pastConcerts = concerts.filter((c) => new Date(c.date) <= now);
  return pastConcerts[0] || concerts[concerts.length - 1];
}

// Helper to get the current/featured project (first one with highlight or just first)
export function getCurrentProject() {
  return projects.find((p) => p.highlight) || projects[0];
}
