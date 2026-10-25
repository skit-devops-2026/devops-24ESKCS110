import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/items.routes.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    const allowed = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
      .split(",").map((item) => item.trim());
    // Permit command-line clients (curl/Postman) which do not send Origin.
    if (!origin || allowed.includes("*") || allowed.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, service: "devvault-api", database: "connected", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api", itemRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
