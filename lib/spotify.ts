import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

export interface CurrentlyPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

async function getAccessToken() {
  if (!SPOTIFY_REFRESH_TOKEN) {
    throw new Error('No refresh token available');
  }

  spotifyApi.setRefreshToken(SPOTIFY_REFRESH_TOKEN);

  const data = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(data.body.access_token);

  return data.body.access_token;
}

export async function getCurrentlyPlaying(): Promise<CurrentlyPlaying | null> {
  try {
    await getAccessToken();

    const response = await spotifyApi.getMyCurrentPlayingTrack();

    if (!response.body || !response.body.item || !response.body.is_playing) {
      return null;
    }

    const track = response.body.item as SpotifyApi.TrackObjectFull;

    return {
      isPlaying: response.body.is_playing,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      albumImageUrl: track.album.images[0]?.url || '',
      songUrl: track.external_urls.spotify,
    };
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    return null;
  }
}

export function getAuthUrl() {
  const scopes = ['user-read-currently-playing', 'user-read-playback-state'];
  return spotifyApi.createAuthorizeURL(scopes, 'state');
}
