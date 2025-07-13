import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Warehouse,
  Weight,
  Target,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon:
    | "package"
    | "truck"
    | "warehouse"
    | "weight"
    | "trending-up"
    | "trending-down"
    | "target"
    | "clock"
    | "users"
    | "alert"
    | "check"
    | "activity";
  color: string;
  subtitle?: string;
  target?: number;
  unit?: string;
  description?: string;
  showProgress?: boolean;
}

export const MetricCard = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  subtitle,
  target,
  unit,
  description,
  showProgress = false,
}: MetricCardProps) => {
  const getIcon = () => {
    const iconClass = `w-6 h-6 ${color}`;
    switch (icon) {
      case "package":
        return <Package className={iconClass} />;
      case "truck":
        return <Truck className={iconClass} />;
      case "warehouse":
        return <Warehouse className={iconClass} />;
      case "weight":
        return <Weight className={iconClass} />;
      case "trending-up":
        return <TrendingUp className={iconClass} />;
      case "trending-down":
        return <TrendingDown className={iconClass} />;
      case "target":
        return <Target className={iconClass} />;
      case "clock":
        return <Clock className={iconClass} />;
      case "users":
        return <Users className={iconClass} />;
      case "alert":
        return <AlertTriangle className={iconClass} />;
      case "check":
        return <CheckCircle className={iconClass} />;
      case "activity":
        return <Activity className={iconClass} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  const getChangeColor = () => {
    if (!change) return "";
    switch (changeType) {
      case "increase":
        return "bg-green-100 text-green-800 border-green-200";
      case "decrease":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressValue = () => {
    if (!target || typeof value !== "number") return 0;
    return Math.min((value / target) * 100, 100);
  };

  const cardContent = (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${color
                .replace("text-", "bg-")
                .replace("-600", "-100")}`}
            >
              {getIcon()}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">
                {value}
                {unit && ` ${unit}`}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {change !== undefined && (
            <Badge className={getChangeColor()}>
              {changeType === "increase" ? "+" : ""}
              {change}%
            </Badge>
          )}
        </div>

        {showProgress && target && typeof value === "number" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso</span>
              <span>{Math.round(getProgressValue())}%</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Meta: {target} {unit}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
};
