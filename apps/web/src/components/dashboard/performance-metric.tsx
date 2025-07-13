import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Target, Clock, DollarSign, CheckCircle } from "lucide-react"
import type { PerformanceMetric } from "./types";

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[]
}

export const PerformanceMetrics = ({ metrics }: PerformanceMetricsProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "bg-green-100 text-green-800 border-green-200"
      case "down":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconClass = "w-5 h-5"
    switch (category) {
      case "efficiency":
        return <Target className={`${iconClass} text-blue-600`} />
      case "quality":
        return <CheckCircle className={`${iconClass} text-green-600`} />
      case "cost":
        return <DollarSign className={`${iconClass} text-orange-600`} />
      case "time":
        return <Clock className={`${iconClass} text-purple-600`} />
      default:
        return <Target className={iconClass} />
    }
  }

  const getProgressValue = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getPerformanceStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 95) return { status: "Excelente", color: "bg-green-100 text-green-800" }
    if (percentage >= 80) return { status: "Bueno", color: "bg-blue-100 text-blue-800" }
    if (percentage >= 60) return { status: "Regular", color: "bg-yellow-100 text-yellow-800" }
    return { status: "Necesita Mejora", color: "bg-red-100 text-red-800" }
  }

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Rendimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const progressValue = getProgressValue(metric.current, metric.target)
            const status = getPerformanceStatus(metric.current, metric.target)

            return (
              <div key={metric.name} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(metric.category)}
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Actualizado: {formatLastUpdated(metric.lastUpdated)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={status.color}>{status.status}</Badge>
                    <Badge className={getTrendColor(metric.trend)} variant="outline">
                      {getTrendIcon(metric.trend)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Actual: {metric.current} {metric.unit}
                    </span>
                    <span>
                      Meta: {metric.target} {metric.unit}
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">{progressValue.toFixed(1)}% del objetivo</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
