"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Weight, Package, AlertTriangle, RotateCcw } from "lucide-react"
import { formatWeight, formatNumber } from "@/utils/cargo-report";
import type { OverallSummary } from "./types";

interface SummaryCardsProps {
  summary: OverallSummary
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
  const cards = [
    {
      title: "Cargas Recibidas",
      value: formatNumber(summary.totalReceived),
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Cargas Despachadas",
      value: formatNumber(summary.totalDispatched),
      icon: TrendingDown,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Peso Total",
      value: formatWeight(summary.totalWeight),
      icon: Weight,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      title: "Unidades Totales",
      value: formatNumber(summary.totalUnits),
      icon: Package,
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ]

  const additionalCards = []

  if (summary.totalDamaged > 0) {
    additionalCards.push({
      title: "Cargas Dañadas",
      value: formatNumber(summary.totalDamaged),
      icon: AlertTriangle,
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    })
  }

  if (summary.totalReturned > 0) {
    additionalCards.push({
      title: "Cargas Devueltas",
      value: formatNumber(summary.totalReturned),
      icon: RotateCcw,
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    })
  }

  const allCards = [...cards, ...additionalCards]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {allCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
              <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${card.gradient}`} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
