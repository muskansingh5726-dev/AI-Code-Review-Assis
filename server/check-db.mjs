import dotenv from "dotenv";
dotenv.config();

import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

try {
  const result = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name",
    ["public"]
  );

  console.log("Database tables:", result.rows.map(row => row.table_name));
} catch (error) {
  console.error("Database check failed:", error.message);
} finally {
  await pool.end();
}
