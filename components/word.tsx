import Image from 'next/image';

type InflatedWordProps = {
  word: string;
};

export const InflatedWord = ({ word }: InflatedWordProps) => {
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
          className="h-10 w-10 lg:h-16 lg:w-16"
        />
      ))}
    </span>
  );
};
