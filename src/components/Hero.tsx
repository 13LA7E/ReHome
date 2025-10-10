import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/multi-upload");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="relative z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="bg-primary/15 p-2.5 rounded-full">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ReHome
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/impact")}
                    className="font-display font-medium"
                  >
                    My Impact
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/redeem")}
                    className="font-display font-medium"
                  >
                    Redeem
                  </Button>
                  <Button 
                    onClick={handleGetStarted}
                    className="font-display font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Donate Items
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleGetStarted}
                  className="font-display font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        {/* Animated background elements with enhanced gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-background" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-primary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block animate-scale-in">
            <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 text-primary font-display font-semibold text-base backdrop-blur-sm border-2 border-primary/30 shadow-md">
              🌱 Join the ReHome Movement
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight animate-fade-in">
            Give Your Items
            <br />
            A Second Life
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed animate-fade-in font-medium">
            Transform unused items into opportunities. Donate, recycle, and make a
            real impact on your community and the environment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="group relative px-10 py-7 text-lg font-display font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-glow overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">
                {isAuthenticated ? "Donate Items Now" : "Get Started Today"}
                <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </Button>
            {isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/impact")}
                className="group px-10 py-7 text-lg font-display font-semibold border-2 border-primary/40 hover:border-primary hover:bg-primary/10 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">View My Impact ✨</span>
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 animate-fade-in">
            {[
              { value: "10K+", label: "Items Donated", icon: "📦" },
              { value: "500+", label: "Families Helped", icon: "❤️" },
              { value: "2T+", label: "CO₂ Saved", icon: "🌍" },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group p-8 rounded-2xl bg-gradient-to-br from-card via-card to-primary/10 backdrop-blur-sm border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-foreground/70 font-semibold font-display">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
