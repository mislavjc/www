'use client';

import { useEffect, useRef, useState } from 'react';

export function AsciiMap() {
  const [ascii, setAscii] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let mounted = true;

    async function generateAscii() {
      try {
        // Dynamically import chafa-wasm
        const ChafaModule = (await import('chafa-wasm')).default;
        const chafa = await ChafaModule();

        // Create a simple world map on canvas
        const canvas = document.createElement('canvas');
        const width = 400;
        const height = 200;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Could not get canvas context');

        // Draw a simple world map silhouette
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#a8a29e';

        // Simplified continent shapes (rough approximations)
        // North America
        ctx.beginPath();
        ctx.moveTo(40, 30);
        ctx.lineTo(120, 25);
        ctx.lineTo(130, 50);
        ctx.lineTo(110, 80);
        ctx.lineTo(80, 100);
        ctx.lineTo(50, 90);
        ctx.lineTo(30, 60);
        ctx.closePath();
        ctx.fill();

        // South America
        ctx.beginPath();
        ctx.moveTo(90, 105);
        ctx.lineTo(110, 110);
        ctx.lineTo(115, 150);
        ctx.lineTo(100, 180);
        ctx.lineTo(80, 175);
        ctx.lineTo(75, 130);
        ctx.closePath();
        ctx.fill();

        // Europe
        ctx.beginPath();
        ctx.moveTo(180, 25);
        ctx.lineTo(220, 20);
        ctx.lineTo(230, 50);
        ctx.lineTo(200, 60);
        ctx.lineTo(175, 50);
        ctx.closePath();
        ctx.fill();

        // Africa
        ctx.beginPath();
        ctx.moveTo(175, 65);
        ctx.lineTo(220, 60);
        ctx.lineTo(230, 100);
        ctx.lineTo(220, 150);
        ctx.lineTo(180, 155);
        ctx.lineTo(165, 120);
        ctx.closePath();
        ctx.fill();

        // Asia
        ctx.beginPath();
        ctx.moveTo(230, 20);
        ctx.lineTo(350, 25);
        ctx.lineTo(370, 60);
        ctx.lineTo(360, 90);
        ctx.lineTo(300, 100);
        ctx.lineTo(250, 80);
        ctx.lineTo(235, 50);
        ctx.closePath();
        ctx.fill();

        // Australia
        ctx.beginPath();
        ctx.moveTo(320, 130);
        ctx.lineTo(370, 125);
        ctx.lineTo(380, 155);
        ctx.lineTo(350, 170);
        ctx.lineTo(320, 160);
        ctx.closePath();
        ctx.fill();

        // Convert canvas to blob/arraybuffer
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          }, 'image/png');
        });
        const arrayBuffer = await blob.arrayBuffer();

        // Convert to ASCII using chafa
        const result = await new Promise<{ ansi: string }>(
          (resolve, reject) => {
            chafa.imageToAnsi(
              arrayBuffer,
              {
                width: 80,
                height: 25,
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
      <canvas ref={canvasRef} className="hidden" />
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
