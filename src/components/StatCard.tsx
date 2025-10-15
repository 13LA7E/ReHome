import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
  className?: string;
  loading?: boolean;
}

const colorVariants = {
  blue: "from-blue-500 to-cyan-500",
  green: "from-green-500 to-emerald-500",
  purple: "from-purple-500 to-pink-500",
  orange: "from-orange-500 to-amber-500",
  red: "from-red-500 to-rose-500",
  cyan: "from-cyan-500 to-teal-500",
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "blue",
  className,
  loading = false 
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn("p-6 animate-pulse", className)}>
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-8 bg-muted rounded w-32"></div>
          </div>
          <div className="w-12 h-12 bg-muted rounded-xl"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "group relative overflow-hidden hover-lift transition-smooth",
      className
    )}>
      {/* Gradient background effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        colorVariants[color]
      )} />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight animate-fade-in-scale">
                {value}
              </h3>
              {trend && (
                <span className={cn(
                  "text-sm font-semibold flex items-center gap-1",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}>
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          </div>
          
          <div className={cn(
            "flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
            colorVariants[color]
          )}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </Card>
  );
}
