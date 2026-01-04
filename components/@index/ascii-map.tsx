'use client';

import { useEffect, useState } from 'react';

// Static world map image - simple silhouette style
const WORLD_MAP_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/World_map_%28Miller_cylindrical_projection%2C_blank%29.svg/1280px-World_map_%28Miller_cylindrical_projection%2C_blank%29.svg.png';

export function AsciiMap() {
  const [ascii, setAscii] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function generateAscii() {
      try {
        // Dynamically import chafa-wasm
        const ChafaModule = (await import('chafa-wasm')).default;
        const chafa = await ChafaModule();

        // Fetch the world map image
        const response = await fetch(WORLD_MAP_URL);
        const arrayBuffer = await response.arrayBuffer();

        // Convert to ASCII using chafa
        const result = await new Promise<{ ansi: string }>(
          (resolve, reject) => {
            chafa.imageToAnsi(
              arrayBuffer,
              {
                width: 100,
                height: 30,
                fontRatio: 0.5,
                symbols: 'block+border+space',
                colors: chafa.ChafaCanvasMode.CHAFA_CANVAS_MODE_FGBG.value,
                fg: 0xa8a29e, // stone-400
                bg: 0x0c0a09, // stone-950
                fgOnly: false,
              },
              (err, res) => {
                if (err) reject(err);
                else resolve(res);
              },
            );
          },
        );

        if (mounted) {
          // Strip ANSI codes for plain text display
          const plainText = stripAnsi(result.ansi);
          setAscii(plainText);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to generate ASCII map:', err);
        if (mounted) {
          setError('Failed to load ASCII map');
          setLoading(false);
        }
      }
    }

    generateAscii();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-stone-950">
        <span className="font-mono text-xs text-stone-500">
          Generating ASCII map...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-stone-950">
        <span className="font-mono text-xs text-stone-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-stone-950 p-4">
      <pre className="mx-auto w-fit whitespace-pre font-mono text-[6px] leading-[1] text-stone-400 sm:text-[8px] md:text-[10px]">
        {ascii}
      </pre>
    </div>
  );
}

// Strip ANSI escape codes from string
function stripAnsi(str: string): string {
  const ESC = String.fromCharCode(27);
  const pattern = new RegExp(
    ESC.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\[[0-9;]*m',
    'g',
  );
  return str.replace(pattern, '');
}
