
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconColor = "text-primary",
  trend,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("stats-card relative overflow-hidden", className)}>
      <div className="flex flex-col items-center text-center space-y-2 p-4">
        {Icon && (
          <div className={cn("rounded-full p-2 bg-primary/10", iconColor.replace('text-', 'bg-') + '/10')}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        )}
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className={cn(
              "text-xs font-medium flex items-center justify-center gap-1",
              trend.positive ? "text-green-600" : "text-red-600"
            )}>
              <span>
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span>vs last week</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
