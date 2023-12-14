import { Hero } from 'components/@index/hero';
import { Section } from 'components/section';

const HomePage = () => {
  return (
    <main className="flex justify-center">
      <Section>
        <Hero />
      </Section>
    </main>
  );
};

export default HomePage;
