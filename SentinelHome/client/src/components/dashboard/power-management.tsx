import { Battery, Sun, Zap } from 'lucide-react';
import type { SensorReading } from '@/lib/types';

interface PowerManagementProps {
  sensors: SensorReading[];
}

export default function PowerManagement({ sensors }: PowerManagementProps) {
  const batterySensor = sensors.find(s => s.sensorType === 'battery');
  const solarSensor = sensors.find(s => s.sensorType === 'solar_voltage');
  const consumptionSensor = sensors.find(s => s.sensorType === 'power_consumption');

  const batteryLevel = batterySensor?.value ?? 0;
  const solarVoltage = solarSensor?.value ?? 0;
  const consumption = consumptionSensor?.value ?? 0;

  const powerSource = solarVoltage > 4.5 ? 'SOLAR' : 'BATTERY';

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <Sun className="text-green-400 mr-2 w-4 h-4" />
          Power System
        </h3>
        <span 
          className={`text-xs font-medium ${powerSource === 'SOLAR' ? 'text-blue-400' : 'text-yellow-400'}`}
          data-testid="text-power-source"
        >
          {powerSource}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Battery className="text-green-400 mr-2 w-4 h-4" />
            <span>Battery Level</span>
          </div>
          <span className="font-bold text-green-400" data-testid="text-power-battery">
            {Math.round(batteryLevel)}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full glow-green transition-all duration-500" 
            style={{ width: `${batteryLevel}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-center text-xs">
          <div className="p-2 bg-slate-800/50 rounded">
            <div className="font-bold text-yellow-400" data-testid="text-solar-voltage">
              {solarVoltage.toFixed(1)}V
            </div>
            <div className="text-slate-400">Solar Input</div>
          </div>
          <div className="p-2 bg-slate-800/50 rounded">
            <div className="font-bold text-blue-400" data-testid="text-power-consumption">
              {Math.round(consumption)}mA
            </div>
            <div className="text-slate-400">Consumption</div>
          </div>
        </div>
      </div>
    </div>
  );
}
