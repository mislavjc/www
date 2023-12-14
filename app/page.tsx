import { Experience } from 'components/@index/experience';
import { Hero } from 'components/@index/hero';
import { Projects } from 'components/@index/projects';
import { Section } from 'components/section';

const HomePage = () => {
  return (
    <main className="mx-auto max-w-screen-md px-6">
      <Section>
        <Hero />
      </Section>
      <Section>
        <Experience />
      </Section>
      <Section>
        <Projects />
      </Section>
    </main>
  );
};

export default HomePage;
