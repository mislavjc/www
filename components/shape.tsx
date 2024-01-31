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
        className="size-10 lg:size-16"
      />
    </span>
  );
};
