import { Leaf, TrendingUp, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const metrics = [
  {
    icon: Leaf,
    label: "CO₂ Saved",
    value: "12.5",
    unit: "tons",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    label: "Waste Diverted",
    value: "5,234",
    unit: "kg",
    color: "text-accent"
  },
  {
    icon: Award,
    label: "Community Points",
    value: "8,450",
    unit: "pts",
    color: "text-primary-glow"
  },
  {
    icon: Users,
    label: "Lives Impacted",
    value: "1,250",
    unit: "people",
    color: "text-accent"
  }
];

const ImpactPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-1/2 -right-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14 lg:mb-16 space-y-3 md:space-y-4 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-4">
              Track Your Environmental Impact
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Every donation makes a measurable difference. See your real-time impact on the planet.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className="bg-gradient-card rounded-xl md:rounded-2xl p-5 md:p-8 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-border animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${metric.color} mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                    {metric.unit}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-foreground">
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center px-4">
            <Button 
              size="xl" 
              variant="impact"
              onClick={() => navigate('/impact')}
              className="shadow-glow w-full sm:w-auto hover:shadow-hover transition-all"
            >
              <TrendingUp className="w-5 h-5" />
              View Full Impact Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactPreview;
