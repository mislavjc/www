import { getTopArtists } from 'lib/spotify';

export async function GET() {
  try {
    const artists = await getTopArtists();
    return Response.json(artists, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Failed to fetch top artists:', error);
    return Response.json(
      { error: 'Failed to fetch top artists' },
      { status: 500 },
    );
  }
}
