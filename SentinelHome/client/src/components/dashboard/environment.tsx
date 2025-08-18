import { Thermometer } from 'lucide-react';
import type { SensorReading } from '@/lib/types';

interface EnvironmentProps {
  sensors: SensorReading[];
}

export default function Environment({ sensors }: EnvironmentProps) {
  const temperatureSensor = sensors.find(s => s.sensorType === 'temperature');
  const gasSensor = sensors.find(s => s.sensorType === 'gas');

  const temperature = temperatureSensor?.value ?? 0;
  const gasLevel = gasSensor?.value ?? 0;
  const tempPercentage = Math.min((temperature / 40) * 100, 100);
  const gasPercentage = Math.min((gasLevel / 1000) * 100, 100);

  const environmentStatus = (temperature > 30 || gasLevel > 500) ? 'WARNING' : 'NORMAL';

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <Thermometer className="text-orange-400 mr-2 w-4 h-4" />
          Environment
        </h3>
        <span 
          className={`text-xs font-medium ${environmentStatus === 'WARNING' ? 'text-red-400' : 'text-green-400'}`}
          data-testid="text-environment-status"
        >
          {environmentStatus}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
          <div className="text-xl font-bold text-blue-400" data-testid="text-temperature">
            {Math.round(temperature)}°C
          </div>
          <div className="text-xs text-slate-400">Temperature</div>
          <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
            <div 
              className="bg-blue-400 h-1 rounded-full transition-all duration-500" 
              style={{ width: `${tempPercentage}%` }}
            />
          </div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg text-center">
          <div 
            className={`text-xl font-bold ${gasLevel > 500 ? 'text-red-400' : 'text-green-400'}`}
            data-testid="text-gas-level"
          >
            {gasLevel > 500 ? 'HIGH' : 'LOW'}
          </div>
          <div className="text-xs text-slate-400">Gas Level</div>
          <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
            <div 
              className={`h-1 rounded-full transition-all duration-500 ${
                gasLevel > 500 ? 'bg-red-400' : 'bg-green-400'
              }`}
              style={{ width: `${gasPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
