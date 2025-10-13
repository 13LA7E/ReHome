import { Link } from "react-router-dom";
import { Leaf, Mail, Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ReHome
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transforming household clutter into community impact, one donation at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-muted-foreground hover:text-primary transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <a 
                  href="mailto:support@ReHome.com" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  support@ReHome.com
                </a>
              </li>
            </ul>
            {/* Social Media Icons - Placeholder */}
            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-not-allowed opacity-50">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-not-allowed opacity-50">
                <Linkedin className="h-4 w-4" />
              </div>
              <div className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-not-allowed opacity-50">
                <Github className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ReHome. All rights reserved. Making the world greener, one donation at a time. 🌱
          </p>
        </div>
      </div>
    </footer>
  );
};
