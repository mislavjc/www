'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type SpotifyData = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
};

export const SpotifyIsland = () => {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const response = await fetch('/api/spotify');
        const json = await response.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotify();

    const interval = setInterval(fetchSpotify, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !data?.title) {
    return null;
  }

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-full bg-stone-900 py-2 pl-2 pr-4 text-stone-50 transition-opacity hover:opacity-90"
    >
      {data.albumImageUrl && (
        <Image
          src={data.albumImageUrl}
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-full"
        />
      )}
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-stone-400">
          {data.isPlaying ? 'Now playing' : 'Last played'}
        </span>
        <span className="max-w-[180px] truncate text-sm">
          {data.title} — {data.artist}
        </span>
      </div>
    </a>
  );
};
