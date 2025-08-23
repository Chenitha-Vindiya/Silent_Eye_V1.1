import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.ts";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// --- API endpoint to receive sensor data from Arduino/ESP32 ---
app.post("/api/sensor", async (req: Request, res: Response) => {
  // console.log("Received POST /api/sensor with body:", req.body); // Logger for debugging
  const { temperature, gas, battery } = req.body;

  let stored = false;

  if (typeof temperature === "number") {
    // console.log("Storing temperature level:", temperature); // Logger for debugging
    await storage.createSensorData({
      sensorType: "temperature",
      value: temperature,
      unit: "celsius",
      status: temperature > 30 ? "high" : "normal",
    });
    stored = true;
  }
  if (typeof gas === "number") {
    // console.log("Storing gas level:", gas); // Logger for debugging
    await storage.createSensorData({
      sensorType: "gas",
      value: gas,
      unit: "ppm",
      status: gas > 500 ? "high" : "low",
    });
    stored = true;
  }
  if (typeof battery === "number") {
    // console.log("Storing battery level:", battery); // Logger for debugging
    await storage.createSensorData({
      sensorType: "battery",
      value: battery,
      unit: "percent",
      status: battery < 20 ? "low" : "good",
    });
    stored = true;
  }

  if (stored) {
    res.json({ success: true });
  } else {
    res
      .status(400)
      .json({ success: false, message: "No valid sensor data provided." });
  }
});
// ----------------------------------------------------------------------

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "localhost",
      // reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
