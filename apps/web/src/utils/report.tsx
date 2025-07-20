import type {
  CargoMovement,
  DailyReport,
  CargoSummary,
} from "@/components/reports/types";

export const generateDailyReports = (
  movements: CargoMovement[]
): DailyReport[] => {
  const groupedByDate = movements.reduce((acc, movement) => {
    if (!acc[movement.date]) {
      acc[movement.date] = [];
    }
    acc[movement.date].push(movement);
    return acc;
  }, {} as Record<string, CargoMovement[]>);

  return Object.entries(groupedByDate)
    .map(([date, dayMovements]) => {
      const entries = dayMovements.filter((m) => m.type === "entrada");
      const exits = dayMovements.filter((m) => m.type === "salida");

      const groupByType = (movements: CargoMovement[]): CargoSummary[] => {
        const grouped = movements.reduce((acc, movement) => {
          if (!acc[movement.cargoType]) {
            acc[movement.cargoType] = [];
          }
          acc[movement.cargoType].push(movement);
          return acc;
        }, {} as Record<string, CargoMovement[]>);

        return Object.entries(grouped).map(([cargoType, items]) => ({
          cargoType,
          count: items.length,
          totalWeight: items.reduce((sum, item) => sum + item.weightKg, 0),
          totalUnits: items.reduce((sum, item) => sum + item.quantity, 0),
          items,
        }));
      };

      const entrySummaries = groupByType(entries);
      const exitSummaries = groupByType(exits);

      return {
        date,
        entries: entrySummaries,
        exits: exitSummaries,
        totals: {
          totalEntries: entries.length,
          totalExits: exits.length,
          totalWeightIn: entries.reduce((sum, item) => sum + item.weightKg, 0),
          totalWeightOut: exits.reduce((sum, item) => sum + item.weightKg, 0),
          totalUnitsIn: entries.reduce((sum, item) => sum + item.quantity, 0),
          totalUnitsOut: exits.reduce((sum, item) => sum + item.quantity, 0),
        },
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatWeight = (weight: number): string => {
  return `${weight.toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} kg`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString("es-ES");
};
