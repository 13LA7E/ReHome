import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "green" | "blue" | "purple" | "orange";
  showValue?: boolean;
  label?: string;
  className?: string;
}

const sizeVariants = {
  sm: { circle: 60, stroke: 4, text: "text-sm" },
  md: { circle: 80, stroke: 6, text: "text-base" },
  lg: { circle: 120, stroke: 8, text: "text-lg" },
  xl: { circle: 160, stroke: 10, text: "text-2xl" },
};

const colorVariants = {
  primary: "stroke-primary",
  green: "stroke-green-500",
  blue: "stroke-blue-500",
  purple: "stroke-purple-500",
  orange: "stroke-orange-500",
};

export function ProgressCircle({
  value,
  max = 100,
  size = "md",
  color = "primary",
  showValue = true,
  label,
  className,
}: ProgressCircleProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const { circle, stroke, text } = sizeVariants[size];
  const radius = (circle - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-2", className)}>
      <svg
        width={circle}
        height={circle}
        className="transform -rotate-90 animate-fade-in-scale"
      >
        {/* Background circle */}
        <circle
          cx={circle / 2}
          cy={circle / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-muted/20"
        />
        
        {/* Progress circle */}
        <circle
          cx={circle / 2}
          cy={circle / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            colorVariants[color],
            "transition-all duration-1000 ease-out"
          )}
          style={{
            filter: `drop-shadow(0 0 6px var(--${color}))`,
          }}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", text)}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      {label && (
        <span className="text-sm font-medium text-muted-foreground text-center">
          {label}
        </span>
      )}
    </div>
  );
}
