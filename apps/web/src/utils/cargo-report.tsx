import type {
  CargoMovement,
  DailyCargoSummary,
  CargoTypeSummary,
  OverallSummary,
} from "@/components/cargo-report/types";

export type MovementType = "IN" | "OUT" | "DAMAGED" | "RETURNED";

export const TYPE_LABEL: Record<MovementType, string> = {
  IN: "Entradas",
  OUT: "Salidas",
  DAMAGED: "Dañadas",
  RETURNED: "Devueltas",
};

export const TYPE_COLOR: Record<MovementType, string> = {
  IN: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700",
  OUT: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700",
  DAMAGED:
    "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700",
  RETURNED:
    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-700",
};

export const TYPE_ICON: Record<MovementType, string> = {
  IN: "↗️",
  OUT: "↙️",
  DAMAGED: "⚠️",
  RETURNED: "↩️",
};

export const getTypeLabel = (t: MovementType) => TYPE_LABEL[t];
export const getTypeColor = (t: MovementType) => TYPE_COLOR[t];
export const getTypeIcon = (t: MovementType) => TYPE_ICON[t];

export const generateDailyCargoReports = (
  movements: CargoMovement[]
): DailyCargoSummary[] => {
  const groupedByDate = movements.reduce((acc, movement) => {
    if (!acc[movement.date]) acc[movement.date] = [];
    acc[movement.date].push(movement);
    return acc;
  }, {} as Record<string, CargoMovement[]>);

  return Object.entries(groupedByDate)
    .map(([date, dayMovements]) => {
      const groupByType = (type: MovementType): CargoTypeSummary => {
        const typeMovements = dayMovements.filter((m) => m.type === type);
        return {
          type,
          count: typeMovements.length,
          totalWeight: typeMovements.reduce((s, i) => s + i.weightKg, 0),
          totalUnits: typeMovements.reduce((s, i) => s + i.quantity, 0),
          items: typeMovements,
        };
      };

      const inSummary = groupByType("IN");
      const outSummary = groupByType("OUT");
      const damagedSummary = groupByType("DAMAGED");
      const returnedSummary = groupByType("RETURNED");

      return {
        date,
        summary: [
          inSummary,
          outSummary,
          damagedSummary,
          returnedSummary,
        ].filter((s) => s.count > 0),
        totals: {
          totalCargos: dayMovements.length,
          totalWeight: dayMovements.reduce((s, i) => s + i.weightKg, 0),
          totalUnits: dayMovements.reduce((s, i) => s + i.quantity, 0),
          byType: {
            IN: {
              count: inSummary.count,
              weight: inSummary.totalWeight,
              units: inSummary.totalUnits,
            },
            OUT: {
              count: outSummary.count,
              weight: outSummary.totalWeight,
              units: outSummary.totalUnits,
            },
            DAMAGED: {
              count: damagedSummary.count,
              weight: damagedSummary.totalWeight,
              units: damagedSummary.totalUnits,
            },
            RETURNED: {
              count: returnedSummary.count,
              weight: returnedSummary.totalWeight,
              units: returnedSummary.totalUnits,
            },
          },
        },
      };
    })
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
};

export const calculateOverallSummary = (
  reports: DailyCargoSummary[]
): OverallSummary =>
  reports.reduce(
    (acc, r) => ({
      totalReceived: acc.totalReceived + r.totals.byType.IN.count,
      totalDispatched: acc.totalDispatched + r.totals.byType.OUT.count,
      totalWeight: acc.totalWeight + r.totals.totalWeight,
      totalUnits: acc.totalUnits + r.totals.totalUnits,
      totalDamaged: acc.totalDamaged + r.totals.byType.DAMAGED.count,
      totalReturned: acc.totalReturned + r.totals.byType.RETURNED.count,
    }),
    {
      totalReceived: 0,
      totalDispatched: 0,
      totalWeight: 0,
      totalUnits: 0,
      totalDamaged: 0,
      totalReturned: 0,
    }
  );

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatShortDate = (d: string) =>
  new Date(d).toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });

export const formatWeight = (w: number) =>
  `${w.toLocaleString("es-ES", { minimumFractionDigits: 1 })} kg`;

export const formatNumber = (n: number) => n.toLocaleString("es-ES");
