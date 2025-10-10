import { Navigation } from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ImpactPreview from "@/components/ImpactPreview";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <ImpactPreview />
    </div>
  );
};

export default Index;
