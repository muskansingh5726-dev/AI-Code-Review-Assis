import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import runRoutes from "./routes/run.js";

import pool from "./config/db.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/run", runRoutes);

pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Database Ready"))
  .catch((err) => console.error("❌ Database Error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});