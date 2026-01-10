import { getAccessToken } from 'lib/spotify';

const NOW_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';

type SpotifyTrack = {
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: {
    spotify: string;
  };
};

type SpotifyResponse = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  duration?: number;
  progress?: number;
};

const getNowPlaying = async (): Promise<SpotifyResponse | null> => {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 60 },
  });

  if (response.status === 204 || response.status >= 400) {
    return null;
  }

  const data = await response.json();

  if (!data.item) {
    return null;
  }

  const track: SpotifyTrack = data.item;

  return {
    isPlaying: data.is_playing,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album.name,
    albumImageUrl: track.album.images[0]?.url ?? '',
    songUrl: track.external_urls.spotify,
    duration: track.duration_ms,
    progress: data.progress_ms,
  };
};

const getRecentlyPlayed = async (): Promise<SpotifyResponse | null> => {
  const { access_token } = await getAccessToken();

  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 60 },
  });

  if (response.status !== 200) {
    return null;
  }

  const data = await response.json();

  if (!data.items?.length) {
    return null;
  }

  const track: SpotifyTrack = data.items[0].track;

  return {
    isPlaying: false,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album.name,
    albumImageUrl: track.album.images[0]?.url ?? '',
    songUrl: track.external_urls.spotify,
  };
};

export async function GET() {
  try {
    let track = await getNowPlaying();

    if (!track) {
      track = await getRecentlyPlayed();
    }

    if (!track) {
      return Response.json({ isPlaying: false }, { status: 200 });
    }

    return Response.json(track);
  } catch {
    return Response.json({ isPlaying: false }, { status: 200 });
  }
}
