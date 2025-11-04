import { Marquee } from 'components/@index/logos';
import { SpotifyNowPlaying } from 'components/@index/spotify-now-playing';
import { SectionTitle } from 'components/section-title';

export const About = () => {
  return (
    <div id="about" className="relative">
      <SectionTitle>About</SectionTitle>
      <p className="text-neutral-600">
        I&apos;m a Frontend Engineer with over 5 years of industry experience! I
        fell in love with Frontend back in 2020 when I began my Bachelor&apos;s
        degree because of an HTML/CSS class that got me hooked. I started
        focusing on Next.js and have been using it professionally and for all of
        my side projects. Other than Web technologies, I&apos;m also
        enthusiastic about UI/UX design and have enrolled in a Master&apos;s
        degree in Design and Multimedia. AI has also been a topic I took
        interest in, so in my free time I work on side projects experimenting
        with it.
      </p>
      <SpotifyNowPlaying />
      <Marquee />
    </div>
  );
};
