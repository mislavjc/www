import { getTopArtists } from 'lib/spotify';

export async function GET() {
  const artists = await getTopArtists();
  return Response.json(artists);
}
