import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Leaf, Users, Recycle, TrendingUp, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "Less Landfill Waste",
    description: "Every rehomed item is one less piece of landfill. We track your cumulative carbon savings against average disposal data.",
    iconBg: "from-emerald-400 to-primary",
    borderColor: "from-emerald-400 to-primary",
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Your donations feed directly into local food banks, shelters, and upcycle workshops — visible on the community board.",
    iconBg: "from-sky-400 to-blue-500",
    borderColor: "from-sky-400 to-blue-500",
  },
  {
    icon: Recycle,
    title: "Circular Economy",
    description: "Items that can't be donated are routed to certified recyclers so materials are recovered rather than wasted.",
    iconBg: "from-amber-400 to-orange-400",
    borderColor: "from-amber-400 to-orange-400",
  },
  {
    icon: TrendingUp,
    title: "Tracked Progress",
    description: "Your personal Impact dashboard updates after every donation with real numbers — not estimates, not approximations.",
    iconBg: "from-violet-400 to-purple-500",
    borderColor: "from-violet-400 to-purple-500",
  },
];

const ImpactPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="blob-float-reverse absolute -bottom-32 -left-20 w-[560px] h-[560px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(158 84% 50% / 0.13) 0%, transparent 70%)" }}
        />
        <div
          className="blob-float absolute top-0 right-[-60px] w-[420px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(200 80% 60% / 0.10) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 space-y-14">

        {/* Section header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-primary text-sm font-semibold fade-in-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Real-World Impact
          </div>
          <h2 className="fade-in-up delay-100 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Your Donations{" "}
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              Actually Matter
            </span>
          </h2>
          <p className="fade-in-up delay-200 text-lg text-muted-foreground max-w-xl mx-auto">
            Every item rehomed has a traceable positive footprint — on your community and the planet.
          </p>
        </div>

        {/* Benefit cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className={"glass-card gradient-border-animated rounded-2xl p-6 flex flex-col gap-4 group scale-in delay-" + ((i + 1) * 100)}
              >
                <div className={"w-11 h-11 rounded-xl bg-gradient-to-br " + b.iconBg + " flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {/* Gradient left accent bar */}
                <div className={"h-0.5 w-8 rounded-full bg-gradient-to-r " + b.borderColor} />
                <h3 className="font-display font-semibold text-foreground text-base">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center fade-in-up">
          <Button
            size="lg"
            onClick={() => navigate("/impact")}
            className="relative overflow-hidden px-8 py-6 text-base font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-emerald-500 border-0 text-white shimmer"
          >
            See Your Impact Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ImpactPreview;
