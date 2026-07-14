import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
console.log("DATABASE:", process.env.DATABASE_URL ? "FOUND ✅" : "MISSING ❌");
console.log("JWT:", process.env.JWT_SECRET ? "FOUND ✅" : "MISSING ❌");
console.log("GROQ:", process.env.GROQ_API_KEY ? "FOUND ✅" : "MISSING ❌");
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import pool from "./config/db.js";

// Resolve .env path

console.log("Groq Loaded:", process.env.GROQ_API_KEY ? "YES ✅" : "NO ❌");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);

pool.connect()
    .then(() => console.log("✅ PostgreSQL Connected Successfully!"))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});