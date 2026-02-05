import { getTopArtists } from 'lib/spotify';

import { TopArtists } from './music';

export const TopArtistsAsync = async () => {
  const artists = await getTopArtists();
  return <TopArtists artists={artists} />;
};
