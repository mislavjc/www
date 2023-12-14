import Image from 'next/image';

import { cn } from 'lib/utils';

type InflatedWordProps = {
  word: string;
  size?: 'small' | 'medium' | 'large';
};

export const InflatedWord = ({ word, size }: InflatedWordProps) => {
  const letters = word.toLowerCase().split('');

  return (
    <span className="inline-flex">
      {letters.map((letter, index) => (
        <Image
          key={index}
          src={`/images/black/${letter}.png`}
          alt={letter}
          width={64}
          height={64}
          className={cn(
            'h-10 w-10 lg:h-16 lg:w-16',
            size === 'small' && 'h-8 w-8 lg:h-12 lg:w-12',
            size === 'large' && 'h-12 w-12 lg:h-20 lg:w-20',
          )}
        />
      ))}
    </span>
  );
};
