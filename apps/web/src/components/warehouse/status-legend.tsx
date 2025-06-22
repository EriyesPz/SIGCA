import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { statusConfig } from "@/components/common/status-config"

export const StatusLegend = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded ${config.color}`} />
            <span className="text-sm">{config.label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
