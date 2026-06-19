import { NextRequest, NextResponse } from 'next/server';

import { VISITED_COUNTRIES, VISITED_STAMP_CODES } from 'lib/countries';
import { generateStamp } from 'lib/stamp-generator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> },
) {
  const { country } = await params;
  const countryCode = country.toUpperCase();

  // Validate country code
  if (!VISITED_COUNTRIES[countryCode]) {
    return NextResponse.json(
      {
        error: 'Country not supported',
        supported: VISITED_STAMP_CODES,
      },
      { status: 400 },
    );
  }

  try {
    // Get width from query params (default 150, height will be 4/3 of width)
    const { searchParams } = new URL(request.url);
    const parsedWidth = parseInt(searchParams.get('width') || '150', 10);
    const width = Math.min(
      Math.max(Number.isNaN(parsedWidth) ? 150 : parsedWidth, 100),
      400,
    );

    const stampBuffer = await generateStamp(countryCode, width);

    // NextResponse's BodyInit no longer accepts Node's Buffer type directly;
    // a plain Uint8Array view satisfies it (and is correct for the web Response API).
    return new NextResponse(new Uint8Array(stampBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    });
  } catch (error) {
    console.error('Stamp generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate stamp',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
