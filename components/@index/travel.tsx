'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Map as MapComponent, MapControls, useMap } from 'components/ui/map';

const VISITED_COUNTRIES = [
  'AUT',
  'BEL',
  'BIH',
  'CHE',
  'CYP',
  'CZE',
  'DEU',
  'DNK',
  'ESP',
  'FRA',
  'GBR',
  'GRC',
  'HRV',
  'HUN',
  'IRL',
  'ITA',
  'LIE',
  'MCO',
  'MLT',
  'NLD',
  'NOR',
  'POL',
  'PRT',
  'ROU',
  'SMR',
  'SRB',
  'SVK',
  'SVN',
  'SWE',
  'TUR',
  'VAT',
];

const VISITED_SET = new Set(VISITED_COUNTRIES);

const COUNTRIES_GEOJSON_URL =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson';

const MAP_CONFIG = {
  center: [15, 52] as [number, number],
  zoom: 2.8,
  minZoom: 2,
  maxZoom: 6,
  bounds: [
    [-15, 30],
    [45, 72],
  ] as [[number, number], [number, number]],
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
              ['in', ['get', 'iso_a3'], ['literal', VISITED_COUNTRIES]],
              '#78716c',
              'transparent',
            ],
            'fill-opacity': [
              'case',
              ['in', ['get', 'iso_a3'], ['literal', VISITED_COUNTRIES]],
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
              ['in', ['get', 'iso_a3'], ['literal', VISITED_COUNTRIES]],
              '#57534e',
              'transparent',
            ],
            'line-width': [
              'case',
              ['in', ['get', 'iso_a3'], ['literal', VISITED_COUNTRIES]],
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

export const Travel = () => {
  return (
    <section id="travel" className="py-24">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-stone-500">4</span>
        <h2 className="font-serif text-3xl text-stone-900">Travel</h2>
      </div>

      <p className="mb-8 max-w-xl text-stone-600">
        Countries I've visited across Europe. Started exploring more after
        getting into photography - there's something about new places that makes
        you see differently.
      </p>

      <div className="relative mb-4 h-[400px] w-full overflow-hidden rounded-2xl border border-stone-200">
        <MapComponent
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.zoom}
          maxBounds={MAP_CONFIG.bounds}
          minZoom={MAP_CONFIG.minZoom}
          maxZoom={MAP_CONFIG.maxZoom}
        >
          <MapControls position="top-right" showZoom />
          <VisitedCountriesLayer />
        </MapComponent>
      </div>

      <div className="flex items-center gap-4 text-sm text-stone-500">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-stone-500/40 ring-1 ring-stone-600" />
          <span>Visited ({VISITED_COUNTRIES.length} countries)</span>
        </div>
      </div>
    </section>
  );
};
