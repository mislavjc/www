import { getAccessToken } from 'lib/spotify';

type SpotifyArtist = {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: {
    spotify: string;
  };
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validate artist ID format (Spotify uses base62 encoding: A-Za-z0-9, 22 chars)
    if (!/^[a-zA-Z0-9]{22}$/.test(id)) {
      return Response.json({ error: 'Invalid artist ID' }, { status: 400 });
    }

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
