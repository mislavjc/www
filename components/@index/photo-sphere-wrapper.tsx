'use client';

import dynamic from 'next/dynamic';

interface PhotoExif {
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: string | null;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
  } | null;
  dateTime: string | null;
}

interface PhotoData {
  uuid: string;
  w: number;
  h: number;
  exif?: PhotoExif;
}

const PhotoSphereLoading = () => (
  <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-stone-900 md:aspect-[4/3]">
    <div className="font-mono text-xs text-stone-400">Loading sphere…</div>
  </div>
);

// Dynamic import Three.js PhotoSphere to reduce initial bundle (~500KB)
const PhotoSphere = dynamic(
  () => import('./photo-sphere').then((mod) => mod.PhotoSphere),
  {
    ssr: false,
    loading: () => <PhotoSphereLoading />,
  },
);

interface PhotoSphereWrapperProps {
  photos: PhotoData[];
}

export const PhotoSphereWrapper = ({ photos }: PhotoSphereWrapperProps) => {
  return <PhotoSphere photos={photos} />;
};
