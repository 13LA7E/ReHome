import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, ArrowLeft, Leaf, Mail, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const popularPages = [
    { name: "Home", path: "/", icon: Home },
    { name: "Donate Items", path: "/multi-upload", icon: Leaf },
    { name: "My Impact", path: "/impact", icon: Search },
    { name: "FAQ", path: "/faq", icon: HelpCircle },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
          {/* 404 Illustration */}
          <div className="relative">
            <div className="text-[180px] font-bold text-primary/10 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-24 h-24 text-primary animate-float" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground">
              Requested path: <code className="px-2 py-1 bg-muted rounded text-primary">{location.pathname}</code>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Link to="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <Card className="p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Popular Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularPages.map((page) => (
                <Link key={page.path} to={page.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary"
                  >
                    <page.icon className="w-4 h-4 mr-2" />
                    {page.name}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          {/* Help Text */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>If you believe this is an error, please contact support:</p>
            <Link to="/contact" className="text-primary hover:underline font-medium">
              support@rehome.app
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
