import { NextResponse } from 'next/server';

import { getCurrentlyPlaying } from 'lib/spotify';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const currentlyPlaying = await getCurrentlyPlaying();

    if (!currentlyPlaying) {
      return NextResponse.json(
        { isPlaying: false },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
          },
        }
      );
    }

    return NextResponse.json(currentlyPlaying, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error in now-playing endpoint:', error);
    return NextResponse.json(
      { isPlaying: false, error: 'Failed to fetch currently playing' },
      { status: 500 }
    );
  }
}
