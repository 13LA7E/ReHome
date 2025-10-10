import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";

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
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated home button */}
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        size="icon"
        className="absolute top-6 left-6 z-50 h-12 w-12 rounded-full bg-card/80 backdrop-blur-md border-2 border-primary/20 hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-glow animate-bounce"
      >
        <Home className="h-5 w-5 text-primary" />
      </Button>

      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background animate-fade-in" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-transparent via-primary/5 to-transparent animate-fade-in" />
      
      <div className="relative max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="inline-block animate-scale-in">
          <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-display font-medium text-sm backdrop-blur-sm border border-primary/20 shadow-md">
            🌱 Join the ReHome Movement
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight animate-fade-in">
          Give Your Items
          <br />
          A Second Life
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in font-light">
          Transform unused items into opportunities. Donate, recycle, and make a
          real impact on your community and the environment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="group relative px-10 py-7 text-lg font-display font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-glow overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">
              {isAuthenticated ? "Donate Items" : "Get Started"}
              <span className="ml-2 inline-block group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </Button>
          {isAuthenticated && (
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/impact")}
              className="group px-10 py-7 text-lg font-display font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden animate-pulse hover:animate-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">View Impact ✨</span>
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
              className="group p-8 rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium font-display">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
