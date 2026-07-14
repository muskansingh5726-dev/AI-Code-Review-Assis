import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("✅ Connected to Neon Database");
});

pool.on("error", (err) => {
  console.error("❌ Database Error:", err);
});

export default pool;