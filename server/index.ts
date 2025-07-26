// Main server setup - this runs the backend
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Create the Express server
const app = express();

// Middleware to parse JSON and form data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware - tracks how long API requests take
app.use((req, res, next) => {
  const start = Date.now(); // Record when request started
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Capture the response data for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log the request details when it's finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    // Only log API requests (not static files)
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Keep log lines short for readability
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next(); // Continue to next middleware
});

// Start the server
(async () => {
  // Set up API routes (mood tracking, mission logs, etc.)
  const server = await registerRoutes(app);

  // Error handling middleware - catches any problems and returns a nice error message
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Set up file serving
  // In development: Use Vite for hot reloading (files update automatically)
  // In production: Serve pre-built static files
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start the server on the specified port
  // Replit provides PORT environment variable, default to 5000 if not set
  // This serves both the API and the website
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0", // Listen on all network interfaces
    reusePort: true, // Allow multiple processes to use same port
  }, () => {
    log(`serving on port ${port}`);
  });
})();
