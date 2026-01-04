/**
 * Script to fetch Spotify URLs for concert artists
 * Run with: npx tsx --env-file=.env.local scripts/get-concert-spotify-urls.ts
 */

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('Missing Spotify credentials in environment');
  console.error(
    'Make sure to run with: npx tsx --env-file=.env.local scripts/get-concert-spotify-urls.ts',
  );
  process.exit(1);
}

const concerts = [
  { artist: 'Bladee', location: 'Vienna' },
  { artist: 'Snow Strippers', location: 'Brussels' },
  { artist: 'Röyksopp', location: 'Šibenik' },
  { artist: 'The Hellp', location: 'Katowice' },
  { artist: 'Ecco2k', location: 'Katowice' },
  { artist: 'Have a Nice Life', location: 'Katowice' },
  { artist: 'Panchiko', location: 'Katowice' },
  { artist: 'Kraftwerk', location: 'Katowice' },
  { artist: '2hollis', location: 'Dublin' },
  { artist: 'JPEGMAFIA', location: 'Milano' },
  { artist: 'The Voidz', location: 'NYC' },
  { artist: 'Xiu Xiu', location: 'NYC' },
];

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN!,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

async function searchArtist(
  accessToken: string,
  artistName: string,
): Promise<{ name: string; url: string } | null> {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();

  if (!data.artists?.items?.length) {
    return null;
  }

  const artist = data.artists.items[0];
  return {
    name: artist.name,
    url: artist.external_urls.spotify,
  };
}

async function main() {
  console.log('Fetching Spotify URLs for concert artists...\n');

  const accessToken = await getAccessToken();
  const results: Record<string, string> = {};

  for (const concert of concerts) {
    const result = await searchArtist(accessToken, concert.artist);
    if (result) {
      results[concert.artist] = result.url;
      console.log(`✓ ${concert.artist}: ${result.url}`);
    } else {
      console.log(`✗ ${concert.artist}: NOT FOUND`);
    }
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\n\n// Paste this into your concerts data:\n');
  console.log('const SPOTIFY_URLS: Record<string, string> = {');
  for (const [artist, url] of Object.entries(results)) {
    console.log(`  '${artist}': '${url}',`);
  }
  console.log('};');
}

main().catch(console.error);
