import {
  AboutHero,
  StorySection,
  ValuesSection,
  MissionVisionSection,
  MomentsGallery,
  AboutCTA,
} from './about-sections';

export const metadata = {
  title: 'Our story',
  description:
    'The Moon Charm is a small, handmade gift house in Kuliyapitiya, Sri Lanka.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <MissionVisionSection />
      <MomentsGallery />
      <AboutCTA />
    </div>
  );
}
