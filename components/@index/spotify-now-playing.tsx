'use client';

import { Music } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export const SpotifyNowPlaying = () => {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching now playing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 60000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="my-6 flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <Music className="h-5 w-5 text-neutral-400" />
        <p className="text-sm text-neutral-500">Loading Spotify...</p>
      </div>
    );
  }

  if (!data.isPlaying || !data.title) {
    return (
      <div className="my-6 flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <Music className="h-5 w-5 text-neutral-400" />
        <p className="text-sm text-neutral-500">Not playing anything</p>
      </div>
    );
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="my-6 flex items-center gap-3 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 transition-all hover:border-green-300 hover:shadow-md"
    >
      {data.albumImageUrl && (
        <Image
          src={data.albumImageUrl}
          alt={`${data.album} cover`}
          width={48}
          height={48}
          className="rounded shadow-sm"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-green-600" />
          <p className="text-xs font-medium text-green-600">
            Now Playing on Spotify
          </p>
        </div>
        <p className="mt-1 text-sm font-medium text-neutral-900">
          {data.title}
        </p>
        <p className="text-xs text-neutral-600">{data.artist}</p>
      </div>
    </a>
  );
};
