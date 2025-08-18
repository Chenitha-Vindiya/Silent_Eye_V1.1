import { type User, type InsertUser, type SensorData, type InsertSensorData, type SystemSettings, type InsertSystemSettings, type ActivityLog, type InsertActivityLog } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sensor data methods
  getLatestSensorData(sensorType?: string): Promise<SensorData[]>;
  createSensorData(data: InsertSensorData): Promise<SensorData>;
  getSensorHistory(sensorType: string, limit?: number): Promise<SensorData[]>;
  
  // System settings methods
  getSystemSettings(): Promise<SystemSettings | undefined>;
  updateSystemSettings(settings: Partial<InsertSystemSettings>): Promise<SystemSettings>;
  
  // Activity log methods
  getActivityLog(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sensorData: Map<string, SensorData>;
  private systemSettings: SystemSettings | undefined;
  private activityLogs: Map<string, ActivityLog>;

  constructor() {
    this.users = new Map();
    this.sensorData = new Map();
    this.activityLogs = new Map();
    
    // Initialize default system settings
    this.systemSettings = {
      id: randomUUID(),
      systemArmed: true,
      autoLights: true,
      dailyReminder: true,
      alertBuzzer: true,
      temperatureThreshold: 30,
      gasThreshold: 500,
      updatedAt: new Date(),
    };

    // Initialize some sample sensor data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize current sensor readings
    const sensorTypes = [
      { type: "motion_laser", value: 85, unit: "percent", status: "active" },
      { type: "motion_pir", value: 0, unit: "boolean", status: "inactive" },
      { type: "temperature", value: 22, unit: "celsius", status: "normal" },
      { type: "gas", value: 120, unit: "ppm", status: "low" },
      { type: "door_front", value: 0, unit: "boolean", status: "closed" },
      { type: "door_back", value: 0, unit: "boolean", status: "closed" },
      { type: "window_living", value: 0, unit: "boolean", status: "closed" },
      { type: "window_bedroom", value: 0, unit: "boolean", status: "closed" },
      { type: "battery", value: 87, unit: "percent", status: "good" },
      { type: "solar_voltage", value: 5.2, unit: "volts", status: "active" },
      { type: "power_consumption", value: 340, unit: "mA", status: "normal" },
    ];

    sensorTypes.forEach(sensor => {
      const data: SensorData = {
        id: randomUUID(),
        sensorType: sensor.type,
        value: sensor.value,
        unit: sensor.unit,
        status: sensor.status,
        timestamp: new Date(),
      };
      this.sensorData.set(data.id, data);
    });

    // Add some initial activity logs
    const activities = [
      { type: "info", message: "System armed successfully", icon: "fas fa-check-circle" },
      { type: "warning", message: "Motion detected - snapshot taken", icon: "fas fa-camera" },
      { type: "info", message: "Temperature normal (22°C)", icon: "fas fa-thermometer-half" },
      { type: "info", message: "All entry points secured", icon: "fas fa-shield-alt" },
      { type: "info", message: "Solar power system active", icon: "fas fa-solar-panel" },
    ];

    activities.forEach((activity, index) => {
      const log: ActivityLog = {
        id: randomUUID(),
        type: activity.type,
        message: activity.message,
        icon: activity.icon,
        timestamp: new Date(Date.now() - index * 3600000), // Spread over hours
      };
      this.activityLogs.set(log.id, log);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLatestSensorData(sensorType?: string): Promise<SensorData[]> {
    const allData = Array.from(this.sensorData.values());
    if (sensorType) {
      return allData.filter(data => data.sensorType === sensorType);
    }
    
    // Group by sensor type and return latest of each
    const latestBySensor = new Map<string, SensorData>();
    allData.forEach(data => {
      const existing = latestBySensor.get(data.sensorType);
      if (!existing || data.timestamp > existing.timestamp) {
        latestBySensor.set(data.sensorType, data);
      }
    });
    
    return Array.from(latestBySensor.values());
  }

  async createSensorData(data: InsertSensorData): Promise<SensorData> {
    const id = randomUUID();
    const sensorData: SensorData = {
      ...data,
      id,
      timestamp: new Date(),
    };
    this.sensorData.set(id, sensorData);
    return sensorData;
  }

  async getSensorHistory(sensorType: string, limit: number = 50): Promise<SensorData[]> {
    return Array.from(this.sensorData.values())
      .filter(data => data.sensorType === sensorType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getSystemSettings(): Promise<SystemSettings | undefined> {
    return this.systemSettings;
  }

  async updateSystemSettings(settings: Partial<InsertSystemSettings>): Promise<SystemSettings> {
    if (this.systemSettings) {
      this.systemSettings = {
        ...this.systemSettings,
        ...settings,
        updatedAt: new Date(),
      };
    } else {
      this.systemSettings = {
        id: randomUUID(),
        systemArmed: false,
        autoLights: true,
        dailyReminder: true,
        alertBuzzer: true,
        temperatureThreshold: 30,
        gasThreshold: 500,
        updatedAt: new Date(),
        ...settings,
      };
    }
    return this.systemSettings;
  }

  async getActivityLog(limit: number = 20): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const activityLog: ActivityLog = {
      ...log,
      id,
      timestamp: new Date(),
    };
    this.activityLogs.set(id, activityLog);
    return activityLog;
  }
}

export const storage = new MemStorage();
