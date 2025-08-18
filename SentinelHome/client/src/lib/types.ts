export interface SensorReading {
  id: string;
  sensorType: string;
  value: number;
  unit?: string;
  status: string;
  timestamp: Date;
}

export interface SystemSettings {
  id: string;
  systemArmed: boolean;
  autoLights: boolean;
  dailyReminder: boolean;
  alertBuzzer: boolean;
  temperatureThreshold: number;
  gasThreshold: number;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  type: string;
  message: string;
  icon: string;
  timestamp: Date;
}

export interface DashboardData {
  sensors: SensorReading[];
  settings: SystemSettings;
  activities: ActivityLog[];
}
