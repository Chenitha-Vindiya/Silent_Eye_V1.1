import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import {
  insertSensorDataSchema,
  insertSystemSettingsSchema,
  insertActivityLogSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // REST API routes
  app.get("/api/sensors", async (req, res) => {
    try {
      const sensorType = req.query.type as string | undefined;
      const data = await storage.getLatestSensorData(sensorType);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sensor data" });
    }
  });

  app.get("/api/sensors/:type/history", async (req, res) => {
    try {
      const { type } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const data = await storage.getSensorHistory(type, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sensor history" });
    }
  });

  app.post("/api/sensors", async (req, res) => {
    try {
      const validatedData = insertSensorDataSchema.parse(req.body);
      const sensorData = await storage.createSensorData(validatedData);

      // Broadcast to WebSocket clients
      broadcastSensorUpdate(sensorData);

      res.status(201).json(sensorData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid sensor data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create sensor data" });
      }
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSystemSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSystemSettingsSchema
        .partial()
        .parse(req.body);
      const settings = await storage.updateSystemSettings(validatedData);

      // Broadcast settings update to WebSocket clients
      broadcastSettingsUpdate(settings);

      // Log the settings change
      await storage.createActivityLog({
        type: "info",
        message: `System settings updated`,
        icon: "fas fa-cog",
      });

      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid settings data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update settings" });
      }
    }
  });

  app.get("/api/activity", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getActivityLog(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity log" });
    }
  });

  app.post("/api/activity", async (req, res) => {
    try {
      const validatedData = insertActivityLogSchema.parse(req.body);
      const activity = await storage.createActivityLog(validatedData);

      // Broadcast activity to WebSocket clients
      broadcastActivityUpdate(activity);

      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Invalid activity data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create activity log" });
      }
    }
  });

  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket client connected");

    // Send initial data to new client
    sendInitialData(ws);

    ws.on("message", async (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());

        // Handle different message types
        switch (data.type) {
          case "settings_update":
            const settings = await storage.updateSystemSettings(data.payload);
            broadcastSettingsUpdate(settings);
            break;

          case "sensor_update":
            const sensorData = await storage.createSensorData(data.payload);
            broadcastSensorUpdate(sensorData);
            break;

          case "ping":
            ws.send(JSON.stringify({ type: "pong" }));
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  // Helper functions for broadcasting
  function broadcastToAll(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  function broadcastSensorUpdate(sensorData: any) {
    broadcastToAll({
      type: "sensor_update",
      payload: sensorData,
    });
  }

  function broadcastSettingsUpdate(settings: any) {
    broadcastToAll({
      type: "settings_update",
      payload: settings,
    });
  }

  function broadcastActivityUpdate(activity: any) {
    broadcastToAll({
      type: "activity_update",
      payload: activity,
    });
  }

  async function sendInitialData(ws: WebSocket) {
    try {
      const [sensors, settings, activities] = await Promise.all([
        storage.getLatestSensorData(),
        storage.getSystemSettings(),
        storage.getActivityLog(10),
      ]);

      ws.send(
        JSON.stringify({
          type: "initial_data",
          payload: {
            sensors,
            settings,
            activities,
          },
        })
      );
    } catch (error) {
      console.error("Error sending initial data:", error);
    }
  }

  // Simulate sensor data updates every 5 seconds
  setInterval(async () => {
    try {
      // Simulate temperature fluctuations
      // const temperatureUpdate = await storage.createSensorData({
      //   sensorType: "temperature",
      //   value: 20 + Math.random() * 10, // 20-30°C
      //   unit: "celsius",
      //   status: "normal",
      // });

      // Instead of generating random temperature, get the latest stored temperature value
      const latestSensors = await storage.getLatestSensorData();
      const latestTemperature = latestSensors.find(
        (s) => s.sensorType === "temperature"
      );

      if (latestTemperature) {
        broadcastSensorUpdate(latestTemperature);
      }

      // Simulate battery level changes
      const batteryUpdate = await storage.createSensorData({
        sensorType: "battery",
        value: 85 + Math.random() * 15, // 85-100%
        unit: "percent",
        status: "good",
      });

      // Occasionally simulate motion detection
      if (Math.random() < 0.1) {
        // 10% chance
        const motionUpdate = await storage.createSensorData({
          sensorType: "motion_pir",
          value: 1,
          unit: "boolean",
          status: "detected",
        });

        await storage.createActivityLog({
          type: "warning",
          message: "Motion detected in living area",
          icon: "fas fa-running",
        });
      }

      // broadcastSensorUpdate(temperatureUpdate);
      broadcastSensorUpdate(batteryUpdate);
    } catch (error) {
      console.error("Error simulating sensor updates:", error);
    }
  }, 5000);

  return httpServer;
}
