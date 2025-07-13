import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Coffee, Clock, Sun, Sunset, Moon } from "lucide-react"
import type { StaffMetrics } from "./types"

interface StaffMetricsCardProps {
  staff: StaffMetrics
}

export const StaffMetricsCard = ({ staff }: StaffMetricsCardProps) => {
  const getShiftIcon = (shift: string) => {
    const iconClass = "w-4 h-4"
    switch (shift) {
      case "morning":
        return <Sun className={`${iconClass} text-yellow-600`} />
      case "afternoon":
        return <Sunset className={`${iconClass} text-orange-600`} />
      case "night":
        return <Moon className={`${iconClass} text-blue-600`} />
      default:
        return <Sun className={iconClass} />
    }
  }

  const getShiftLabel = (shift: string) => {
    const labels = {
      morning: "Mañana",
      afternoon: "Tarde",
      night: "Noche",
    }
    return labels[shift as keyof typeof labels] || shift
  }

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 90) return "text-green-600"
    if (productivity >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return "text-green-600"
    if (attendance >= 90) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Personal y Recursos Humanos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Staff Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{staff.activeStaff}</span>
              </div>
              <p className="text-sm text-muted-foreground">Personal Activo</p>
              <p className="text-xs text-green-600">de {staff.totalStaff} total</p>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coffee className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{staff.onBreak}</span>
              </div>
              <p className="text-sm text-muted-foreground">En Descanso</p>
              <p className="text-xs text-blue-600">Personal disponible</p>
            </div>
          </div>

          {/* Overtime */}
          {staff.overtime > 0 && (
            <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">{staff.overtime} empleados en horas extra</span>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Productividad</span>
                <span className={`font-bold ${getProductivityColor(staff.productivity)}`}>{staff.productivity}%</span>
              </div>
              <Progress value={staff.productivity} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Asistencia</span>
                <span className={`font-bold ${getAttendanceColor(staff.attendance)}`}>{staff.attendance}%</span>
              </div>
              <Progress value={staff.attendance} className="h-2" />
            </div>
          </div>

          {/* Shift Distribution */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Distribución por Turnos</h4>
            {Object.entries(staff.shifts).map(([shift, count]) => (
              <div key={shift} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {getShiftIcon(shift)}
                  <span className="text-sm">{getShiftLabel(shift)}</span>
                </div>
                <Badge variant="outline">{count} personas</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
