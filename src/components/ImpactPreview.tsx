import { Leaf, Recycle, BadgeCheck, LineChart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

const benefits = [
  {
    icon: Leaf,
    title: "Extend item lifespans",
    body: "Clothes, books, furniture, and electronics get matched to people and organisations that will actually use them — keeping waste out of landfill.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Recycle,
    title: "Responsible e-waste routing",
    body: "Broken electronics are flagged as e-waste and routed to certified recycling partners so hazardous materials are handled safely.",
    accent: "bg-sky-500/10 text-sky-500",
  },
  {
    icon: BadgeCheck,
    title: "Vetted donation network",
    body: "Every partner on our map is manually verified. You always know exactly where your items are going and who they're helping.",
    accent: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: LineChart,
    title: "Your personal ledger",
    body: "A private dashboard shows every item you've donated, all points earned, and your cumulative environmental contribution over time.",
    accent: "bg-violet-500/10 text-violet-500",
  },
];

const ImpactPreview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Subtle background tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">
              Why it matters
            </span>
            <h2 className="fade-in-up text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground px-4">
              Every Item Has a Better Fate
            </h2>
            <p className="fade-in-up delay-100 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              ReHome connects unused household items with the people and places that need them most —
              transparently, locally, and with zero guesswork.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-12 md:mb-16">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className={`glass-card rounded-2xl p-6 md:p-8 flex gap-5 scale-in delay-${(i + 2) * 100} group`}
                >
                  <div className={`w-11 h-11 rounded-xl ${b.accent} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-base mb-1.5">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate(user ? "/impact" : "/auth")}
              className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              {user ? "View My Impact Dashboard" : "Start Donating Today"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactPreview;
