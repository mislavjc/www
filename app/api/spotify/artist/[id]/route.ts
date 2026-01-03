const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
).toString('base64');

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

type SpotifyArtist = {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: {
    spotify: string;
  };
};

const getAccessToken = async (): Promise<{ access_token: string }> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN!,
    }),
  });

  return response.json();
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { access_token } = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 86400 },
    });

    if (response.status !== 200) {
      return Response.json({ error: 'Artist not found' }, { status: 404 });
    }

    const artist: SpotifyArtist = await response.json();

    return Response.json({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url ?? '',
      spotifyUrl: artist.external_urls.spotify,
    });
  } catch {
    return Response.json({ error: 'Failed to fetch artist' }, { status: 500 });
  }
}
