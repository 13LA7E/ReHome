import { Upload, Leaf, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/upload");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full border border-primary-foreground/20">
            <Leaf className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Transforming Clutter into Community Impact</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Give Your Items a
            <br />
            <span className="bg-gradient-to-r from-primary-foreground to-accent-foreground bg-clip-text text-transparent">
              Second Life
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Donate clothes, books, furniture, and electronics with AI-powered matching to verified partners. 
            Track your environmental impact in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="xl" 
              variant="hero"
              onClick={handleGetStarted}
              className="group"
            >
              <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {user ? "Donate an Item" : "Get Started"}
            </Button>
            {user && (
              <Button 
                size="xl" 
                variant="outline"
                onClick={() => navigate('/impact')}
                className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <TrendingUp className="w-5 h-5" />
                View Impact
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-primary-foreground mb-2">10K+</div>
              <div className="text-primary-foreground/80">Items Donated</div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-primary-foreground mb-2">5 tons</div>
              <div className="text-primary-foreground/80">Waste Diverted</div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all hover:scale-105">
              <div className="text-3xl font-bold text-primary-foreground mb-2">500+</div>
              <div className="text-primary-foreground/80">Partner Organizations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
