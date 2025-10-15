import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ImpactPreview from "@/components/ImpactPreview";
import { Testimonials } from "@/components/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <HowItWorks />
      <ImpactPreview />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
