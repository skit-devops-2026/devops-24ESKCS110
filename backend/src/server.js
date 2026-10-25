import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = Number(process.env.PORT || 5000);

try {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`DevVault API running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
} catch (error) {
  console.error("Could not start DevVault API:", error.message);
  process.exit(1);
}
