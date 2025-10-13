import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, MapPin, Phone, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground">
            We're here to help! Reach out to us with any questions or feedback
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Contact Information */}
          <Card className="border-2 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a 
                    href="mailto:support@rehomeht.com" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    support@rehomeht.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-muted-foreground">
                    Coming soon
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    In-app chat support launching next month
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Support Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday</p>
                  <p className="text-muted-foreground">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-2 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = "/#/faq"}
              >
                <HelpCircle className="mr-2 w-4 h-4" />
                Frequently Asked Questions
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = "/#/about"}
              >
                <Info className="mr-2 w-4 h-4" />
                About ReHomeHT
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = "/#/privacy"}
              >
                <Shield className="mr-2 w-4 h-4" />
                Privacy Policy
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = "/#/terms"}
              >
                <FileText className="mr-2 w-4 h-4" />
                Terms of Service
              </Button>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">For Organizations</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Interested in becoming a donation partner?
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  onClick={() => window.location.href = "mailto:partnerships@rehomeht.com"}
                >
                  Partner With Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section */}
        <Card className="border-2 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl">We Value Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your input helps us improve ReHomeHT for everyone. Whether you have suggestions, 
              found a bug, or want to share your experience, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1"
                onClick={() => window.location.href = "mailto:support@rehomeht.com?subject=Feedback"}
              >
                <Mail className="mr-2 w-4 h-4" />
                Send Feedback
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => window.location.href = "mailto:support@rehomeht.com?subject=Bug%20Report"}
              >
                <MessageCircle className="mr-2 w-4 h-4" />
                Report an Issue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Media - Placeholder */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Follow us on social media (coming soon)
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Import missing icons
import { HelpCircle, Info, Shield, FileText } from "lucide-react";

export default Contact;
