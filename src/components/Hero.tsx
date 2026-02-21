import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, MapPin, Trophy, BarChart3 } from "lucide-react";
import { useAuth } from "./AuthProvider";

const features = [
  {
    icon: Sparkles,
    title: "ReVision AI",
    description: "Snap a photo. Our on-device AI instantly identifies your item category and condition — no data leaves your browser.",
    iconBg: "from-emerald-400 to-primary",
  },
  {
    icon: MapPin,
    title: "Local Partners",
    description: "We surface verified charities, recycling centers, and donation hubs near you so your items find the right home.",
    iconBg: "from-sky-400 to-blue-500",
  },
  {
    icon: Trophy,
    title: "Reward Points",
    description: "Earn 5–45 pts per item based on type and condition, with streak and category bonuses to keep you motivated.",
    iconBg: "from-amber-400 to-orange-400",
  },
  {
    icon: BarChart3,
    title: "Personal Impact",
    description: "Your private dashboard tracks every donation, earned point, and environmental contribution in real time.",
    iconBg: "from-violet-400 to-purple-500",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-20">

      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="blob-float absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(158 84% 50% / 0.22) 0%, transparent 70%)" }}
        />
        <div
          className="blob-float-reverse absolute -bottom-52 -right-20 w-[750px] h-[750px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(39 95% 60% / 0.18) 0%, transparent 70%)" }}
        />
        <div
          className="blob-float-slow absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(200 80% 60% / 0.10) 0%, transparent 70%)" }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.032]"
          style={{
            backgroundImage: "radial-gradient(hsl(220 40% 10%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-16 md:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">

          {/* Early access badge */}
          <div className="fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-primary text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Now in early access
          </div>

          {/* Headline */}
          <h1 className="fade-in-up delay-100 text-4xl sm:text-5xl md:text-[4.5rem] font-display font-bold text-foreground leading-[1.08] tracking-tight px-2">
            Give Your Items
            <br />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              A Second Life
            </span>
          </h1>

          {/* Subtext */}
          <p className="fade-in-up delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Snap a photo, let AI sort it, connect with local donation partners.
            Every item you rehome earns you reward points.
          </p>

          {/* CTAs */}
          <div className="fade-in-up delay-300 flex flex-col sm:flex-row gap-3 justify-center pt-2 px-4">
            <Button
              size="lg"
              onClick={() => navigate(user ? "/multi-upload" : "/auth")}
              className="relative overflow-hidden px-8 py-6 text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-emerald-500 border-0 text-white shimmer"
            >
              {user ? "Donate Items Now" : "Get Started — It's Free"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {!user && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/about")}
                className="px-8 py-6 text-base md:text-lg rounded-full border-2 border-border/70 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-sm transition-all duration-300"
              >
                How It Works
              </Button>
            )}
          </div>

          {/* Pills */}
          <div className="fade-in-up delay-400 flex flex-wrap justify-center gap-2 pt-2 px-4">
            {["On-device AI classification", "Verified local partners", "Earn reward points", "Private impact tracking"].map((label) => (
              <span key={label} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-card text-muted-foreground text-sm">
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
                className={"glass-card gradient-border-animated rounded-2xl p-5 md:p-6 space-y-3 scale-in group delay-" + ((i + 3) * 100)}
              >
                <div className={"w-11 h-11 rounded-xl bg-gradient-to-br " + f.iconBg + " flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"}>
                  <Icon className="w-5 h-5 text-white" />
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
