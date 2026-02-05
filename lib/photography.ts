import { cacheLife, cacheTag } from 'next/cache';

const R2_URL = 'https://r2.photography.mislavjc.com';

export const GRID_WIDTHS = [160, 240, 320, 360, 480, 640, 800, 960] as const;
export const LARGE_WIDTHS = [
  256, 384, 512, 768, 1024, 1280, 1536, 1920, 2560,
] as const;

type Format = 'avif' | 'webp' | 'jpeg';
type Profile = 'grid' | 'large';

export interface ManifestEntry {
  blurhash: string;
  w: number;
  h: number;
  exif: {
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
  };
}

export interface Manifest {
  [uuid: string]: ManifestEntry;
}

export interface Photo extends ManifestEntry {
  uuid: string;
}

// Cache the processed (smaller) result instead of the raw 5MB manifest
export async function getPhotos(): Promise<Photo[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('photos', 'photo-manifest');

  const res = await fetch(`${R2_URL}/variants/r2-manifest.json`);
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`);

  const manifest: Manifest = await res.json();
  const photos = Object.entries(manifest).map(([filename, data]) => ({
    uuid: filename.replace('.jpg', ''),
    ...data,
  }));

  // Sort by date and return only recent photos to keep cache small
  return photos
    .filter((p) => p.exif.dateTime)
    .sort(
      (a, b) =>
        new Date(b.exif.dateTime!).getTime() -
        new Date(a.exif.dateTime!).getTime(),
    )
    .slice(0, 100);
}

export function getPhotoUrl(
  uuid: string,
  options: {
    profile?: Profile;
    format?: Format;
    width?: number;
  } = {},
): string {
  const { profile = 'large', format = 'jpeg', width = 1920 } = options;
  const ext = format;
  return `${R2_URL}/variants/${profile}/${format}/${width}/${uuid}.${ext}`;
}

// srcSet helper for <picture> element
export function getSrcSet(
  uuid: string,
  profile: Profile = 'large',
  format: Format = 'webp',
): string {
  const widths = profile === 'grid' ? GRID_WIDTHS : LARGE_WIDTHS;
  return widths
    .map((w) => `${getPhotoUrl(uuid, { profile, format, width: w })} ${w}w`)
    .join(', ');
}
