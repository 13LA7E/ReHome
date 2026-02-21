import { Link } from "react-router-dom";
import { Leaf, Mail } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card/50 mt-auto overflow-hidden">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                ReHome
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transforming household clutter into community impact, one donation at a time.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Early access
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/about", label: "About" },
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
                { to: "/partners", label: "Find Partners" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/terms", label: "Terms of Service" },
                { to: "/privacy", label: "Privacy Policy" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <a
              href="mailto:support@rehome.app"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              support@rehome.app
            </a>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Have a question or partnership inquiry? We read every email.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} ReHome. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with care for the planet 🌱
          </p>
        </div>
      </div>
    </footer>
  );
};
