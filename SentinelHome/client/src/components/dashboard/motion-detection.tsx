import { Activity, Eye } from 'lucide-react';
import type { SensorReading } from '@/lib/types';

interface MotionDetectionProps {
  sensors: SensorReading[];
}

export default function MotionDetection({ sensors }: MotionDetectionProps) {
  const laserSensor = sensors.find(s => s.sensorType === 'motion_laser');
  const pirSensor = sensors.find(s => s.sensorType === 'motion_pir');

  const motionStatus = (pirSensor?.status === 'detected' || laserSensor?.status === 'interrupted') 
    ? 'MOTION' : 'SECURE';

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <Activity className="text-blue-400 mr-2 w-4 h-4" />
          Motion Detection
        </h3>
        <span 
          className={`text-xs font-medium ${motionStatus === 'MOTION' ? 'text-red-400' : 'text-green-400'}`}
          data-testid="text-motion-status"
        >
          {motionStatus}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-3" />
            <div>
              <div className="font-medium text-sm">Laser Beam</div>
              <div className="text-xs text-slate-400" data-testid="text-laser-reading">
                Signal: {laserSensor?.status === 'active' ? 'Strong' : 'Weak'}
              </div>
            </div>
          </div>
          <div 
            className={`w-2 h-2 rounded-full ${
              laserSensor?.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`} 
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center">
            <Eye className="text-purple-400 mr-3 w-4 h-4" />
            <div>
              <div className="font-medium text-sm">PIR Sensor</div>
              <div className="text-xs text-slate-400" data-testid="text-pir-reading">
                {pirSensor?.status === 'detected' ? 'Movement Detected' : 'No Movement'}
              </div>
            </div>
          </div>
          <div 
            className={`w-2 h-2 rounded-full ${
              pirSensor?.status === 'detected' ? 'bg-red-400 animate-pulse' : 'bg-green-400'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
