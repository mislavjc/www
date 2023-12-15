import Image from 'next/image';

type ShapeProps = {
  shape: '2' | '16';
};

export const Shape = ({ shape }: ShapeProps) => {
  return (
    <span className="inline-flex">
      <Image
        src={`/images/shapes/${shape}.png`}
        alt="shape"
        width={64}
        height={64}
        className="h-10 w-10 lg:h-16 lg:w-16"
      />
    </span>
  );
};
