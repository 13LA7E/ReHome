import { Leaf, TrendingUp, Award, Users, Package, Recycle, TreePine, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const impactMetrics = [
  {
    icon: Package,
    label: "Total Items Donated",
    value: "142",
    change: "+12 this month",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Recycle,
    label: "Waste Diverted",
    value: "85.4 kg",
    change: "+8.2 kg this month",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: TreePine,
    label: "CO₂ Saved",
    value: "234 kg",
    change: "+28 kg this month",
    color: "text-primary-glow",
    bgColor: "bg-primary/10"
  },
  {
    icon: Heart,
    label: "Lives Impacted",
    value: "67",
    change: "+5 people",
    color: "text-accent",
    bgColor: "bg-accent/10"
  }
];

const categories = [
  { name: "Clothes", donated: 68, progress: 85, color: "bg-primary" },
  { name: "Books", donated: 34, progress: 60, color: "bg-accent" },
  { name: "Electronics", donated: 22, progress: 45, color: "bg-primary-glow" },
  { name: "Furniture", donated: 12, progress: 30, color: "bg-accent" },
  { name: "E-waste", donated: 6, progress: 15, color: "bg-primary" }
];

const achievements = [
  { icon: Award, title: "First Donation", description: "Made your first donation", unlocked: true },
  { icon: TrendingUp, title: "Impact Starter", description: "Donated 10 items", unlocked: true },
  { icon: Leaf, title: "Eco Warrior", description: "Saved 100kg of CO₂", unlocked: true },
  { icon: Users, title: "Community Hero", description: "Helped 50 people", unlocked: true },
  { icon: Package, title: "Century Club", description: "Donated 100 items", unlocked: true },
  { icon: TreePine, title: "Forest Guardian", description: "Saved 500kg of CO₂", unlocked: false }
];

const Impact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Your Environmental Impact
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your contributions and see the real difference you're making
          </p>
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactMetrics.map((metric, index) => (
            <Card 
              key={index}
              className="p-6 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${metric.bgColor} rounded-2xl w-14 h-14 flex items-center justify-center mb-4`}>
                <metric.icon className={`w-7 h-7 ${metric.color}`} />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-primary font-medium">{metric.change}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 shadow-soft animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                Donation Breakdown
              </h2>
              <div className="space-y-6">
                {categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{category.name}</span>
                      <span className="text-sm text-muted-foreground">{category.donated} items</span>
                    </div>
                    <Progress value={category.progress} className="h-3" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Community Points */}
            <Card className="p-8 shadow-soft bg-gradient-impact text-primary-foreground animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Community Points</h2>
                  <p className="opacity-90">Earned through donations and impact</p>
                </div>
                <Award className="w-16 h-16 opacity-80" />
              </div>
              <div className="text-5xl font-bold mb-4">8,450 pts</div>
              <div className="flex gap-2 text-sm opacity-90">
                <span className="px-3 py-1 bg-primary-foreground/20 rounded-full">Top 5% this month</span>
                <span className="px-3 py-1 bg-primary-foreground/20 rounded-full">+450 pts this week</span>
              </div>
            </Card>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <Card className="p-8 shadow-soft animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-accent" />
                Achievements
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`flex gap-3 p-3 rounded-xl transition-all ${
                      achievement.unlocked 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-muted/50 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      achievement.unlocked ? 'bg-gradient-hero' : 'bg-muted'
                    }`}>
                      <achievement.icon className={`w-5 h-5 ${
                        achievement.unlocked ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
