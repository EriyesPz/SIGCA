"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, AlertTriangle } from "lucide-react"
import type { WeatherData } from "./types";

interface WeatherWidgetProps {
  weather: WeatherData
}

export const WeatherWidget = ({ weather }: WeatherWidgetProps) => {
  const getWeatherIcon = (conditions: string) => {
    const iconClass = "w-6 h-6"
    if (conditions.includes("nublado")) return <Cloud className={`${iconClass} text-gray-600`} />
    if (conditions.includes("lluvia")) return <CloudRain className={`${iconClass} text-blue-600`} />
    return <Sun className={`${iconClass} text-yellow-600`} />
  }

  const getImpactColor = (impact: string) => {
    const colors = {
      none: "bg-green-100 text-green-800 border-green-200",
      low: "bg-yellow-100 text-yellow-800 border-yellow-200",
      medium: "bg-orange-100 text-orange-800 border-orange-200",
      high: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[impact as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getImpactLabel = (impact: string) => {
    const labels = {
      none: "Sin Impacto",
      low: "Impacto Bajo",
      medium: "Impacto Medio",
      high: "Impacto Alto",
    }
    return labels[impact as keyof typeof labels] || impact
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getWeatherIcon(weather.conditions)}
          Condiciones Climáticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{weather.temperature}°C</p>
                <p className="text-sm text-muted-foreground">{weather.conditions}</p>
              </div>
            </div>
            <Badge className={getImpactColor(weather.impact)}>
              {weather.impact !== "none" && <AlertTriangle className="w-3 h-3 mr-1" />}
              {getImpactLabel(weather.impact)}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{weather.humidity}% Humedad</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start gap-2">
              <Wind className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Pronóstico</p>
                <p className="text-sm text-blue-700">{weather.forecast}</p>
              </div>
            </div>
          </div>

          {weather.impact !== "none" && (
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Impacto Operacional</p>
                  <p className="text-sm text-yellow-700">
                    Las condiciones climáticas pueden afectar las operaciones de carga y descarga.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
