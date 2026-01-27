'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { useMap } from 'components/ui/map';

import { VISITED_COUNTRY_CODES, VISITED_COUNTRY_COUNT } from 'lib/countries';

// Loading placeholder for map
const MapLoading = () => (
  <div className="flex h-full w-full items-center justify-center bg-stone-100">
    <div className="font-mono text-xs text-stone-600">Loading map…</div>
  </div>
);

// Dynamically import Map to reduce initial bundle (~500KB maplibre-gl)
const MapComponent = dynamic(
  () => import('components/ui/map').then((mod) => mod.Map),
  { ssr: false, loading: () => <MapLoading /> },
);
const MapControls = dynamic(
  () => import('components/ui/map').then((mod) => mod.MapControls),
  { ssr: false },
);

const VISITED_SET = new Set(VISITED_COUNTRY_CODES);

// Use 110m resolution (~200KB) instead of 50m (~4MB) - sufficient for world map
const COUNTRIES_GEOJSON_URL =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson';

const MAP_CONFIG = {
  center: [0, 20] as [number, number],
  zoom: 1.5,
  minZoom: 1,
  maxZoom: 6,
};

function VisitedCountriesLayer() {
  const { map, isLoaded } = useMap();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const layersAddedRef = useRef(false);

  const addCountryLayers = useCallback(() => {
    if (!map || layersAddedRef.current) return;

    if (!map.getSource('countries')) {
      map.addSource('countries', {
        type: 'geojson',
        data: COUNTRIES_GEOJSON_URL,
      });
    }

    const layers = map.getStyle()?.layers || [];
    const labelLayer = layers.find(
      (l) => l.type === 'symbol' && l.id.includes('label'),
    );

    if (!map.getLayer('visited-countries-fill')) {
      map.addLayer(
        {
          id: 'visited-countries-fill',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': [
              'case',
              ['in', ['get', 'iso_a3'], ['literal', VISITED_COUNTRY_CODES]],
              '#78716c',
              'transparent',
            ],
            'fill-opacity': [
              'case',
              ['in', ['get', 'iso_a3'], ['literal', VISITED_COUNTRY_CODES]],
              0.4,
              0,
            ],
          },
        },
        labelLayer?.id,
      );
    }

    if (!map.getLayer('visited-countries-outline')) {
      map.addLayer(
        {
          id: 'visited-countries-outline',
          type: 'line',
          source: 'countries',
          paint: {
            'line-color': [
              'case',
              ['in', ['get', 'iso_a3'], ['literal', VISITED_COUNTRY_CODES]],
              '#57534e',
              'transparent',
            ],
            'line-width': [
              'case',
              ['in', ['get', 'iso_a3'], ['literal', VISITED_COUNTRY_CODES]],
              1.5,
              0,
            ],
          },
        },
        labelLayer?.id,
      );
    }

    layersAddedRef.current = true;
  }, [map]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (map.isStyleLoaded()) {
      addCountryLayers();
    } else {
      map.once('styledata', addCountryLayers);
    }

    const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
      if (!layersAddedRef.current) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['visited-countries-fill'],
      });

      if (
        features.length > 0 &&
        VISITED_SET.has(features[0].properties?.iso_a3)
      ) {
        setHoveredCountry(features[0].properties?.name);
        map.getCanvas().style.cursor = 'pointer';
      } else {
        setHoveredCountry(null);
        map.getCanvas().style.cursor = '';
      }
    };

    map.on('mousemove', handleMouseMove);

    return () => {
      map.off('mousemove', handleMouseMove);
      map.off('styledata', addCountryLayers);
    };
  }, [map, isLoaded, addCountryLayers]);

  if (!hoveredCountry) return null;

  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex justify-center">
      <div className="whitespace-nowrap rounded-full bg-black/50 px-4 py-2 text-center text-xs text-white/70 backdrop-blur-sm">
        {hoveredCountry}
      </div>
    </div>
  );
}

