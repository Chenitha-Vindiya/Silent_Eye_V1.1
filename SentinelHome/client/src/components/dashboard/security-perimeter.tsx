import { DoorOpen, DoorClosed, Square } from 'lucide-react';
import type { SensorReading } from '@/lib/types';

interface SecurityPerimeterProps {
  sensors: SensorReading[];
}

export default function SecurityPerimeter({ sensors }: SecurityPerimeterProps) {
  const entryPoints = [
    { 
      name: 'Front Door', 
      sensor: sensors.find(s => s.sensorType === 'door_front'),
      type: 'door'
    },
    { 
      name: 'Back Door', 
      sensor: sensors.find(s => s.sensorType === 'door_back'),
      type: 'door'
    },
    { 
      name: 'Living Room Window', 
      sensor: sensors.find(s => s.sensorType === 'window_living'),
      type: 'window'
    },
    { 
      name: 'Bedroom Window', 
      sensor: sensors.find(s => s.sensorType === 'window_bedroom'),
      type: 'window'
    },
  ];

  const allSecured = entryPoints.every(point => point.sensor?.status === 'closed');

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <DoorOpen className="text-yellow-400 mr-2 w-4 h-4" />
          Entry Points
        </h3>
        <span 
          className={`text-xs font-medium ${allSecured ? 'text-green-400' : 'text-red-400'}`}
          data-testid="text-perimeter-status"
        >
          {allSecured ? 'SECURED' : 'BREACH'}
        </span>
      </div>
      
      <div className="space-y-2">
        {entryPoints.map((point, index) => {
          const isOpen = point.sensor?.status === 'open';
          const Icon = point.type === 'door' ? 
            (isOpen ? DoorOpen : DoorClosed) : 
            Square;
          
          return (
            <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
              <div className="flex items-center">
                <Icon 
                  className={`mr-3 text-sm w-4 h-4 ${
                    isOpen ? 'text-red-400' : 'text-green-400'
                  }`}
                />
                <span className="text-sm" data-testid={`text-entry-${point.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  {point.name}
                </span>
              </div>
              <span 
                className={`text-xs ${isOpen ? 'text-red-400' : 'text-green-400'}`}
                data-testid={`status-entry-${point.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
