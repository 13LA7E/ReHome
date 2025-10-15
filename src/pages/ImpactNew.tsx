import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { ProgressCircle } from "@/components/ProgressCircle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  Package,
  Recycle,
  TreePine,
  Heart,
  TrendingUp,
  Award,
  Users,
  Zap,
  Target,
  Calendar,
  BarChart3,
  Sparkles
} from "lucide-react";

interface ImpactMetrics {
  totalItems: number;
  wasteDiverted: number;
  co2Saved: number;
  livesImpacted: number;
  communityPoints: number;
}

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export default function ImpactNew() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    totalItems: 0,
    wasteDiverted: 0,
    co2Saved: 0,
    livesImpacted: 0,
    communityPoints: 0
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; items: number }>>([]);

  useEffect(() => {
    fetchImpactData();
  }, [user]);

  const fetchImpactData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch impact metrics
      const { data: impactData } = await supabase
        .from("impact_metrics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (impactData) {
        setMetrics({
          totalItems: impactData.total_items || 0,
          wasteDiverted: impactData.waste_diverted_kg || 0,
          co2Saved: impactData.co2_saved_kg || 0,
          livesImpacted: impactData.lives_impacted || 0,
          communityPoints: impactData.community_points || 0
        });
      }

      // Fetch items by category
      const { data: itemsData } = await supabase
        .from("items")
        .select("category, created_at")
        .eq("user_id", user.id);

      if (itemsData && itemsData.length > 0) {
        // Process categories
        const categoryCounts: Record<string, number> = {};
        itemsData.forEach((item) => {
          const category = item.category || "Other";
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const totalItems = itemsData.length;
        const categoryData: CategoryData[] = Object.entries(categoryCounts)
          .map(([name, count]) => ({
            name,
            count,
            percentage: (count / totalItems) * 100,
            color: getCategoryColor(name)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setCategories(categoryData);

        // Process monthly data (last 6 months)
        const monthlyMap: Record<string, number> = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        itemsData.forEach((item) => {
          const date = new Date(item.created_at);
          const monthKey = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(2)}`;
          monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
        });

        const monthlyArray = Object.entries(monthlyMap)
          .map(([month, items]) => ({ month, items }))
          .slice(-6);

        setMonthlyData(monthlyArray);
      }
    } catch (error) {
      console.error("Error fetching impact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Clothing: "blue",
      Electronics: "purple",
      Books: "green",
      Furniture: "orange",
      Toys: "pink",
      Kitchen: "cyan",
      Other: "gray"
    };
    return colors[category] || "gray";
  };

  const achievements = [
    { 
      icon: Award, 
      title: "First Donation", 
      description: "Made your first donation", 
      unlocked: metrics.totalItems >= 1,
      color: "blue"
    },
    { 
      icon: TrendingUp, 
      title: "Impact Starter", 
      description: "Donated 10 items", 
      unlocked: metrics.totalItems >= 10,
      color: "green"
    },
    { 
      icon: Recycle, 
      title: "Eco Warrior", 
      description: "Saved 100kg of CO₂", 
      unlocked: metrics.co2Saved >= 100,
      color: "purple"
    },
    { 
      icon: Users, 
      title: "Community Hero", 
      description: "Helped 50 people", 
      unlocked: metrics.livesImpacted >= 50,
      color: "orange"
    },
    { 
      icon: Package, 
      title: "Century Club", 
      description: "Donated 100 items", 
      unlocked: metrics.totalItems >= 100,
      color: "cyan"
    },
    { 
      icon: TreePine, 
      title: "Forest Guardian", 
      description: "Saved 500kg of CO₂", 
      unlocked: metrics.co2Saved >= 500,
      color: "green"
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const achievementProgress = (unlockedCount / achievements.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-primary/5 to-background">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
            Your Impact Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your environmental contribution and community impact
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Items Donated"
            value={metrics.totalItems}
            icon={Package}
            color="blue"
            trend={{ value: 12, isPositive: true }}
            loading={loading}
            className="animate-slide-up stagger-1"
          />
          <StatCard
            title="Waste Diverted"
            value={`${metrics.wasteDiverted.toFixed(1)} kg`}
            icon={Recycle}
            color="green"
            trend={{ value: 8, isPositive: true }}
            loading={loading}
            className="animate-slide-up stagger-2"
          />
          <StatCard
            title="CO₂ Saved"
            value={`${metrics.co2Saved.toFixed(0)} kg`}
            icon={TreePine}
            color="purple"
            trend={{ value: 15, isPositive: true }}
            loading={loading}
            className="animate-slide-up stagger-3"
          />
          <StatCard
            title="Lives Impacted"
            value={metrics.livesImpacted}
            icon={Heart}
            color="orange"
            trend={{ value: 5, isPositive: true }}
            loading={loading}
            className="animate-slide-up stagger-4"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Circles */}
              <Card className="p-6 glass hover-lift animate-fade-in-scale">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Monthly Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col items-center">
                  <ProgressCircle
                    value={metrics.totalItems % 20}
                    max={20}
                    size="lg"
                    color="primary"
                    label={`${metrics.totalItems % 20}/20 items this month`}
                  />
                </CardContent>
              </Card>

              <Card className="p-6 glass hover-lift animate-fade-in-scale stagger-1">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    Impact Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col items-center">
                  <ProgressCircle
                    value={Math.min(metrics.communityPoints, 1000)}
                    max={1000}
                    size="lg"
                    color="green"
                    label={`${metrics.communityPoints} points`}
                  />
                </CardContent>
              </Card>

              <Card className="p-6 glass hover-lift animate-fade-in-scale stagger-2">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col items-center">
                  <ProgressCircle
                    value={unlockedCount}
                    max={achievements.length}
                    size="lg"
                    color="purple"
                    label={`${unlockedCount}/${achievements.length} unlocked`}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Monthly Activity Chart */}
            {monthlyData.length > 0 && (
              <Card className="p-6 glass hover-lift animate-slide-up">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Monthly Activity
                  </CardTitle>
                  <CardDescription>Your donation trends over time</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-end justify-between gap-2 h-48">
                    {monthlyData.map((data, index) => {
                      const maxItems = Math.max(...monthlyData.map(d => d.items));
                      const height = (data.items / maxItems) * 100;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                            <div
                              className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all duration-500 group-hover:scale-105 cursor-pointer relative"
                              style={{ height: `${height}%`, minHeight: '20px' }}
                            >
                              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                {data.items}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {data.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <Card 
                  key={category.name} 
                  className="p-6 hover-lift transition-smooth animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} items • {category.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <Badge className="text-lg px-4 py-2">
                      {category.count}
                    </Badge>
                  </div>
                  <Progress 
                    value={category.percentage} 
                    className="h-3 progress-bar" 
                  />
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No donations yet. Start donating to see your impact by category!
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-6 mb-6 glass border-primary/30">
              <div className="flex items-center gap-4">
                <Sparkles className="h-8 w-8 text-primary animate-pulse-glow" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Achievement Progress</h3>
                  <Progress value={achievementProgress} className="h-3 progress-bar" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {unlockedCount} of {achievements.length} achievements unlocked
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card
                    key={achievement.title}
                    className={`p-6 transition-smooth card-interactive animate-fade-in-scale ${
                      achievement.unlocked 
                        ? 'border-primary/50 shadow-glow' 
                        : 'opacity-50 grayscale'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        flex items-center justify-center w-14 h-14 rounded-xl 
                        ${achievement.unlocked 
                          ? `bg-gradient-to-br from-${achievement.color}-500 to-${achievement.color}-600` 
                          : 'bg-muted'
                        }
                        ${achievement.unlocked ? 'animate-pulse-glow' : ''}
                      `}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="text-xs">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8 p-8 text-center glass border-primary/30 hover-lift animate-fade-in-scale">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-primary animate-bounce" />
          <h3 className="text-2xl font-bold mb-2">Keep Up the Great Work!</h3>
          <p className="text-muted-foreground mb-6">
            Every item you donate makes a real difference in someone's life and our environment
          </p>
          <Button size="lg" className="button-ripple">
            Donate More Items
          </Button>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