// Deterministic rotation based on country code
function getStampRotation(code: string): number {
  const hash = code.charCodeAt(0) + code.charCodeAt(1) * 2 + code.charCodeAt(2);
  return ((hash % 12) - 6) * 0.8; // subtle: -5 to +5 degrees
}

function PassportPage({ countries }: { countries: string[] }) {
  return (
    <div className="relative flex-1 bg-[#f8f5ef] p-6">
      {/* Subtle security pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 10px)',
        }}
      />

      {/* Stamps grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {countries.map((code) => (
          <div
            key={code}
            className="relative"
            style={{ transform: `rotate(${getStampRotation(code)}deg)` }}
          >
            <Image
              src={`/api/stamp/${code.toLowerCase()}?width=100`}
              alt={`${code} stamp`}
              width={100}
              height={100}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Passport() {
  const midPoint = Math.ceil(VISITED_COUNTRY_CODES.length / 2);
  const leftPage = VISITED_COUNTRY_CODES.slice(0, midPoint);
  const rightPage = VISITED_COUNTRY_CODES.slice(midPoint);

  return (
    <div className="mt-8">
      {/* Passport spread */}
      <div className="overflow-hidden rounded-sm shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Left page */}
          <div className="border-b border-stone-200 sm:border-b-0 sm:border-r">
            <PassportPage countries={leftPage} />
          </div>
          {/* Right page - stretch to match left */}
          <div className="flex">
            <PassportPage countries={rightPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Travel = () => {
  return (
    <section id="travel" className="scroll-mt-24 py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-600">4</span>
        <h2 className="text-balance font-serif text-3xl text-stone-900">Travel</h2>
      </div>

      <p className="mb-4 max-w-xl text-stone-600">
        I don&apos;t know what it is but there&apos;s something freeing about
        being somewhere new. Doesn&apos;t have to be far either, even just
        crossing to Ljubljana does it. I just like wandering around with no
        plan, getting lost in neighborhoods. And this is weird but I love
        checking out stores in foreign countries. You learn so much about a
        place from them. The Spätis in Berlin where you grab a euro beer and sit
        by the river, bodegas in NYC, meal deals in the UK.
      </p>

      <p className="mb-4 max-w-xl text-stone-600">
        Berlin is probably my favorite place in Europe. It&apos;s rough compared
        to somewhere like Hamburg, but every neighborhood feels like its own
        world. Kreuzberg, Prenzlauer Berg, completely different vibes. I keep
        going back partly for the city but honestly mostly for Heimweh. My
        friends are so tired of hearing about it but the kumpir there is unreal.
        The portion is massive, you need to show up starving and even then you
        might not finish it.
      </p>

      <p className="mb-8 max-w-xl text-stone-600">
        Last time I went I was staying in Hamburg but took a Flixtrain just for
        a day trip. I&apos;d been at the bunker club until 5am, train was at 7,
        felt like a zombie until I got there. But that kumpir was the mission
        and it delivered. Trying to finish all 45 European countries by end of
        next year. 15 left, god bless Ryanair.
      </p>

      <div className="relative mb-4 h-[400px] w-full overflow-hidden rounded-2xl border border-stone-200">
        <MapComponent
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.zoom}
          minZoom={MAP_CONFIG.minZoom}
          maxZoom={MAP_CONFIG.maxZoom}
        >
          <MapControls position="top-right" showZoom />
          <VisitedCountriesLayer />
        </MapComponent>
      </div>

      <div className="flex items-center gap-4 text-sm text-stone-600">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-stone-500/40 ring-1 ring-stone-600" />
          <span>Visited ({VISITED_COUNTRY_COUNT} countries)</span>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="font-serif text-xl text-stone-900">Passport</h3>
        <p className="mt-2 text-stone-600">
          My passport is a mess but here&apos;s a cleaner version.
        </p>
      </div>

      <Passport />
    </section>
  );
};
