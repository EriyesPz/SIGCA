import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  Weight,
  Package,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"
import { formatWeight, formatNumber } from "@/utils/cargo-report"
import type { OverallSummary } from "./types"

/* -------------------------------------------------------------------------- */
/*                                    THEME                                   */
/* -------------------------------------------------------------------------- */
// Paleta reusable para cualquier tarjeta
const COLOR = {
  green:  { bg: "bg-green-50",  bgDark: "bg-green-900",  text: "text-green-700",  textDark: "text-green-400" },
  blue:   { bg: "bg-blue-50",   bgDark: "bg-blue-900",   text: "text-blue-700",   textDark: "text-blue-400" },
  purple: { bg: "bg-purple-50", bgDark: "bg-purple-900", text: "text-purple-700", textDark: "text-purple-400" },
  orange: { bg: "bg-orange-50", bgDark: "bg-orange-900", text: "text-orange-700", textDark: "text-orange-400" },
  red:    { bg: "bg-red-50",    bgDark: "bg-red-900",    text: "text-red-700",    textDark: "text-red-400" },
  amber:  { bg: "bg-amber-50",  bgDark: "bg-amber-900",  text: "text-amber-700",  textDark: "text-amber-400" },
} as const

// <-— cualquier entrada del objeto COLOR
type ColorDef = (typeof COLOR)[keyof typeof COLOR]

interface CardInfo {
  title:  string
  value:  string
  icon:   React.ComponentType<{ className?: string }>
  color:  ColorDef
  /** tailwind gradient, ej: 'from-green-500 to-emerald-600' */
  gradient: string
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

interface SummaryCardsProps {
  summary: OverallSummary
}

export const SummaryCards = ({ summary }: SummaryCardsProps) => {
  /* ---------------------- tarjetas fijas (siempre visibles) --------------------- */
  const baseCards: CardInfo[] = [
    {
      title: "Cargas Recibidas",
      value: formatNumber(summary.totalReceived),
      icon: TrendingUp,
      color: COLOR.green,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Cargas Despachadas",
      value: formatNumber(summary.totalDispatched),
      icon: TrendingDown,
      color: COLOR.blue,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Peso Total",
      value: formatWeight(summary.totalWeight),
      icon: Weight,
      color: COLOR.purple,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Unidades Totales",
      value: formatNumber(summary.totalUnits),
      icon: Package,
      color: COLOR.orange,
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  /* ------------------- tarjetas condicionales (solo si > 0) ------------------- */
  const conditionalCards: CardInfo[] = []

  if (summary.totalDamaged > 0) {
    conditionalCards.push({
      title: "Cargas Dañadas",
      value: formatNumber(summary.totalDamaged),
      icon: AlertTriangle,
      color: COLOR.red,
      gradient: "from-red-500 to-red-600",
    })
  }

  if (summary.totalReturned > 0) {
    conditionalCards.push({
      title: "Cargas Devueltas",
      value: formatNumber(summary.totalReturned),
      icon: RotateCcw,
      color: COLOR.amber,
      gradient: "from-amber-500 to-amber-600",
    })
  }

  const cards = [...baseCards, ...conditionalCards]

  /* ----------------------------------- UI ----------------------------------- */
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {cards.map(({ title, value, icon: Icon, color, gradient }, idx) => (
        <Card
          key={idx}
          className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* texto */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {title}
                </p>
                <p className={`text-2xl font-bold ${color.text} dark:${color.textDark}`}>
                  {value}
                </p>
              </div>

              {/* icono */}
              <div
                className={`rounded-full p-3 ${color.bg} dark:${color.bgDark}`}
              >
                <Icon className={`h-6 w-6 ${color.text} dark:${color.textDark}`} />
              </div>
            </div>

            {/* barrita inferior */}
            <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${gradient}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
