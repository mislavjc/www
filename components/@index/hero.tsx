import { Shape } from 'components/shape';
import { InflatedWord } from 'components/word';

export const Hero = () => {
  return (
    <div>
      <h1 className="font-grotesk text-5xl text-neutral-900 lg:text-7xl">
        Hi, I&apos;m <InflatedWord word="Mislav" />, crafting{' '}
        <i>
          interacive experiences <Shape shape="2" />
        </i>{' '}
        on the <u>web</u>.
      </h1>
    </div>
  );
};
