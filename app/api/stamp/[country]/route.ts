import { NextRequest, NextResponse } from 'next/server';

import { VISITED_COUNTRIES, VISITED_COUNTRY_CODES } from 'lib/countries';
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
        supported: VISITED_COUNTRY_CODES,
      },
      { status: 400 },
    );
  }

  try {
    // Get width from query params (default 150, height will be 4/3 of width)
    const { searchParams } = new URL(request.url);
    const width = Math.min(
      Math.max(parseInt(searchParams.get('width') || '150'), 100),
      400,
    );

    const stampBuffer = await generateStamp(countryCode, width);

    return new NextResponse(stampBuffer, {
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
