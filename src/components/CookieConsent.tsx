import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <Card className="max-w-4xl mx-auto border-2 shadow-elegant bg-background/95 backdrop-blur">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-full bg-primary/10">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">We value your privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use cookies to enhance your experience, analyze site usage, and remember your 
                preferences. By clicking "Accept All", you consent to our use of cookies. You can 
                manage your preferences or learn more in our{" "}
                <Link to="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button
                onClick={rejectCookies}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Reject All
              </Button>
              <Button
                onClick={acceptCookies}
                size="sm"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Accept All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
