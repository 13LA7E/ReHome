import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, MapPin, Trophy, BarChart3 } from "lucide-react";
import { useAuth } from "./AuthProvider";

const features = [
  {
    icon: Sparkles,
    title: "ReVision AI",
    description: "Snap a photo. Our on-device AI instantly identifies your item category and condition — no data leaves your browser.",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: MapPin,
    title: "Local Partners",
    description: "We surface verified charities, recycling centers, and donation hubs near you so your items find the right home.",
    bg: "bg-sky-500/10",
    iconColor: "text-sky-500",
  },
  {
    icon: Trophy,
    title: "Reward Points",
    description: "Earn 5–45 pts per item based on type and condition, with streak and category bonuses to keep you motivated.",
    bg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: BarChart3,
    title: "Personal Impact",
    description: "Your private dashboard tracks every donation, earned point, and environmental contribution in real time.",
    bg: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.10),transparent)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Main Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-16 md:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Now in early access
          </div>

          <h1 className="fade-in-up delay-100 text-4xl sm:text-5xl md:text-[4.5rem] font-display font-bold text-foreground leading-[1.08] tracking-tight px-2">
            Give Your Items
            <br />
            <span className="bg-gradient-to-r from-primary via-emerald-500 to-amber-400 bg-clip-text text-transparent">
              A Second Life
            </span>
          </h1>

          <p className="fade-in-up delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Snap a photo, let AI sort it, connect with local donation partners.
            Every item you rehome earns you reward points.
          </p>

          <div className="fade-in-up delay-300 flex flex-col sm:flex-row gap-3 justify-center pt-2 px-4">
            <Button
              size="lg"
              onClick={() => navigate(user ? "/multi-upload" : "/auth")}
              className="px-8 py-6 text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-primary text-primary-foreground"
            >
              {user ? "Donate Items Now" : "Get Started — It's Free"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {!user && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
                className="px-8 py-6 text-base md:text-lg rounded-full border-2 hover:bg-muted/50 transition-all duration-300"
              >
                How It Works
              </Button>
            )}
          </div>

          <div className="fade-in-up delay-400 flex flex-wrap justify-center gap-2 pt-2 px-4">
            {[
              "On-device AI classification",
              "Verified local partners",
              "Earn reward points",
              "Private impact tracking",
            ].map((label) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-muted/70 border border-border/60 text-muted-foreground text-sm"
              >
                <span className="text-primary font-bold text-xs">✦</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative pb-16 md:pb-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={"glass-card rounded-2xl p-5 md:p-6 space-y-3 scale-in group delay-" + ((i + 3) * 100)}
              >
                <div className={"w-10 h-10 rounded-xl " + f.bg + " flex items-center justify-center group-hover:scale-110 transition-transform duration-300"}>
                  <Icon className={"w-5 h-5 " + f.iconColor} />
                </div>
                <h3 className="font-display font-semibold text-foreground text-base">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
