import {
  AboutHeroSection,
  CallToActionSection,
  CapturedMomentsSection,
  CompanyStorySection,
  VisionMissionSection,
} from './about-sections';

export default function AboutPage() {
  return (
    <div className="pb-14">
      <AboutHeroSection />

      <div className="mc-container py-10">
        <CompanyStorySection />
        <CapturedMomentsSection />
        <VisionMissionSection />
        <CallToActionSection />
      </div>
    </div>
  );
}
