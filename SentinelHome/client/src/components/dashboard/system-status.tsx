import type { SensorReading, SystemSettings } from '@/lib/types';

interface SystemStatusProps {
  sensors: SensorReading[];
  settings: SystemSettings | null;
  onToggleSystemArm: (armed: boolean) => void;
}

export default function SystemStatus({ sensors, settings, onToggleSystemArm }: SystemStatusProps) {
  const activeSensors = sensors.filter(s => s.status !== 'inactive').length;
  const alertsToday = 0; // Would be calculated from activity log
  const batteryLevel = sensors.find(s => s.sensorType === 'battery')?.value ?? 0;

  return (
    <div className="glass rounded-xl p-4 glow-green">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-green-400">System Status</h2>
        <div 
          className={`toggle-switch ${settings?.systemArmed ? 'active' : ''}`}
          onClick={() => onToggleSystemArm(!settings?.systemArmed)}
          data-testid="toggle-system-arm"
        />
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-2xl font-bold text-green-400" data-testid="text-active-sensors">
            {activeSensors}
          </div>
          <div className="text-xs text-slate-400">Active Sensors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400" data-testid="text-alerts-today">
            {alertsToday}
          </div>
          <div className="text-xs text-slate-400">Alerts Today</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-400" data-testid="text-battery-level">
            {Math.round(batteryLevel)}%
          </div>
          <div className="text-xs text-slate-400">Battery</div>
        </div>
      </div>
    </div>
  );
}
