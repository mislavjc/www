import { Shape } from 'components/shape';
import { InflatedWord } from 'components/word';

export const Hero = () => {
  return (
    <div className="mx-8 flex flex-col items-center justify-center md:mx-16">
      <h1 className="max-w-screen-md font-grotesk text-5xl lg:text-7xl">
        Hi, I&apos;m <InflatedWord word="Mislav" />, crafting{' '}
        <i>
          interacive experiences <Shape shape="2" />
        </i>{' '}
        on the <u>web</u>.
      </h1>
    </div>
  );
};
