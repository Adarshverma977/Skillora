
import Navbar from '../features/landing/components/Navbar';
import HeroSection from '../features/landing/components/HeroSection';
import FeaturesSection from '../features/landing/components/FeaturesSection';
import HowItWorksSection from '../features/landing/components/HowItWorksSection';
import CTASection from "../features/landing/components/CTASection";
import Footer from '../features/landing/components/Footer';

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;
