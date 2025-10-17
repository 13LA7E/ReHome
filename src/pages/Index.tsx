import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ImpactPreview from "@/components/ImpactPreview";
import { Testimonials } from "@/components/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 via-30% via-secondary/30 via-70% to-background">
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
