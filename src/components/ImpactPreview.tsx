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
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Track Your Environmental Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every donation makes a measurable difference. See your real-time impact on the planet.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className="bg-gradient-card rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-border animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${metric.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    {metric.unit}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="xl" 
              variant="impact"
              onClick={() => navigate('/impact')}
              className="shadow-glow animate-glow-pulse"
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
