const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TOP_ARTISTS_ENDPOINT =
  'https://api.spotify.com/v1/me/top/artists?limit=10';

export type TopArtist = {
  id: string;
  name: string;
  imageUrl: string;
  spotifyUrl: string;
  genres: string[];
};

type SpotifyArtist = {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: {
    spotify: string;
  };
  genres: string[];
};

// Fallback artists if API fails or credentials missing
export const FALLBACK_ARTISTS: TopArtist[] = [
  {
    id: '1',
    name: 'Ecco2k',
    imageUrl: '',
    spotifyUrl: 'https://open.spotify.com/artist/2PFwpFFaq3MKUoJwyLV6mX',
    genres: ['cloud rap'],
  },
  {
    id: '2',
    name: 'Bladee',
    imageUrl: '',
    spotifyUrl: 'https://open.spotify.com/artist/2xvtxDNInKDV4AvGmBWetG',
    genres: ['cloud rap'],
  },
  {
    id: '3',
    name: 'Snow Strippers',
    imageUrl: '',
    spotifyUrl: 'https://open.spotify.com/artist/3kE3U3sGs4RVm2avqvEzNq',
    genres: ['hyperpop'],
  },
  {
    id: '4',
    name: 'The Hellp',
    imageUrl: '',
    spotifyUrl: 'https://open.spotify.com/artist/0p5axFPoJUrCxbYFnvZndL',
    genres: ['experimental'],
  },
  {
    id: '5',
    name: 'Jane Remover',
    imageUrl: '',
    spotifyUrl: 'https://open.spotify.com/artist/6BHjLkset1g0F1jJeTmPnA',
    genres: ['hyperpop'],
  },
  {
    id: '6',
    name: 'Crystal Castles',
    imageUrl: '',
    spotifyUrl: 'https://open.spotify.com/artist/5Pf8wkS5sKFEEOzLKUBx2o',
    genres: ['electronic'],
  },
  {
    id: '7',
    name: 'JPEGMAFIA',
    imageUrl: '',
    spotifyUrl: 'https://open.spotify.com/artist/6yJ6QQ3Y5l0s0tn7b0arrO',
    genres: ['experimental hip hop'],
  },
  {
    id: '8',
    name: 'Fakemink',
    imageUrl: '',
    spotifyUrl: 'https://open.spotify.com/artist/7i3J5qCQnPxUF0ZfYZOFhH',
    genres: ['electronic'],
  },
];

const getAccessToken = async (): Promise<{ access_token: string }> => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Missing Spotify credentials');
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  return response.json();
};

export const getTopArtists = async (): Promise<TopArtist[]> => {
  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(TOP_ARTISTS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (response.status !== 200) {
      return FALLBACK_ARTISTS;
    }

    const data = await response.json();

    if (!data.items?.length) {
      return FALLBACK_ARTISTS;
    }

    return data.items.map((artist: SpotifyArtist) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url ?? '',
      spotifyUrl: artist.external_urls.spotify,
      genres: artist.genres,
    }));
  } catch {
    return FALLBACK_ARTISTS;
  }
};
