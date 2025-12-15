import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Home, ArrowLeft, Search, Leaf } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative text-center space-y-6 animate-fade-in max-w-lg">
          {/* 404 Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="text-9xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                404
              </div>
              <Leaf className="absolute -top-4 -right-4 w-12 h-12 text-primary animate-bounce" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground">
              Oops! The page you're looking for seems to have been recycled. 🌱
            </p>
            <p className="text-sm text-muted-foreground">
              Path: <code className="px-2 py-1 bg-secondary rounded text-primary">{location.pathname}</code>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          {/* Suggestions */}
          <div className="pt-8 border-t border-border mt-8">
            <p className="text-sm text-muted-foreground mb-4">Maybe you were looking for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: "Donate Items", path: "/multi-upload" },
                { label: "Find Partners", path: "/partners" },
                { label: "My Impact", path: "/impact" },
                { label: "Redeem Points", path: "/redeem" },
              ].map((link) => (
                <Button
                  key={link.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(link.path)}
                  className="text-primary hover:text-primary/80"
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
