import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/multi-upload");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] md:min-h-screen flex flex-col overflow-hidden">
      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        {/* Simplified background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-6xl mx-auto text-center space-y-6 md:space-y-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight animate-fade-in px-2">
            Give Your Items
            <br />
            A Second Life
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed animate-fade-in font-medium px-4">
            Transform unused items into opportunities. Donate, recycle, and make an impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-2 md:pt-4 animate-fade-in px-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="w-full sm:w-auto group px-6 py-5 md:px-10 md:py-7 text-base md:text-lg font-display font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg"
            >
              {isAuthenticated ? "Donate Items Now" : "Get Started"}
              <span className="ml-2">→</span>
            </Button>
            {isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/impact")}
                className="w-full sm:w-auto px-6 py-5 md:px-10 md:py-7 text-base md:text-lg font-display font-semibold border-2 border-primary/40 hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                View My Impact
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-8 md:pt-16 animate-fade-in px-4">
            {[
              { value: "10K+", label: "Items Donated", icon: "📦" },
              { value: "500+", label: "Families Helped", icon: "❤️" },
              { value: "2T+", label: "CO₂ Saved", icon: "🌍" },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="glass-card group p-5 md:p-8 rounded-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-foreground/70 font-semibold font-display">
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
