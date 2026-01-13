'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

type SpotifyData = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  duration?: number;
  progress?: number;
};

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const SpotifyIsland = () => {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSpotify = useCallback(async () => {
    try {
      const response = await fetch('/api/spotify');
      const json = await response.json();
      setData(json);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch Spotify data:', error);
      }
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpotify();

    const startPolling = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchSpotify, 30000);
      }
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchSpotify(); // Fetch immediately when becoming visible
        startPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchSpotify]);

  if (isLoading || !data?.title) {
    return null;
  }

  const progress =
    data.progress && data.duration && data.duration > 0
      ? (data.progress / data.duration) * 100
      : 0;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 md:bottom-6 md:left-6 md:top-auto md:translate-x-0">
      <motion.button
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start gap-3 bg-stone-900 text-stone-50 shadow-lg"
        style={{
          borderRadius: 22,
          padding: isExpanded ? 12 : 8,
          paddingRight: isExpanded ? 12 : 16,
        }}
        transition={{
          layout: {
            type: 'spring',
            stiffness: 500,
            damping: 35,
          },
        }}
      >
        {/* Album art */}
        <motion.div
          layout
          className="relative shrink-0 overflow-hidden"
          style={{
            borderRadius: 12,
            width: isExpanded ? 96 : 36,
            height: isExpanded ? 96 : 36,
          }}
          transition={{
            layout: {
              type: 'spring',
              stiffness: 500,
              damping: 35,
            },
          }}
        >
          {data.albumImageUrl && (
            <Image
              src={data.albumImageUrl}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          layout
          className="flex min-w-0 flex-col items-start py-0.5 text-left"
          transition={{
            layout: {
              type: 'spring',
              stiffness: 500,
              damping: 35,
            },
          }}
        >
          <motion.span
            layout="position"
            className="text-[10px] uppercase tracking-wider text-stone-400"
          >
            {data.isPlaying ? 'Now playing' : 'Last played'}
          </motion.span>

          {isExpanded ? (
            <motion.div
              layout
              className="flex w-full flex-col gap-0.5 pr-2"
              style={{ width: 220 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <span className="truncate text-sm font-medium leading-tight">
                {data.title}
              </span>
              <span className="truncate text-xs text-stone-300">
                {data.artist}
              </span>
              <span className="truncate text-xs text-stone-400">
                {data.album}
              </span>

              {/* Progress bar */}
              {data.duration && (
                <div className="mt-2 w-full">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-stone-700">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-stone-400">
                    <span>
                      {data.progress ? formatTime(data.progress) : '0:00'}
                    </span>
                    <span>{formatTime(data.duration)}</span>
                  </div>
                </div>
              )}

              {data.songUrl && (
                <a
                  href={data.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 text-[10px] uppercase tracking-wider text-green-500 transition-colors hover:text-green-400"
                >
                  Open in Spotify
                </a>
              )}
            </motion.div>
          ) : (
            <motion.span
              layout="position"
              className="max-w-[180px] truncate text-sm leading-tight"
            >
              {data.title} - {data.artist}
            </motion.span>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};
